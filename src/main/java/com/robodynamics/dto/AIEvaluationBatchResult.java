package com.robodynamics.dto;

import java.util.List;

public class AIEvaluationBatchResult {

    private List<QuestionEvaluation> evaluations;
    private String overallFeedback;

    public List<QuestionEvaluation> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<QuestionEvaluation> evaluations) {
        this.evaluations = evaluations;
    }

    public String getOverallFeedback() {
        return overallFeedback;
    }

    public void setOverallFeedback(String overallFeedback) {
        this.overallFeedback = overallFeedback;
    }

    /* ================= INNER DTO ================= */

    public static class QuestionEvaluation {

        private Integer questionId;
        private Double marksAwarded;
        private Double confidence;
        private String feedback;

        public Integer getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Integer questionId) {
            this.questionId = questionId;
        }

        public Double getMarksAwarded() {
            return marksAwarded;
        }

        public void setMarksAwarded(Double marksAwarded) {
            this.marksAwarded = marksAwarded;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }

        public String getFeedback() {
            return feedback;
        }

        public void setFeedback(String feedback) {
            this.feedback = feedback;
        }
    }
}
