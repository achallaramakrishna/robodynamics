package com.robodynamics.service;

public interface RDExamEvaluationService {

    /**
     * Runs AI-based evaluation for a submission.
     * Stores result in rd_exam_evaluation table.
     */
    void evaluateSubmission(Integer submissionId);
}
