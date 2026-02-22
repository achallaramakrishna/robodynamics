package com.robodynamics.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCIAssessmentResponseDao;
import com.robodynamics.dao.RDCIAssessmentSessionDao;
import com.robodynamics.model.RDCIAssessmentResponse;
import com.robodynamics.model.RDCIAssessmentSession;
import com.robodynamics.model.RDCIQuestionBank;
import com.robodynamics.service.RDCIAssessmentResponseService;
import com.robodynamics.service.RDCIQuestionBankService;

@Service
public class RDCIAssessmentResponseServiceImpl implements RDCIAssessmentResponseService {

    @Autowired
    private RDCIAssessmentResponseDao ciAssessmentResponseDao;

    @Autowired
    private RDCIAssessmentSessionDao ciAssessmentSessionDao;

    @Autowired
    private RDCIQuestionBankService ciQuestionBankService;

    @Override
    @Transactional
    public RDCIAssessmentResponse saveResponse(
            Long sessionId,
            String questionCode,
            String selectedOption,
            String responseJson,
            Integer timeSpentSeconds,
            String confidenceLevel) {

        if (sessionId == null) {
            throw new IllegalArgumentException("sessionId is required.");
        }
        if (questionCode == null || questionCode.trim().isEmpty()) {
            throw new IllegalArgumentException("questionCode is required.");
        }

        RDCIAssessmentSession session = ciAssessmentSessionDao.findById(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("No assessment session found for id " + sessionId);
        }

        String normalizedQuestionCode = questionCode.trim().toUpperCase(Locale.ENGLISH);
        String normalizedOption = trimToNull(selectedOption);
        if (normalizedOption != null) {
            normalizedOption = normalizedOption.toUpperCase(Locale.ENGLISH);
        }

        RDCIAssessmentResponse row = ciAssessmentResponseDao.findBySessionIdAndQuestionCode(sessionId, normalizedQuestionCode);
        LocalDateTime now = LocalDateTime.now();
        if (row == null) {
            row = new RDCIAssessmentResponse();
            row.setAssessmentSession(session);
            row.setQuestionCode(normalizedQuestionCode);
            row.setCreatedAt(now);
        }

        row.setSelectedOption(normalizedOption);
        row.setResponseJson(trimToNull(responseJson));
        row.setTimeSpentSeconds(sanitizeTime(timeSpentSeconds));
        row.setConfidenceLevel(trimToNull(confidenceLevel));
        row.setUpdatedAt(now);

        applyScoring(row, session.getAssessmentVersion());
        ciAssessmentResponseDao.save(row);
        return row;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCIAssessmentResponse> getBySessionId(Long sessionId) {
        return ciAssessmentResponseDao.findBySessionId(sessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionScoreSummary getSessionScoreSummary(Long sessionId) {
        SessionScoreSummary summary = new SessionScoreSummary();
        if (sessionId == null) {
            summary.setAnswerByQuestion(Map.of());
            return summary;
        }

        RDCIAssessmentSession session = ciAssessmentSessionDao.findById(sessionId);
        if (session == null) {
            summary.setAnswerByQuestion(Map.of());
            return summary;
        }

        List<RDCIQuestionBank> questions = ciQuestionBankService
                .getOrSeedActiveQuestions("APTIPATH", session.getAssessmentVersion());
        List<RDCIAssessmentResponse> responses = ciAssessmentResponseDao.findBySessionId(sessionId);

        BigDecimal maxScore = questions.stream()
                .map(q -> q.getWeightage() == null ? BigDecimal.ZERO : q.getWeightage())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalScore = responses.stream()
                .map(r -> r.getScoreAwarded() == null ? BigDecimal.ZERO : r.getScoreAwarded())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int attempted = (int) responses.stream()
                .filter(r -> r.getSelectedOption() != null && !r.getSelectedOption().trim().isEmpty())
                .count();
        int correct = (int) responses.stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsCorrect()))
                .count();

        Map<String, String> answerByQuestion = new LinkedHashMap<>();
        for (RDCIAssessmentResponse response : responses) {
            answerByQuestion.put(response.getQuestionCode(), response.getSelectedOption());
        }

        summary.setTotalQuestions(questions.size());
        summary.setAttemptedQuestions(attempted);
        summary.setCorrectAnswers(correct);
        summary.setTotalScore(totalScore);
        summary.setMaxScore(maxScore);
        summary.setAnswerByQuestion(answerByQuestion);
        summary.setScorePercent(calculatePercent(totalScore, maxScore));
        return summary;
    }

    private void applyScoring(RDCIAssessmentResponse response, String assessmentVersion) {
        RDCIQuestionBank question = ciQuestionBankService.getByModuleVersionAndQuestionCode(
                "APTIPATH",
                assessmentVersion,
                response.getQuestionCode());

        String selected = trimToNull(response.getSelectedOption());
        if (question == null || selected == null) {
            response.setIsCorrect(null);
            response.setScoreAwarded(BigDecimal.ZERO);
            return;
        }

        String correct = trimToNull(question.getCorrectOption());
        if (correct == null) {
            response.setIsCorrect(null);
            response.setScoreAwarded(BigDecimal.ZERO);
            return;
        }

        boolean isCorrect = correct.equalsIgnoreCase(selected);
        response.setIsCorrect(isCorrect);
        BigDecimal weightage = question.getWeightage() == null ? BigDecimal.ONE : question.getWeightage();
        response.setScoreAwarded(isCorrect ? weightage : BigDecimal.ZERO);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Integer sanitizeTime(Integer seconds) {
        if (seconds == null) {
            return null;
        }
        return Math.max(0, seconds);
    }

    private double calculatePercent(BigDecimal score, BigDecimal maxScore) {
        if (score == null || maxScore == null || maxScore.compareTo(BigDecimal.ZERO) <= 0) {
            return 0D;
        }
        BigDecimal percent = score
                .multiply(BigDecimal.valueOf(100))
                .divide(maxScore, 2, RoundingMode.HALF_UP);
        return percent.doubleValue();
    }
}
