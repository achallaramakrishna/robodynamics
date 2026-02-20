package com.robodynamics.service;

import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;


@Service
public class OpenAIVisionOCRService {

    private static final String API_URL = "https://api.openai.com/v1/responses";

    @Value("${openai.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .protocols(List.of(Protocol.HTTP_1_1))
            .connectTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .build();

    public String extractTextFromImage(File imageFile) throws Exception {

        byte[] imageBytes = Files.readAllBytes(imageFile.toPath());
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        JSONObject body = buildRequest(base64Image);

        Request request = new Request.Builder()
                .url(API_URL)
                .post(RequestBody.create(body.toString(),
                        MediaType.parse("application/json")))
                .addHeader("Authorization", "Bearer " + apiKey)
                .build();

        try (Response response = client.newCall(request).execute()) {

            if (!response.isSuccessful()) {
                throw new RuntimeException("OpenAI OCR failed: " + response.code());
            }

            return parseResponse(response.body().string());
        }
    }

    private JSONObject buildRequest(String base64Image) {
        String ocrPrompt =
            "This is a page from a student's handwritten school exam answer paper.\n\n" +
            "Your task:\n" +
            "1. Extract ALL handwritten text EXACTLY as written by the student.\n" +
            "2. Preserve question numbers exactly as they appear (e.g. '1.', '2)', 'Q1', 'Q.1', 'Ans 1').\n" +
            "3. For each question, output the question marker on its own line followed by the student's answer.\n" +
            "4. Preserve mathematical notation: fractions (3/4), decimals (0.75), units (cm, kg, Rs.), " +
               "arithmetic expressions, and multi-step working.\n" +
            "5. If a diagram or figure is drawn, write '[DIAGRAM]' on its own line.\n" +
            "6. Do NOT skip any question, even if the answer is blank — output the question number with an empty line.\n" +
            "7. Do NOT add any commentary, headers, or explanations.\n" +
            "8. Do NOT correct the student's spelling or arithmetic.\n" +
            "9. Output plain text only — no markdown, no bullets, no extra formatting.\n\n" +
            "Begin extraction:";

        return new JSONObject()
                .put("model", "gpt-4.1-mini")
                .put("input", new JSONArray().put(
                        new JSONObject()
                                .put("role", "user")
                                .put("content", new JSONArray()
                                        .put(new JSONObject()
                                                .put("type", "input_text")
                                                .put("text", ocrPrompt))
                                        .put(new JSONObject()
                                                .put("type", "input_image")
                                                .put("image_url",
                                                        "data:image/png;base64," + base64Image))
                                )
                ));
    }

    private String parseResponse(String responseBody) {
        JSONObject responseJson = new JSONObject(responseBody);
        JSONArray output = responseJson.getJSONArray("output");

        StringBuilder text = new StringBuilder();
        for (int i = 0; i < output.length(); i++) {
            JSONArray content = output.getJSONObject(i).getJSONArray("content");
            for (int j = 0; j < content.length(); j++) {
                JSONObject block = content.getJSONObject(j);
                if ("output_text".equals(block.getString("type"))) {
                    text.append(block.getString("text")).append("\n");
                }
            }
        }
        return text.toString();
    }
}
