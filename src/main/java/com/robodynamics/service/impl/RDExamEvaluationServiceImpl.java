package com.robodynamics.service.impl;

import java.io.File;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Paths;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.ai.OpenAIEvaluationClient;
import com.robodynamics.dao.RDExamAIEvaluationDAO;
import com.robodynamics.dao.RDExamAISummaryDAO;
import com.robodynamics.dto.AIEvaluationBatchResult;
import com.robodynamics.model.*;
import com.robodynamics.service.*;
import com.robodynamics.util.JsonUtils;

@Service
public class RDExamEvaluationServiceImpl implements RDExamEvaluationService {

    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired private RDExamSubmissionService submissionService;
    @Autowired private OpenAIVisionOCRService openAIVisionOCRService;
    @Autowired private PdfImageService pdfImageService;
    @Autowired private OpenAIEvaluationClient openAIEvaluationClient;
    @Autowired private RDExamPaperService examPaperService;
    @Autowired private RDExamAIEvaluationDAO evaluationDAO;
    @Autowired private RDExamAISummaryDAO summaryDAO;
    @Autowired private AITextReconstructionService aiTextReconstructionService;

    @Autowired
    private RuleBasedEvaluationService ruleBasedEvaluationService;

    /* ===================================================== */

    @Override
    @Transactional
    public void evaluateSubmission(Integer submissionId) {

        System.out.println("🔥 EVALUATION STARTED submissionId=" + submissionId);

        RDExamSubmission submission =
                submissionService.getByIdWithFiles(submissionId);

        if (submission == null || submission.getFilePaths() == null) return;

        // 1️⃣ OCR
        String studentText = extractTextFromFiles(submission);

        // 2️⃣ Load exam paper
        RDExamPaper examPaper =
                examPaperService.getExamPaperWithDetails(
                        submission.getExamPaperId()
                );

        if (examPaper == null || examPaper.getSections() == null) return;

        // 3️⃣ Reconstruct answers
        Map<Integer, String> answersByQuestionId =
                aiTextReconstructionService.reconstructAnswersMap(
                        examPaper,
                        studentText
                );

        // 4️⃣ Build evaluation JSON
        String evaluationJson =
                buildEvaluationInputJson(examPaper, answersByQuestionId);
        
        System.out.println("=========== AI INPUT DEBUG ===========");

        for (RDExamSection s : examPaper.getSections()) {
            for (RDExamSectionQuestion sq : s.getQuestions()) {
                System.out.println("Sending QID to AI = " + sq.getId());
            }
        }

        System.out.println("======================================");


        // 5️⃣ Call AI
        String aiResponseJson =
                openAIEvaluationClient.evaluateExamBatch(evaluationJson);

        // 6️⃣ Parse + Validate
        AIEvaluationBatchResult batchResult =
                parseAndValidate(aiResponseJson, examPaper);
        
        System.out.println("=========== AI RESPONSE DEBUG ===========");

        for (AIEvaluationBatchResult.QuestionEvaluation qe
                : batchResult.getEvaluations()) {

            System.out.println("AI Returned QID = "
                    + qe.getQuestionId()
                    + " | Marks = "
                    + qe.getMarksAwarded());
        }

        System.out.println("=========================================");


        // 7️⃣ Persist
        persistBatchEvaluation(submission, batchResult, answersByQuestionId);

        System.out.println("✅ EVALUATION COMPLETED submissionId=" + submissionId);
    }

    /* ===================================================== */

    private void persistBatchEvaluation(
            RDExamSubmission submission,
            AIEvaluationBatchResult batchResult,
            Map<Integer, String> studentAnswerMap
    ) {

        evaluationDAO.deleteBySubmissionId(submission.getSubmissionId());

        BigDecimal totalMarks = BigDecimal.ZERO;
        int order = 1;

        for (AIEvaluationBatchResult.QuestionEvaluation qe : batchResult.getEvaluations()) {

            try {

                RDExamSectionQuestion sectionQuestion =
                        examPaperService.getSectionQuestionById(qe.getQuestionId());

                if (sectionQuestion == null) {
                    System.err.println("⚠ Unknown questionId: " + qe.getQuestionId());
                    continue;
                }

                String studentAnswer =
                        studentAnswerMap.get(qe.getQuestionId());

                // 🔹 Rule-based evaluation first
                BigDecimal ruleMarks =
                        ruleBasedEvaluationService.evaluate(
                                sectionQuestion,
                                studentAnswer
                        );

                BigDecimal marksAwarded;

                // If rule engine gives a decision → override AI
                if (ruleMarks != null) {

                    marksAwarded = ruleMarks
                            .setScale(2, RoundingMode.HALF_UP);

                    System.out.println("✅ RULE ENGINE OVERRIDE for QID="
                            + qe.getQuestionId()
                            + " | Marks="
                            + marksAwarded);

                } else {

                    // Fall back to AI marks
                    marksAwarded = BigDecimal
                            .valueOf(qe.getMarksAwarded())
                            .setScale(2, RoundingMode.HALF_UP);
                }

                RDExamAIEvaluation eval = new RDExamAIEvaluation();
                eval.setSubmission(submission);
                eval.setSectionQuestion(sectionQuestion);
                eval.setQuestionOrder(order++);
                eval.setMarksAwarded(marksAwarded);
                eval.setConfidence(normalizeConfidence(qe.getConfidence()));
                eval.setFeedback(safeString(qe.getFeedback()));
                eval.setEvaluatedBy("AI");

                eval.setStudentAnswer(
                        normalizeStudentAnswer(
                                studentAnswerMap.get(qe.getQuestionId())
                        )
                );
                
                System.out.println("Saving evaluation for ESQ ID = "
                        + sectionQuestion.getId()
                        + " | StudentAnswer = "
                        + eval.getStudentAnswer());


                evaluationDAO.save(eval);

                totalMarks = totalMarks.add(marksAwarded);

            } catch (Exception ex) {
                System.err.println("❌ Failed saving QID="
                        + qe.getQuestionId() + " → " + ex.getMessage());
            }
        }

        RDExamAISummary summary =
                summaryDAO.findBySubmissionId(submission.getSubmissionId());

        if (summary == null) {
            summary = new RDExamAISummary();
            summary.setSubmission(submission);
        }

        summary.setTotalMarks(totalMarks.setScale(2, RoundingMode.HALF_UP));
        summary.setOverallFeedback(safeString(batchResult.getOverallFeedback()));
        summary.setEvaluatedBy("AI");

        summaryDAO.saveOrUpdate(summary);

        submissionService.markEvaluated(submission.getSubmissionId());
    }

    /* ===================================================== */

    private BigDecimal normalizeConfidence(Double confidence) {

        if (confidence == null) return new BigDecimal("0.500");

        BigDecimal bd = BigDecimal.valueOf(confidence);

        if (bd.compareTo(BigDecimal.ONE) > 0) {
            bd = bd.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        }

        if (bd.compareTo(BigDecimal.ZERO) < 0) bd = BigDecimal.ZERO;
        if (bd.compareTo(BigDecimal.ONE) > 0) bd = BigDecimal.ONE;

        return bd.setScale(3, RoundingMode.HALF_UP);
    }

    /* ===================================================== */

    private String normalizeStudentAnswer(String answer) {

        if (answer == null) return null;

        // Preserve math-critical characters: fractions (/), decimals (.), currency (₹, Rs),
        // operators (+, -, ×, ÷, %, =), parentheses, superscripts (²³), colons (:)
        // Only remove truly non-printable or irrelevant control characters.
        String cleaned = answer
                .replaceAll("\\r", "")         // remove carriage returns
                .replaceAll("\\t", " ")        // tabs → space
                .replaceAll("\\s{2,}", " ")    // collapse multiple spaces
                .trim();

        return cleaned.isEmpty() ? null : cleaned;
    }

    private String safeString(String s) {
        return s == null ? "" : s.trim();
    }

    /* ===================================================== */

    private String extractTextFromFiles(RDExamSubmission submission) {

        StringBuilder extracted = new StringBuilder();

        for (String filePath : submission.getFilePaths()) {

            try {
                List<File> images =
                        pdfImageService.convertPdfToImages(Paths.get(filePath));

                for (File img : images) {
                    extracted.append(
                            openAIVisionOCRService.extractTextFromImage(img)
                    ).append("\n\n");
                }

            } catch (Exception e) {
                extracted.append("[OCR FAILED: ")
                        .append(filePath)
                        .append("]\n");
            }
        }

        return extracted.toString();
    }

    /* ===================================================== */

    private AIEvaluationBatchResult parseAndValidate(
            String aiResponseJson,
            RDExamPaper examPaper
    ) {

        try {

            AIEvaluationBatchResult result =
                    mapper.readValue(aiResponseJson, AIEvaluationBatchResult.class);

            int expectedCount = examPaper.getSections()
                    .stream()
                    .mapToInt(s -> s.getQuestions().size())
                    .sum();

            if (result.getEvaluations() == null ||
                    result.getEvaluations().size() != expectedCount) {

                throw new IllegalStateException(
                        "AI returned invalid evaluation count"
                );
            }

            Map<Integer, Integer> maxMarksMap = new HashMap<>();

            for (RDExamSection s : examPaper.getSections()) {
                for (RDExamSectionQuestion q : s.getQuestions()) {
                    maxMarksMap.put(q.getId(), q.getMarks());
                }
            }

            for (AIEvaluationBatchResult.QuestionEvaluation qe
                    : result.getEvaluations()) {

                Integer max = maxMarksMap.get(qe.getQuestionId());

                if (max == null) {
                    throw new IllegalStateException(
                            "Invalid questionId returned by AI"
                    );
                }

                if (qe.getMarksAwarded() < 0 ||
                        qe.getMarksAwarded() > max) {

                    throw new IllegalStateException(
                            "Invalid marks returned by AI"
                    );
                }
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("AI response validation failed", e);
        }
    }

    /* ===================================================== */

    private String buildEvaluationInputJson(
            RDExamPaper examPaper,
            Map<Integer, String> answersByQuestionId
    ) {

        List<Map<String, Object>> questions = new ArrayList<>();

        for (RDExamSection section : examPaper.getSections()) {
            for (RDExamSectionQuestion sq : section.getQuestions()) {

                RDExamAnswerKey ak = sq.getAnswerKey();

                Map<String, Object> q = new LinkedHashMap<>();
                System.out.println("Sending to AI QID=" + sq.getId());

                q.put("questionId", sq.getId());
                q.put("questionText", sq.getQuestion().getQuestionText());
                q.put("maxMarks", sq.getMarks());

                q.put("modelAnswer", ak != null ? ak.getModelAnswer() : "");
                q.put("keyPoints", ak != null ? ak.getKeyPoints() : "");
                q.put("expectedKeywords", ak != null ? ak.getExpectedKeywords() : "");

                q.put("studentAnswer",
                        normalizeStudentAnswer(
                                answersByQuestionId.getOrDefault(sq.getId(), "")
                        )
                );

                questions.add(q);
            }
        }

        Map<String, Object> root = new LinkedHashMap<>();

        root.put("exam", Map.of(
                "examPaperId", examPaper.getExamPaperId(),
                "totalQuestions", questions.size(),
                "totalMarks", examPaper.getTotalMarks(),
                "subject", examPaper.getSubject(),
                "board", examPaper.getBoard()
        ));

        root.put("questions", questions);

        return JsonUtils.toJson(root);
    }
}
