package com.robodynamics.ai.impl;

import com.robodynamics.ai.OpenAIEvaluationClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Map;

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

    /* =========================================================
       MAIN EVALUATION
       ========================================================= */

    @Override
    public String evaluateExamBatch(String evaluationJson) {

        try {

            JsonNode rootNode = mapper.readTree(evaluationJson);
            JsonNode examNode = rootNode.path("exam");

            String courseName = examNode.path("courseName").asText("Unknown Course");
            String subject = examNode.path("subject").asText("General Subject");
            String grade = examNode.path("grade").asText("General Grade");
            String board = examNode.path("board").asText("General Board");
            String examType = examNode.path("examType").asText("Exam");

            int totalQuestions = examNode.path("totalQuestions").asInt();
            if (totalQuestions <= 0) {
                totalQuestions = rootNode.path("questions").size();
            }

            String systemPrompt = """
            		You are a STRICT SCHOOL-LEVEL MATHEMATICS EXAM EVALUATOR.

            		You must evaluate exactly like a CBSE board examiner.

            		You are NOT allowed to:
            		• Guess
            		• Assume missing steps
            		• Award sympathy marks
            		• Ignore incorrect logic

            		------------------------------------------------------------
            		EVALUATION RULES (MANDATORY)
            		------------------------------------------------------------

            		1️⃣ Evaluate ALL questions.
            		2️⃣ Total questions = %d.
            		3️⃣ Return EXACTLY %d evaluations.
            		4️⃣ Never exceed maxMarks.
            		5️⃣ Blank answer → 0 marks.
            		6️⃣ Answer written for wrong question → 0 marks.
            		7️⃣ If method incorrect → 0 marks.
            		8️⃣ If method correct but final arithmetic error → maximum 50%% of maxMarks.
            		9️⃣ If answer correct but not simplified when required → deduct up to 50%%.
            		🔟 Do NOT invent intermediate steps.

            		------------------------------------------------------------
            		MATHEMATICAL COMPARISON RULES
            		------------------------------------------------------------

            		• Ignore commas in numbers (12,30,000 = 1230000).
            		• Compare decimals numerically.
            		• Compare fractions using cross multiplication.
            		• Compare algebraic expressions by structural equivalence.
            		• For multi-value answers → compare element-wise.
            		• If 2 out of 3 values correct → award proportional marks.
            		• Units missing when required → deduct proportionally.
            		• Incorrect rounding rule → 0 marks.

            		------------------------------------------------------------
            		DIAGRAM / GEOMETRY RULES
            		------------------------------------------------------------

            		If diagram-based:
            		• Check logical correctness.
            		• If student mentions correct properties but diagram not visible → partial marks allowed.
            		• If only diagram drawn without explanation (when explanation required) → partial marks only.

            		------------------------------------------------------------
            		CONFIDENCE SCALE (STRICTLY FOLLOW)
            		------------------------------------------------------------

            		1.0  → Fully correct
            		0.8  → Minor arithmetic error
            		0.6  → Concept correct but incomplete
            		0.4  → Partial logic
            		0.2  → Attempted but incorrect
            		0.1  → Unattempted

            		------------------------------------------------------------
            		ERROR CLASSIFICATION (MANDATORY)
            		------------------------------------------------------------

            		errorType must be ONE of:

            		• fully_correct
            		• concept
            		• calculation
            		• careless
            		• unattempted

            		requiresReview must be:
            		• true  → if answer ambiguous or diagram-based
            		• false → otherwise

            		------------------------------------------------------------
            		RETURN ONLY VALID JSON
            		------------------------------------------------------------

            		{
            		  "evaluations": [
            		    {
            		      "questionId": number,
            		      "marksAwarded": number,
            		      "confidence": number,
            		      "errorType": "fully_correct|concept|calculation|careless|unattempted",
            		      "requiresReview": boolean,
            		      "feedback": string
            		    }
            		  ],
            		  "overallFeedback": string
            		}

            		No explanations outside JSON.
            		No markdown.
            		No commentary.
            		Only JSON.
            		""".formatted(totalQuestions, totalQuestions);

            ObjectNode requestBody = mapper.createObjectNode();
            // gpt-4o gives significantly better math evaluation accuracy than gpt-4o-mini
            requestBody.put("model", "gpt-4o");
            requestBody.put("temperature", 0.0);

            var messages = mapper.createArrayNode();
            messages.add(object("system", systemPrompt));
            messages.add(object("user", normalizeEvaluationJson(evaluationJson)));

            requestBody.set("messages", messages);
            requestBody.set("response_format",
                    mapper.createObjectNode().put("type", "json_object"));

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

    /* =========================================================
       TEXT NORMALIZATION
       ========================================================= */

    private String normalizeEvaluationJson(String json) throws Exception {

        JsonNode root = mapper.readTree(json);

        root.path("questions").forEach(q -> {
            if (q.has("studentAnswer")) {
                ((ObjectNode) q).put(
                        "studentAnswer",
                        normalizeAnswer(q.path("studentAnswer").asText())
                );
            }
        });

        return mapper.writeValueAsString(root);
    }

    private String normalizeAnswer(String answer) {
        if (answer == null) return "";
        return answer
                .replace("₹", "")
                .replace(",", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    /* =========================================================
       ANSWER RECONSTRUCTION
       ========================================================= */

    @Override
    public String reconstructAnswers(String reconstructionJson) {

        try {

            String systemPrompt = """
			You are a STRICT student answer reconstruction engine for a handwritten school exam paper.

			You will receive:
			- A list of questions with their questionId, questionNo, questionText, and maxMarks.
			- The full OCR text scanned from the student's handwritten answer paper.

			CRITICAL RULES:
			1. The OCR text may contain BOTH the printed question text (from the exam paper) AND the student's handwritten answers mixed together.
			2. You MUST separate the student's handwritten answer from the printed question text.
			3. The student's answer is the handwritten response AFTER each question number — NOT the question itself.
			4. Match answers to questions by question number (e.g. "1.", "Q1", "1)", "Ans 1").
			5. Return the student's answer VERBATIM — preserve numbers, fractions, units, spelling errors, working steps.
			6. DO NOT evaluate, grade, or correct. DO NOT merge answers from different questions.
			7. If a question has no student answer in the OCR text, return "" for that questionId.
			8. Every questionId in the input MUST appear in the output.

			HOW TO IDENTIFY STUDENT ANSWERS vs PRINTED QUESTION TEXT:
			- Printed question text = the question wording that matches or closely resembles the questionText field.
			- Student answer = numbers, calculations, words written by the student AFTER the question wording.
			- If the OCR segment for a question only repeats the question text with nothing after it, the student did not answer — return "".

			Return ONLY valid JSON in this exact format (keys are questionId as strings):

			{
			  "answersByQuestionId": {
			    "246": "student answer text here",
			    "247": "",
			    "248": "10000"
			  }
			}

			No explanations. No markdown. Only JSON.
			""";

            ObjectNode requestBody = mapper.createObjectNode();
            // gpt-4o for better answer-to-question mapping on handwritten papers
            requestBody.put("model", "gpt-4o");
            requestBody.put("temperature", 0.0);

            var messages = mapper.createArrayNode();
            messages.add(object("system", systemPrompt));
            messages.add(object("user", reconstructionJson));

            requestBody.set("messages", messages);
            requestBody.set("response_format",
                    mapper.createObjectNode().put("type", "json_object"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<String> entity =
                    new HttpEntity<>(mapper.writeValueAsString(requestBody), headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(OPENAI_URL, HttpMethod.POST, entity, String.class);

            return extractJsonFromResponse(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Answer reconstruction failed", e);
        }
    }

    /* =========================================================
       CLEAN TEXT (OCR CLEANING)
       ========================================================= */

    @Override
    public String generateCleanText(String prompt) {

        try {

            Map<String, Object> requestBody = Map.of(
                    "model", "gpt-4o-mini",
                    "temperature", 0.2,
                    "messages", List.of(
                            Map.of("role", "system",
                                    "content", "Clean formatting only. Do not change numeric meaning."),
                            Map.of("role", "user", "content", prompt)
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<String> entity =
                    new HttpEntity<>(mapper.writeValueAsString(requestBody), headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(OPENAI_URL, entity, String.class);

            JsonNode root = mapper.readTree(response.getBody());

            return root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText()
                    .trim();

        } catch (Exception e) {
            return prompt;
        }
    }

    /* =========================================================
       HELPERS
       ========================================================= */

    private ObjectNode object(String role, String content) {
        ObjectNode node = mapper.createObjectNode();
        node.put("role", role);
        node.put("content", content);
        return node;
    }

    private String extractJsonFromResponse(String raw) throws Exception {
        JsonNode root = mapper.readTree(raw);
        return root
                .path("choices")
                .get(0)
                .path("message")
                .path("content")
                .asText();
    }
}
