package com.robodynamics.service.impl;

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

    // Updated endpoint for chat models
    private static final String OPENAI_CHAT_API_URL = "https://api.openai.com/v1/chat/completions";

    public String getResponseFromOpenAI(String prompt) throws Exception {

        System.out.println("Sending request to OpenAI...");

        // Create HTTP Client
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            // Create HTTP POST request for chat completions
            HttpPost request = new HttpPost(OPENAI_CHAT_API_URL);
            request.addHeader("Content-Type", "application/json");
            request.addHeader("Authorization", "Bearer " + apiKey);

            // Build the JSON body with the message format required for chat models
            String jsonBody = String.format(
                "{\"model\":\"gpt-3.5-turbo\",\"messages\":[{\"role\":\"user\",\"content\":\"%s\"}],\"max_tokens\":100}",
                prompt.replace("\"", "\\\"") // Escape quotes for the prompt
            );
            StringEntity entity = new StringEntity(jsonBody);
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
                ObjectMapper mapper = new ObjectMapper();
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
}
