package com.robodynamics.ai;

public interface OpenAIEvaluationClient {

    /**
     * Evaluates the entire exam in ONE call.
     * Returns strict JSON ONLY.
     */
    String evaluateExamBatch(String evaluationJson);
}
