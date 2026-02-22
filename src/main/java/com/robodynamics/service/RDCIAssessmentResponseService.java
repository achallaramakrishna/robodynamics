package com.robodynamics.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.robodynamics.model.RDCIAssessmentResponse;

public interface RDCIAssessmentResponseService {

    RDCIAssessmentResponse saveResponse(
            Long sessionId,
            String questionCode,
            String selectedOption,
            String responseJson,
            Integer timeSpentSeconds,
            String confidenceLevel);

    List<RDCIAssessmentResponse> getBySessionId(Long sessionId);

    SessionScoreSummary getSessionScoreSummary(Long sessionId);

    class SessionScoreSummary {
        private int totalQuestions;
        private int attemptedQuestions;
        private int correctAnswers;
        private BigDecimal totalScore = BigDecimal.ZERO;
        private BigDecimal maxScore = BigDecimal.ZERO;
        private double scorePercent;
        private Map<String, String> answerByQuestion;

        public int getTotalQuestions() {
            return totalQuestions;
        }

        public void setTotalQuestions(int totalQuestions) {
            this.totalQuestions = totalQuestions;
        }

        public int getAttemptedQuestions() {
            return attemptedQuestions;
        }

        public void setAttemptedQuestions(int attemptedQuestions) {
            this.attemptedQuestions = attemptedQuestions;
        }

        public int getCorrectAnswers() {
            return correctAnswers;
        }

        public void setCorrectAnswers(int correctAnswers) {
            this.correctAnswers = correctAnswers;
        }

        public BigDecimal getTotalScore() {
            return totalScore;
        }

        public void setTotalScore(BigDecimal totalScore) {
            this.totalScore = totalScore;
        }

        public BigDecimal getMaxScore() {
            return maxScore;
        }

        public void setMaxScore(BigDecimal maxScore) {
            this.maxScore = maxScore;
        }

        public double getScorePercent() {
            return scorePercent;
        }

        public void setScorePercent(double scorePercent) {
            this.scorePercent = scorePercent;
        }

        public Map<String, String> getAnswerByQuestion() {
            return answerByQuestion;
        }

        public void setAnswerByQuestion(Map<String, String> answerByQuestion) {
            this.answerByQuestion = answerByQuestion;
        }
    }
}
