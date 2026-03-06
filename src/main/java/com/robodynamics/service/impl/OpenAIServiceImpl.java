package com.robodynamics.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.service.OpenAIService;

@Service
public class OpenAIServiceImpl implements OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.chat.model:gpt-4o-mini}")
    private String chatModel;

    @Value("${openai.chat.maxTokens:600}")
    private int defaultMaxTokens;

    private final ObjectMapper mapper = new ObjectMapper();

    // Updated endpoint for chat models
    private static final String OPENAI_CHAT_API_URL = "https://api.openai.com/v1/chat/completions";

    @Override
    public String getResponseFromOpenAI(String prompt) throws Exception {
        return getResponseFromOpenAI(prompt, defaultMaxTokens);
    }

    @Override
    public String getResponseFromOpenAI(String prompt, int maxTokens) throws Exception {
        System.out.println("Sending request to OpenAI...");

        // Create HTTP Client
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            // Create HTTP POST request for chat completions
            HttpPost request = new HttpPost(OPENAI_CHAT_API_URL);
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Authorization", "Bearer " + apiKey);

            int resolvedMaxTokens = Math.max(120, Math.min(maxTokens, 2400));
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model", safeModel(chatModel));
            payload.put("messages", List.of(Map.of(
                    "role", "user",
                    "content", prompt == null ? "" : prompt)));
            payload.put("max_tokens", resolvedMaxTokens);

            String jsonBody = mapper.writeValueAsString(payload);
            StringEntity entity = new StringEntity(jsonBody, StandardCharsets.UTF_8);
            request.setEntity(entity);

            System.out.println("Executing request...");
            // Execute the request and get the response
            try (CloseableHttpResponse response = client.execute(request)) {
                if (response.getEntity() == null) {
                    throw new NullPointerException("No response entity received from OpenAI API");
                }

                String jsonResponse = EntityUtils.toString(response.getEntity());
                System.out.println("Response received from OpenAI: " + jsonResponse);

                // Parse the response
                JsonNode jsonNode = mapper.readTree(jsonResponse);

                // Check if there is an error
                if (jsonNode.has("error")) {
                    String errorMessage = jsonNode.get("error").get("message").asText();
                    throw new Exception("OpenAI API error: " + errorMessage);
                }

                // Check if "choices" array exists and contains at least one element
                if (jsonNode.has("choices") && jsonNode.get("choices").isArray() && jsonNode.get("choices").size() > 0) {
                    String aiResponse = jsonNode.get("choices").get(0).get("message").get("content").asText();
                    return aiResponse.trim();
                } else {
                    throw new NullPointerException("Invalid response structure: 'choices' not found or empty");
                }
            }
        }
    }

    private String safeModel(String model) {
        String value = model == null ? "" : model.trim();
        return value.isEmpty() ? "gpt-4o-mini" : value;
    }
}
