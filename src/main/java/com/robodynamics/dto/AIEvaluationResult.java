package com.robodynamics.dto;

public class AIEvaluationResult {

    private int totalMarks;
    private int maxMarks;
    private int confidence;
    private String evaluationBasis;
    private String overallFeedback;
    private String rawJson;

    public AIEvaluationResult(int totalMarks,
                              int maxMarks,
                              int confidence,
                              String evaluationBasis,
                              String overallFeedback,
                              String rawJson) {
        this.totalMarks = totalMarks;
        this.maxMarks = maxMarks;
        this.confidence = confidence;
        this.evaluationBasis = evaluationBasis;
        this.overallFeedback = overallFeedback;
        this.rawJson = rawJson;
    }

    public int getTotalMarks() { return totalMarks; }
    public int getMaxMarks() { return maxMarks; }
    public int getConfidence() { return confidence; }
    public String getEvaluationBasis() { return evaluationBasis; }
    public String getOverallFeedback() { return overallFeedback; }
    public String getRawJson() { return rawJson; }
}
