package com.robodynamics.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dto.RDCreateExamPaperRequest;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.OpenAIService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDExamQuestionAugmentationService;
import com.robodynamics.service.RDQuizOptionService;
import com.robodynamics.service.RDQuizQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class RDExamQuestionAugmentationServiceImpl implements RDExamQuestionAugmentationService {
    private static final int MAX_CHUNK_MARKS = 30;
    private static final int MIN_CHUNK_MARKS = 12;
    private static final int MAX_CHUNK_ATTEMPTS = 18;
    private static final Set<String> NON_MATH_BANNED_TERMS = Set.of(
            "photosynthesis", "chlorophyll", "stomata", "mitochondria", "respiration",
            "ecosystem", "food chain", "atom", "molecule", "chemical equation", "biology",
            "physics", "habitat", "cell wall", "digestive system", "cell membrane",
            "osmosis", "genetic", "dna", "renewable energy", "greenhouse gas",
            "capital of france", "oxygenating blood", "unit of life", "cell division",
            "mitosis", "calvin cycle", "chloroplast"
    );
    private static final Set<String> MATH_SIGNAL_TERMS = Set.of(
            "add", "addition", "subtract", "subtraction", "difference", "sum", "total",
            "multiply", "multiplication", "divide", "division", "quotient", "remainder",
            "factor", "multiple", "fraction", "decimal", "percentage", "ratio", "average",
            "place value", "perimeter", "area", "volume", "measurement", "geometry",
            "angle", "shape", "pattern", "net", "time", "temperature", "data",
            "table", "graph", "cm", "mm", "km", "kg", "ml", "rupees", "₹", "rs."
    );
    private static final Set<String> ADVANCED_MATH_BANNED_TERMS_FOR_G5 = Set.of(
            "derivative", "integral", "trigonometry", "sin(", "cos(", "tan(",
            "f(x)", "limit as", "matrix", "determinant"
    );

    @Autowired
    private OpenAIService openAIService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @Autowired
    private RDQuizOptionService quizOptionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public List<RDQuizQuestion> generateAndStoreQuestions(
            RDCreateExamPaperRequest request,
            int marksShortfall,
            RDUser createdBy
    ) {
        if (request == null || request.getSessionIds() == null || request.getSessionIds().isEmpty() || marksShortfall <= 0) {
            return Collections.emptyList();
        }

        try {
            List<RDQuizQuestion> generated = new ArrayList<>();
            Set<Integer> dedupSessionIds = new LinkedHashSet<>();
            for (Integer sessionId : request.getSessionIds()) {
                if (sessionId != null && sessionId > 0) {
                    dedupSessionIds.add(sessionId);
                }
            }
            if (dedupSessionIds.isEmpty()) {
                return Collections.emptyList();
            }

            int remainingMarks = marksShortfall;
            int processed = 0;
            int totalSessions = dedupSessionIds.size();
            for (Integer sessionId : dedupSessionIds) {
                if (remainingMarks <= 0) {
                    break;
                }
                RDCourseSession session = courseSessionService.getCourseSession(sessionId);
                if (session == null) {
                    processed++;
                    continue;
                }
                int targetForSession = Math.max(1, (int) Math.ceil((double) remainingMarks / (double) Math.max(1, totalSessions - processed)));
                List<RDQuizQuestion> batch = generateForSingleSession(request, session, targetForSession);
                generated.addAll(batch);
                remainingMarks -= sumMarks(batch);
                processed++;
            }

            if (remainingMarks > 0) {
                Integer fallbackSessionId = dedupSessionIds.iterator().next();
                RDCourseSession fallbackSession = courseSessionService.getCourseSession(fallbackSessionId);
                if (fallbackSession != null) {
                    List<RDQuizQuestion> batch = generateForSingleSession(request, fallbackSession, remainingMarks);
                    generated.addAll(batch);
                }
            }
            return generated;
        } catch (Exception ex) {
            throw new IllegalStateException("AI question generation failed: " + ex.getMessage(), ex);
        }
    }

    private List<RDQuizQuestion> generateForSingleSession(
            RDCreateExamPaperRequest request,
            RDCourseSession session,
            int targetMarks
    ) throws Exception {
        int remainingMarks = Math.max(1, targetMarks);
        int attempts = 0;
        int chunkMarks = Math.min(MAX_CHUNK_MARKS, remainingMarks);
        List<RDQuizQuestion> generated = new ArrayList<>();
        Set<String> seenQuestionKeys = new LinkedHashSet<>();

        while (remainingMarks > 0 && attempts < MAX_CHUNK_ATTEMPTS) {
            List<RDQuizQuestion> chunkGenerated = generateChunk(request, session, chunkMarks, seenQuestionKeys);
            if (chunkGenerated.isEmpty()) {
                attempts++;
                if (chunkMarks > MIN_CHUNK_MARKS) {
                    chunkMarks = MIN_CHUNK_MARKS;
                }
                continue;
            }

            int chunkProducedMarks = sumMarks(chunkGenerated);
            if (chunkProducedMarks <= 0) {
                attempts++;
                continue;
            }
            generated.addAll(chunkGenerated);
            remainingMarks -= chunkProducedMarks;
            chunkMarks = Math.min(MAX_CHUNK_MARKS, Math.max(MIN_CHUNK_MARKS, remainingMarks));
            attempts++;
        }

        return generated;
    }

    private List<RDQuizQuestion> generateChunk(
            RDCreateExamPaperRequest request,
            RDCourseSession session,
            int chunkTargetMarks,
            Set<String> seenQuestionKeys
    ) {
        try {
            int questionCountHint = Math.max(6, Math.min(20, chunkTargetMarks * 2));
            String prompt = buildPrompt(request, session.getCourseSessionId(), chunkTargetMarks, questionCountHint);
            String raw = openAIService.getResponseFromOpenAI(prompt);
            JsonNode root = parseJsonRoot(raw);
            JsonNode questionsNode = root.path("questions");
            if (!questionsNode.isArray() || questionsNode.size() == 0) {
                return Collections.emptyList();
            }

            int generatedMarks = 0;
            List<RDQuizQuestion> generated = new ArrayList<>();
            for (JsonNode node : questionsNode) {
                RDQuizQuestion question = buildQuestion(node, request, session);
                if (question == null) {
                    continue;
                }
                if (!isQuestionTopicallyAllowed(question, request)) {
                    continue;
                }
                String qKey = normalizeQuestionKey(question.getQuestionText());
                if (qKey.isEmpty() || !seenQuestionKeys.add(qKey)) {
                    continue;
                }

                List<RDQuizOption> preparedOptions = Collections.emptyList();
                if ("multiple_choice".equalsIgnoreCase(question.getQuestionType())) {
                    preparedOptions = parseValidatedOptions(node.path("options"), question);
                    if (preparedOptions.isEmpty()) {
                        continue;
                    }
                } else if (isBlank(question.getCorrectAnswer())) {
                    continue;
                }

                quizQuestionService.saveOrUpdate(question);
                for (RDQuizOption option : preparedOptions) {
                    quizOptionService.save(option);
                }
                generated.add(question);
                generatedMarks += normalizeMarks(question.getMaxMarks());
                if (generatedMarks >= chunkTargetMarks) {
                    break;
                }
            }
            return generated;
        } catch (Exception ex) {
            return Collections.emptyList();
        }
    }

    private String buildPrompt(RDCreateExamPaperRequest request, Integer sessionId, int marksShortfall, int questionCountHint) {
        List<String> qTypes = request.getQuestionTypes() == null ? Collections.emptyList() : request.getQuestionTypes();
        List<String> levels = request.getDifficultyLevels() == null ? Collections.emptyList() : request.getDifficultyLevels();
        String subjectGuard = buildSubjectGuardLine(request);

        return """
            Generate additional school exam questions in strict JSON only.

            Target:
            - Course ID: %d
            - Session ID (chapter): %d
            - Question types: %s
            - Difficulty levels: %s
            - Exam type: %s
            - Required additional marks for this batch: %d
            - Return around %d questions (do not exceed %d)

            Output format (JSON only, no markdown):
            {
              "questions": [
                {
                  "question_text": "string",
                  "question_type": "multiple_choice|short_answer|long_answer|fill_in_blank",
                  "difficulty_level": "Easy|Medium|Hard|Expert|Master",
                  "max_marks": 1,
                  "correct_answer": "string",
                  "explanation": "1-4 line model answer or reasoning",
                  "question_image": "optional_image_path_or_blank",
                  "image_placeholder": "optional_description_for_image",
                  "additional_info": "string",
                  "options": [
                    { "option_text": "string", "is_correct": false, "option_image": "" },
                    { "option_text": "string", "is_correct": true, "option_image": "" }
                  ]
                }
              ]
            }

            Rules:
            - For non-MCQ, keep options empty.
            - For MCQ, provide at least 4 options with exactly one correct option.
            - Keep max_marks realistic (1,2,3,4,5) and align to question difficulty.
            - Add image placeholders only when needed for diagrams/figures.
            - Do not include explanations outside JSON.
            - Ensure enough questions to cover required marks for this batch.
            %s
            """.formatted(
                request.getCourseId(),
                sessionId,
                qTypes,
                levels,
                request.getExamType(),
                marksShortfall,
                questionCountHint,
                questionCountHint,
                subjectGuard
        );
    }

    private JsonNode parseJsonRoot(String raw) throws Exception {
        if (raw == null) {
            return objectMapper.createObjectNode();
        }
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```[a-zA-Z]*", "").replaceAll("```$", "").trim();
        }
        int start = cleaned.indexOf('{');
        if (start >= 0) {
            cleaned = cleaned.substring(start);
        }
        try {
            return objectMapper.readTree(cleaned);
        } catch (Exception first) {
            String repaired = repairTruncatedJson(cleaned);
            return objectMapper.readTree(repaired);
        }
    }

    private RDQuizQuestion buildQuestion(JsonNode node, RDCreateExamPaperRequest request, RDCourseSession anchorSession) {
        String text = node.path("question_text").asText("").trim();
        if (text.isEmpty()) {
            return null;
        }

        RDQuizQuestion q = new RDQuizQuestion();
        q.setQuestionText(text);
        q.setQuestionType(normalizeQuestionType(node.path("question_type").asText("short_answer")));
        q.setDifficultyLevel(normalizeDifficulty(node.path("difficulty_level").asText("Medium")));
        q.setMaxMarks(normalizeMarks(node.path("max_marks").asInt(1)));
        q.setCorrectAnswer(node.path("correct_answer").asText(""));
        q.setExplanation(blankToNull(node.path("explanation").asText("")));
        q.setQuestionImage(blankToNull(node.path("question_image").asText("")));
        String placeholder = node.path("image_placeholder").asText("").trim();
        String additionalInfo = node.path("additional_info").asText("AI generated");
        if (!placeholder.isEmpty()) {
            additionalInfo = additionalInfo + " | image_placeholder=" + placeholder;
        }
        q.setAdditionalInfo(additionalInfo);
        q.setExamType(request.getExamType());
        q.setCourseSession(anchorSession);
        q.setPoints(Math.max(1, q.getMaxMarks()));
        q.setActive(true);
        q.setSyllabusTag("AI_GENERATED_SESSION_" + anchorSession.getCourseSessionId());
        q.setExamYear(request.getExamYear() == null ? LocalDate.now().getYear() : request.getExamYear());
        return q;
    }

    private List<RDQuizOption> parseValidatedOptions(JsonNode optionsNode, RDQuizQuestion question) {
        if (optionsNode == null || !optionsNode.isArray()) {
            return Collections.emptyList();
        }

        List<RDQuizOption> options = new ArrayList<>();
        int correctCount = 0;
        for (JsonNode optionNode : optionsNode) {
            String optionText = optionNode.path("option_text").asText("").trim();
            if (optionText.isEmpty()) {
                continue;
            }
            RDQuizOption option = new RDQuizOption();
            option.setQuestion(question);
            option.setOptionText(optionText);
            option.setCorrect(optionNode.path("is_correct").asBoolean(false));
            if (option.isCorrect()) {
                correctCount++;
            }
            option.setOptionImage(blankToNull(optionNode.path("option_image").asText("")));
            options.add(option);
        }

        if (options.size() < 4 || correctCount != 1) {
            return Collections.emptyList();
        }
        return options;
    }

    private int sumMarks(List<RDQuizQuestion> questions) {
        int sum = 0;
        if (questions == null) {
            return 0;
        }
        for (RDQuizQuestion q : questions) {
            sum += normalizeMarks(q.getMaxMarks());
        }
        return sum;
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeQuestionType(String raw) {
        if (raw == null) {
            return "short_answer";
        }
        String v = raw.trim().toLowerCase();
        if ("mcq".equals(v) || "multiple choice".equals(v)) {
            return "multiple_choice";
        }
        if ("long answer".equals(v)) {
            return "long_answer";
        }
        if ("short answer".equals(v)) {
            return "short_answer";
        }
        if ("fill in blank".equals(v) || "fill-in-blank".equals(v)) {
            return "fill_in_blank";
        }
        return v;
    }

    private String normalizeQuestionKey(String text) {
        if (text == null) {
            return "";
        }
        return text.trim().toLowerCase(Locale.ENGLISH).replaceAll("\\s+", " ");
    }

    private String repairTruncatedJson(String raw) {
        if (raw == null) {
            return "{}";
        }
        String trimmed = raw.trim();
        if (trimmed.isEmpty()) {
            return "{}";
        }

        int lastBrace = trimmed.lastIndexOf('}');
        if (lastBrace >= 0) {
            trimmed = trimmed.substring(0, lastBrace + 1);
        }
        trimmed = trimmed.replaceAll(",\\s*([}\\]])", "$1");

        int openBraces = 0;
        int openBrackets = 0;
        for (int i = 0; i < trimmed.length(); i++) {
            char c = trimmed.charAt(i);
            if (c == '{') {
                openBraces++;
            } else if (c == '}') {
                openBraces = Math.max(0, openBraces - 1);
            } else if (c == '[') {
                openBrackets++;
            } else if (c == ']') {
                openBrackets = Math.max(0, openBrackets - 1);
            }
        }

        StringBuilder repaired = new StringBuilder(trimmed);
        while (openBrackets-- > 0) {
            repaired.append(']');
        }
        while (openBraces-- > 0) {
            repaired.append('}');
        }
        return repaired.toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String buildSubjectGuardLine(RDCreateExamPaperRequest request) {
        if (!isMathContext(request)) {
            return "- Keep questions aligned to the selected subject/chapter context only.";
        }
        return "- STRICT MATH ONLY: do not generate biology/science questions (e.g., photosynthesis, chlorophyll, cells, ecosystems).";
    }

    private boolean isMathContext(RDCreateExamPaperRequest request) {
        if (request == null) {
            return false;
        }
        if (request.getCourseId() != null && request.getCourseId() == 34) {
            return true;
        }
        String subject = request.getSubject() == null ? "" : request.getSubject().toLowerCase(Locale.ENGLISH);
        return subject.contains("math");
    }

    private boolean isQuestionTopicallyAllowed(RDQuizQuestion question, RDCreateExamPaperRequest request) {
        if (!isMathContext(request)) {
            return true;
        }
        String text = question.getQuestionText() == null ? "" : question.getQuestionText().toLowerCase(Locale.ENGLISH);
        if (text.isBlank()) {
            return false;
        }
        for (String banned : NON_MATH_BANNED_TERMS) {
            if (text.contains(banned)) {
                return false;
            }
        }
        if (request != null && request.getCourseId() != null && request.getCourseId() == 34) {
            for (String banned : ADVANCED_MATH_BANNED_TERMS_FOR_G5) {
                if (text.contains(banned)) {
                    return false;
                }
            }
        }
        for (String signal : MATH_SIGNAL_TERMS) {
            if (text.contains(signal)) {
                return true;
            }
        }
        return text.matches(".*\\d+.*")
                || text.contains("+")
                || text.contains("-")
                || text.contains("*")
                || text.contains("/")
                || text.contains("%");
    }

    private DifficultyLevel normalizeDifficulty(String raw) {
        if (raw == null) {
            return DifficultyLevel.Medium;
        }
        String value = raw.trim().toLowerCase();
        switch (value) {
            case "easy":
                return DifficultyLevel.Easy;
            case "hard":
                return DifficultyLevel.Hard;
            case "expert":
                return DifficultyLevel.Expert;
            case "master":
                return DifficultyLevel.Master;
            case "medium":
            default:
                return DifficultyLevel.Medium;
        }
    }

    private int normalizeMarks(int marks) {
        return marks <= 0 ? 1 : marks;
    }
}
