package com.robodynamics.ai.impl;

import com.robodynamics.ai.OpenAIEvaluationClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class OpenAIEvaluationClientImpl implements OpenAIEvaluationClient {

    @Value("${openai.api.key}")
    private String apiKey;

    private static final String OPENAI_URL =
            "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String evaluateExamBatch(String evaluationJson) {

        try {
            // ✅ Read totalQuestions from payload
            int totalQuestions = mapper.readTree(evaluationJson)
                    .path("exam")
                    .path("totalQuestions")
                    .asInt();

            if (totalQuestions <= 0) {
                // fallback: count questions array
                totalQuestions = mapper.readTree(evaluationJson)
                        .path("questions")
                        .size();
            }

            String systemPrompt = """
    You are an exam evaluation engine.

    STRICT RULES:
    1. You MUST evaluate ALL questions.
    2. Total questions = %d. Return exactly %d results.
    3. Output MUST be valid JSON ONLY.
    4. Do NOT exceed maxMarks for any question.
    5. If unsure, give conservative marks.
    6. Do NOT invent questions or IDs.
    7. Use ONLY questionId values provided in input.questions[].questionId

    Return JSON in this EXACT format:

    {
      "evaluations": [
        {
          "questionId": number,
          "marksAwarded": number,
          "confidence": number (0.0–1.0),
          "feedback": string
        }
      ],
      "overallFeedback": string
    }
    """.formatted(totalQuestions, totalQuestions);

            // ---- Build request body ----
            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.put("model", "gpt-4o-mini");

            var messages = mapper.createArrayNode();
            messages.add(object("system", systemPrompt));
            messages.add(object("user", evaluationJson));

            requestBody.set("messages", messages);
            requestBody.put("temperature", 0.2);

            // ✅ IMPORTANT: response_format must be an OBJECT, not a string
            requestBody.set("response_format",
                    mapper.createObjectNode().put("type", "json_object"));

            // ---- Headers ----
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<String> entity =
                    new HttpEntity<>(mapper.writeValueAsString(requestBody), headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, String.class);

            return extractJsonFromResponse(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("OpenAI evaluation failed", e);
        }
    }

    /* ================= HELPERS ================= */

    private ObjectNode object(String role, String content) {
        ObjectNode node = mapper.createObjectNode();
        node.put("role", role);
        node.put("content", content);
        return node;
    }

    private String extractJsonFromResponse(String raw) throws Exception {
        // OpenAI wraps response → extract content
        var root = mapper.readTree(raw);
        return root
                .path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();
    }
}
