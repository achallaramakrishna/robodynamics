package com.robodynamics.service.impl;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.ai.OpenAIEvaluationClient;
import com.robodynamics.dto.StudentAnswerMapResult;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDExamSection;
import com.robodynamics.model.RDExamSectionQuestion;
import com.robodynamics.service.AITextReconstructionService;
import com.robodynamics.util.JsonUtils;

@Service
public class AITextReconstructionServiceImpl implements AITextReconstructionService {

	// Matches question markers like: 1. 1) 1: Q1 Q.1 Q1. Q1) Ans.1 Ans1. Q. 1
	// Must be at start of line (after optional whitespace) and followed by space or newline
	private static final Pattern Q_PATTERN =
		    Pattern.compile("(?im)^\\s*(?:(?:Ans|Q|Question)\\s*[.)]?\\s*)?(\\d{1,2})\\s*[).:\\-]\\s*");


    @Autowired
    private OpenAIEvaluationClient openAIEvaluationClient;

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public StudentAnswerMapResult reconstructAnswers(RDExamPaper examPaper, String ocrText) {

        System.out.println("=========== OCR DEBUG ===========");
        System.out.println("OCR TEXT LENGTH = " + (ocrText == null ? 0 : ocrText.length()));
        System.out.println("=================================");

        // Build expected question order: Q1..Qn mapped to sectionQuestionId
        List<RDExamSectionQuestion> ordered = flattenQuestionsInOrder(examPaper);
        Map<Integer, Integer> qNoToQuestionId = new LinkedHashMap<>(); // qNo -> sectionQuestionId

        int qNo = 1;
        for (RDExamSectionQuestion sq : ordered) {
            qNoToQuestionId.put(qNo++, sq.getId());
        }

        // 1) ALWAYS try AI reconstruction first — it has question context and handles
        //    handwritten papers far better than regex when OCR captures mixed printed+handwritten text.
        StudentAnswerMapResult aiResult = reconstructUsingAI(examPaper, ocrText);
        if (aiResult != null && aiResult.getAnswersByQuestionId() != null
                && !aiResult.getAnswersByQuestionId().isEmpty()) {
            aiResult.setReconstructionNotes("AI reconstruction used (primary path).");
            System.out.println("=========== AI RECONSTRUCTION SUCCESS ===========");
            aiResult.getAnswersByQuestionId().forEach((k, v) ->
                System.out.println("QID = " + k + " -> [" + v + "]"));
            System.out.println("=================================================");
            return aiResult;
        }

        // 2) AI fallback failed — try deterministic regex parse
        Map<Integer, String> parsed = parseByQuestionMarkers(ocrText, qNoToQuestionId);
        double coverage = coverageRatio(parsed);

        System.out.println("=========== REGEX FALLBACK DEBUG ===========");
        System.out.println("Total questions expected: " + qNoToQuestionId.size());
        System.out.println("Parsed answers count: " + parsed.size());
        System.out.println("Coverage ratio: " + coverage);
        parsed.forEach((k, v) -> System.out.println("QID = " + k + " -> [" + v + "]"));
        System.out.println("============================================");

        StudentAnswerMapResult result = new StudentAnswerMapResult();
        result.setAnswersByQuestionId(parsed);
        result.setReconstructionNotes("Regex fallback used (AI failed). Coverage=" + coverage);
        return result;
    }

    private boolean hasSuspiciousAnswers(Map<Integer, String> answers) {
        int suspicious = 0;
        for (String v : answers.values()) {
            if (v != null && v.length() > 0 && v.length() < 4) {
                suspicious++;
            }
        }
        return suspicious > 2;
    }

    private boolean isSymbolicAnswer(String segment) {
        if (segment == null) return false;

        // Emoji or non-ASCII symbols
        boolean hasEmoji =
            segment.codePoints().anyMatch(cp -> cp > 0x1F000);

        // Mentions representation
        boolean symbolicLanguage =
            segment.matches("(?i).*(each|represents|symbol|picture|icon).*");

        // Very little numeric or textual content
        int alphaNumericCount =
            segment.replaceAll("[^a-zA-Z0-9]", "").length();

        return hasEmoji || (symbolicLanguage && alphaNumericCount < 10);
    }

    private String normalizeAnswer(String answer) {
        if (answer == null) return "";

        String segment = answer.trim();

        if (segment.length() < 2) return "";

        // Remove excessive OCR noise only
        segment = segment
            .replaceAll("(?i)\\bPage\\s*\\d+\\b", "")
            .replaceAll("\\s{2,}", " ")
            .trim();

        return segment;
    }


    private List<RDExamSectionQuestion> flattenQuestionsInOrder(RDExamPaper examPaper) {
        List<RDExamSectionQuestion> list = new ArrayList<>();
        for (RDExamSection s : examPaper.getSections()) {
            if (s.getQuestions() == null) continue;
            list.addAll(s.getQuestions());
        }
        // If you have explicit order fields, sort here
        // list.sort(Comparator.comparing(RDExamSectionQuestion::getDisplayOrder));
        return list;
    }

    private Map<Integer, String> parseByQuestionMarkers(
            String ocrText,
            Map<Integer, Integer> qNoToQuestionId) {

        List<QPos> positions = new ArrayList<>();
        Matcher m = Q_PATTERN.matcher(ocrText == null ? "" : ocrText);

        while (m.find()) {
            int qNo = safeInt(m.group(1));
            if (qNo > 0 && qNoToQuestionId.containsKey(qNo)) {
                positions.add(new QPos(qNo, m.start(), m.end()));
            }
        }

        positions.sort(Comparator.comparingInt(p -> p.start));

        Map<Integer, String> answersByQuestionId = new LinkedHashMap<>();

        for (int i = 0; i < positions.size(); i++) {
            QPos cur = positions.get(i);
            int start = cur.end;
            int end = (i + 1 < positions.size())
                    ? positions.get(i + 1).start
                    : ocrText.length();

            Integer questionId = qNoToQuestionId.get(cur.qNo);
            if (questionId == null) continue;

            String raw = ocrText.substring(start, end);
            String cleaned = extractOnlyAnswer(raw);
            String normalized = normalizeAnswer(cleaned);

            answersByQuestionId.put(questionId, normalized);
        }

        // Ensure all questions exist
        for (Integer qid : qNoToQuestionId.values()) {
            answersByQuestionId.putIfAbsent(qid, "");
        }

        System.out.println("Detected question markers:");
        positions.forEach(p ->
            System.out.println("QNo=" + p.qNo + " start=" + p.start));

        return answersByQuestionId;
    }

    private String extractOnlyAnswer(String segment) {
        if (segment == null) return "";

        // Remove leading marks indicator like (1)
        segment = segment.replaceFirst("^\\s*\\(\\d+\\)\\s*", "");

        segment = segment
            .replaceAll("(?im)^SECTION\\s+[A-D].*", "")
            .replaceAll("(?im)^Page\\s+\\d+.*", "")
            .replaceAll("(?im)\\bAns\\s*[:\\-]*", "")
            .replaceAll("(?im)\\bDns\\s*[:\\-]*", "")
            .replaceAll("\\s{2,}", " ")
            .trim();

        return segment;
    }


  

    private double coverageRatio(Map<Integer, String> answers) {
        if (answers == null || answers.isEmpty()) return 0.0;
        int total = answers.size();
        int filled = 0;
        for (String v : answers.values()) {
            if (v != null && !v.isBlank()) filled++;
        }
        return total == 0 ? 0.0 : (filled * 1.0 / total);
    }

    private StudentAnswerMapResult reconstructUsingAI(RDExamPaper examPaper, String ocrText) {
        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("task", "reconstruct_student_answers");

            List<Map<String, Object>> questions = new ArrayList<>();
            int qNo = 1;
            for (RDExamSection s : examPaper.getSections()) {
                for (RDExamSectionQuestion sq : s.getQuestions()) {
                    Map<String, Object> q = new LinkedHashMap<>();
                    q.put("questionId", sq.getId());
                    q.put("questionNo", qNo++);
                    q.put("questionText", sq.getQuestion().getQuestionText());
                    q.put("maxMarks", sq.getMarks());
                    questions.add(q);
                }
            }

            payload.put("questions", questions);
            payload.put("ocrText", ocrText);

            String json = JsonUtils.toJson(payload);

            // You can add a dedicated method in OpenAIEvaluationClient for reconstruction
            String aiJson = openAIEvaluationClient.reconstructAnswers(json);

            // Expected shape:
            // { "answersByQuestionId": { "12": "....", "13": "...." } }
            return mapper.readValue(aiJson, StudentAnswerMapResult.class);

        } catch (Exception e) {
            return null;
        }
    }

    private int safeInt(String s) {
        try { return Integer.parseInt(s); } catch (Exception e) { return -1; }
    }

    private static class QPos {
        final int qNo;
        final int start;
        final int end;
        QPos(int qNo, int start, int end) { this.qNo = qNo; this.start = start; this.end = end; }
    }
}
