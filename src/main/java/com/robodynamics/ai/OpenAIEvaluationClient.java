package com.robodynamics.ai;

public interface OpenAIEvaluationClient {

    /**
     * Evaluates the entire exam in ONE call.
     * Returns strict JSON ONLY.
     */
    String evaluateExamBatch(String evaluationJson);

    /**
     * Reconstructs student answers per question.
     * NO evaluation, NO marks.
     * Returns strict JSON ONLY.
     */
    String reconstructAnswers(String reconstructionJson);

    /**
     * Utility text cleanup (already exists)
     */
    String generateCleanText(String prompt);
}
