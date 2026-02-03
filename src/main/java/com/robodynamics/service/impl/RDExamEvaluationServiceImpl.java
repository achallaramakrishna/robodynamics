package com.robodynamics.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.ai.OpenAIEvaluationClient;
import com.robodynamics.dao.RDExamAIEvaluationDAO;
import com.robodynamics.dao.RDExamAISummaryDAO;
import com.robodynamics.dto.AIEvaluationBatchResult;
import com.robodynamics.dto.AIEvaluationResult;
import com.robodynamics.model.RDExamSubmission;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.service.RDExamEvaluationService;
import com.robodynamics.service.RDExamSubmissionService;
import com.robodynamics.util.JsonUtils;
import com.robodynamics.model.RDExamAIEvaluation;
import com.robodynamics.model.RDExamAISummary;
import com.robodynamics.model.RDExamAnswerKey;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDExamSection;
import com.robodynamics.model.RDExamSectionQuestion;
import com.robodynamics.service.RDExamPaperService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.math.BigDecimal;
import java.nio.file.Files;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.nio.file.Path;

@Service
@Transactional
public class RDExamEvaluationServiceImpl
        implements RDExamEvaluationService {
	
	private final ObjectMapper mapper = new ObjectMapper();


    @Autowired
    private RDExamSubmissionService submissionService;

    @Autowired
    private OpenAIEvaluationClient openAIEvaluationClient;
    
    @Autowired
    private RDExamPaperService examPaperService;
    
    @Autowired
    private RDExamAIEvaluationDAO evaluationDAO;

    @Autowired
    private RDExamAISummaryDAO summaryDAO;



    @Override
    public void evaluateSubmission(Integer submissionId) {

        RDExamSubmission submission =
                submissionService.getByIdWithFiles(submissionId);

        if (submission == null || submission.getFilePaths() == null) return;

        // 1️⃣ Extract student text
        String studentAnswerText = extractTextFromFiles(submission);

        // 2️⃣ Load exam paper
        RDExamPaper examPaper =
                examPaperService.getExamPaperWithDetails(
                        submission.getExamPaperId()
                );

        if (examPaper == null || examPaper.getSections() == null) return;

        // 3️⃣ Build evaluation input JSON
        String evaluationJson =
                buildEvaluationInputJson(examPaper, studentAnswerText);

        // 4️⃣ Call OpenAI ONCE
        String aiResponseJson =
                openAIEvaluationClient.evaluateExamBatch(evaluationJson);

        // 5️⃣ Parse + validate AI response
        AIEvaluationBatchResult batchResult =
                parseAndValidate(aiResponseJson, examPaper);

        // 6️⃣ Persist results (Phase-1: log / Phase-2: DB)
        persistBatchEvaluation(submission, batchResult);
    }

    private String buildEvaluationInputJson(
            RDExamPaper examPaper,
            String studentAnswerText
    ) {

        List<Map<String, Object>> questions = new ArrayList<>();

        for (RDExamSection section : examPaper.getSections()) {
            for (RDExamSectionQuestion sq : section.getQuestions()) {

                RDExamAnswerKey ak = sq.getAnswerKey();

                Map<String, Object> q = new LinkedHashMap<>();
                q.put("questionId", sq.getId());
                q.put("questionText", sq.getQuestion().getQuestionText());
                q.put("maxMarks", sq.getMarks());
                q.put("modelAnswer", ak != null ? ak.getModelAnswer() : null);
                q.put("keyPoints", ak != null ? ak.getKeyPoints() : null);
                q.put("expectedKeywords", ak != null ? ak.getExpectedKeywords() : null);

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
        root.put("studentAnswerText", studentAnswerText);
        root.put("questions", questions);

        
        return JsonUtils.toJson(root); // Jackson / Gson
    }


    /* ================= HELPER METHODS ================= */

    private String extractTextFromFiles(RDExamSubmission submission) {

        StringBuilder extracted = new StringBuilder();

        List<String> paths = submission.getFilePaths();

        for (String filePath : paths) {
            try {
                Path path = Paths.get(filePath);
                String lower = filePath.toLowerCase();

                if (lower.endsWith(".pdf")) {
                    extracted.append(extractFromPdf(path));
                } 
                else if (lower.endsWith(".jpg")
                      || lower.endsWith(".jpeg")
                      || lower.endsWith(".png")) {

                    // Phase-1 OCR stub
                    extracted.append("[IMAGE OCR CONTENT]\n");
                } 
                else if (lower.endsWith(".txt")) {
                    extracted.append(Files.readString(path));
                }

                extracted.append("\n\n");

            } catch (Exception e) {
                extracted.append("[ERROR READING FILE: ")
                         .append(filePath)
                         .append("]\n");
            }
        }

        return extracted.toString();
    }


        
    private String extractFromPdf(Path pdfPath) throws Exception {

        try (PDDocument document = PDDocument.load(pdfPath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
    


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
                    "AI returned " +
                    (result.getEvaluations() == null ? 0 : result.getEvaluations().size()) +
                    " evaluations, expected " + expectedCount
                );
            }

            // Validate marks do not exceed maxMarks
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
                        "Invalid questionId returned by AI: " + qe.getQuestionId()
                    );
                }

                if (qe.getMarksAwarded() < 0 ||
                    qe.getMarksAwarded() > max) {

                    throw new IllegalStateException(
                        "Invalid marks for questionId " + qe.getQuestionId()
                    );
                }
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("AI response validation failed", e);
        }
    }

    
    private void persistBatchEvaluation(
            RDExamSubmission submission,
            AIEvaluationBatchResult batchResult
    ) {

        // Optional: clear old AI evaluations if re-run
        evaluationDAO.deleteBySubmissionId(submission.getSubmissionId());

        BigDecimal totalMarks = BigDecimal.ZERO;
        int order = 1;

        for (AIEvaluationBatchResult.QuestionEvaluation qe
                : batchResult.getEvaluations()) {

        	RDExamSectionQuestion sectionQuestion =
        	        examPaperService.getSectionQuestionById(
        	                qe.getQuestionId()
        	        );


            if (sectionQuestion == null) {
                // Safety check — should never happen due to validation
                continue;
            }

            RDExamAIEvaluation eval = new RDExamAIEvaluation();
            eval.setSubmission(submission);
            eval.setSectionQuestion(sectionQuestion);
            eval.setQuestionOrder(order++);
            eval.setMarksAwarded(
                    BigDecimal.valueOf(qe.getMarksAwarded())
            );
            eval.setConfidence(qe.getConfidence());
            eval.setFeedback(qe.getFeedback());
            eval.setEvaluatedBy("AI");

            evaluationDAO.save(eval);

            totalMarks = totalMarks.add(
                    BigDecimal.valueOf(qe.getMarksAwarded())
            );
        }

        // ===== SUMMARY =====
        RDExamAISummary summary =
                summaryDAO.findBySubmissionId(
                        submission.getSubmissionId()
                );

        if (summary == null) {
            summary = new RDExamAISummary();
            summary.setSubmission(submission);
        }

        summary.setTotalMarks(totalMarks);
        summary.setOverallFeedback(batchResult.getOverallFeedback());
        summary.setEvaluatedBy("AI");

        summaryDAO.saveOrUpdate(summary);
        submissionService.markEvaluated(submission.getSubmissionId());

        
    }

}
