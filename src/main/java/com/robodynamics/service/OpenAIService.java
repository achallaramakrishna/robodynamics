package com.robodynamics.service;

public interface OpenAIService {

    public String getResponseFromOpenAI(String prompt) throws Exception;

    default String getResponseFromOpenAI(String prompt, int maxTokens) throws Exception {
        return getResponseFromOpenAI(prompt);
    }

}
