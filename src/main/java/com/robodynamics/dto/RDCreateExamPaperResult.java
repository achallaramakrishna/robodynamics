package com.robodynamics.dto;

import java.util.ArrayList;
import java.util.List;

public class RDCreateExamPaperResult {

    private int requestedPaperCount;
    private int createdPaperCount;
    private int aiGeneratedQuestionsCount;
    private List<CreatedPaper> createdPapers = new ArrayList<>();

    public int getRequestedPaperCount() {
        return requestedPaperCount;
    }

    public void setRequestedPaperCount(int requestedPaperCount) {
        this.requestedPaperCount = requestedPaperCount;
    }

    public int getCreatedPaperCount() {
        return createdPaperCount;
    }

    public void setCreatedPaperCount(int createdPaperCount) {
        this.createdPaperCount = createdPaperCount;
    }

    public int getAiGeneratedQuestionsCount() {
        return aiGeneratedQuestionsCount;
    }

    public void setAiGeneratedQuestionsCount(int aiGeneratedQuestionsCount) {
        this.aiGeneratedQuestionsCount = aiGeneratedQuestionsCount;
    }

    public List<CreatedPaper> getCreatedPapers() {
        return createdPapers;
    }

    public void setCreatedPapers(List<CreatedPaper> createdPapers) {
        this.createdPapers = createdPapers;
    }

    public static class CreatedPaper {
        private Integer examPaperId;
        private String title;
        private Integer totalMarks;
        private Integer sessionDetailId;

        public Integer getExamPaperId() {
            return examPaperId;
        }

        public void setExamPaperId(Integer examPaperId) {
            this.examPaperId = examPaperId;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Integer getTotalMarks() {
            return totalMarks;
        }

        public void setTotalMarks(Integer totalMarks) {
            this.totalMarks = totalMarks;
        }

        public Integer getSessionDetailId() {
            return sessionDetailId;
        }

        public void setSessionDetailId(Integer sessionDetailId) {
            this.sessionDetailId = sessionDetailId;
        }
    }
}

