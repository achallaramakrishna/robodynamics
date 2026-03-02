package com.robodynamics.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dto.RDQuestionBankImportResult;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDQuestionBankIngestionService;
import com.robodynamics.service.RDQuizOptionService;
import com.robodynamics.service.RDQuizQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class RDQuestionBankIngestionServiceImpl implements RDQuestionBankIngestionService {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @Autowired
    private RDQuizOptionService quizOptionService;

    @Override
    @Transactional
    public RDQuestionBankImportResult importFromJsonFile(
            MultipartFile file,
            Integer courseId,
            Integer sessionId,
            Integer sessionDetailId,
            RDUser actor
    ) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Question bank JSON file is required.");
        }
        JsonNode root = objectMapper.readTree(file.getInputStream());
        return importFromJsonNode(root, courseId, sessionId, sessionDetailId, actor);
    }

    @Override
    @Transactional
    public RDQuestionBankImportResult importFromJsonNode(
            JsonNode root,
            Integer courseId,
            Integer sessionId,
            Integer sessionDetailId,
            RDUser actor
    ) throws Exception {
        if (courseId == null) {
            throw new IllegalArgumentException("Course is required for question bank import.");
        }

        RDCourseSession defaultSession = null;
        if (sessionId != null && sessionId > 0) {
            defaultSession = courseSessionService.getCourseSession(sessionId);
            if (defaultSession == null || defaultSession.getCourse() == null || defaultSession.getCourse().getCourseId() != courseId) {
                throw new IllegalArgumentException("Selected session does not belong to selected course.");
            }
        }

        RDCourseSessionDetail defaultSessionDetail = null;
        if (sessionDetailId != null && sessionDetailId > 0) {
            defaultSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(sessionDetailId);
        }

        JsonNode questionsNode = root;
        if (!questionsNode.isArray()) {
            questionsNode = root.path("questions");
        }
        if (!questionsNode.isArray()) {
            throw new IllegalArgumentException("Invalid JSON format. Expected array or {\"questions\": [...]}");
        }

        Set<String> existingForDefault = defaultSession == null
                ? new LinkedHashSet<>()
                : loadExistingQuestionKeys(courseId, defaultSession.getCourseSessionId());
        int total = 0;
        int created = 0;
        int skipped = 0;

        for (JsonNode qNode : questionsNode) {
            total++;
            Integer targetSessionId = firstIntOrNull(qNode, "course_session_id", "session_id", "courseSessionId", "sessionId");
            RDCourseSession targetSession = defaultSession;
            if (targetSessionId != null && targetSessionId > 0) {
                targetSession = courseSessionService.getCourseSession(targetSessionId);
            }
            if (targetSession == null) {
                skipped++;
                continue;
            }
            if (targetSession.getCourse() == null || targetSession.getCourse().getCourseId() != courseId) {
                skipped++;
                continue;
            }

            Integer targetDetailId = firstIntOrNull(qNode, "course_session_detail_id", "session_detail_id", "courseSessionDetailId", "sessionDetailId");
            RDCourseSessionDetail targetSessionDetail = defaultSessionDetail;
            if (targetDetailId != null && targetDetailId > 0) {
                targetSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(targetDetailId);
            }

            String questionText = firstText(qNode, "question_text", "questionText").trim();
            if (questionText.isEmpty()) {
                skipped++;
                continue;
            }

            String dedupKey = normalizeText(questionText);
            Set<String> existing = (defaultSession != null && targetSession.getCourseSessionId().equals(defaultSession.getCourseSessionId()))
                    ? existingForDefault
                    : loadExistingQuestionKeys(courseId, targetSession.getCourseSessionId());
            if (existing.contains(dedupKey)) {
                skipped++;
                continue;
            }

            RDQuizQuestion question = new RDQuizQuestion();
            question.setQuestionText(questionText);
            String questionType = normalizeQuestionType(firstText(qNode, "question_type", "questionType"));
            question.setQuestionType(questionType);
            question.setDifficultyLevel(mapDifficulty(firstText(qNode, "difficulty_level", "difficultyLevel")));
            int maxMarks = normalizeMarks(firstInt(qNode, 2, "max_marks", "maxMarks"));
            question.setMaxMarks(maxMarks);
            question.setPoints(maxMarks);
            question.setCorrectAnswer(firstText(qNode, "correct_answer", "correctAnswer"));
            question.setAdditionalInfo(firstText(qNode, "additional_info", "additionalInfo"));
            question.setQuestionImage(blankToNull(firstText(qNode, "question_image", "questionImage")));
            question.setExamType(firstText(qNode, "exam_type", "examType"));
            question.setSyllabusTag("EXERCISE_IMPORT_JSON");
            question.setActive(true);
            question.setCourseSession(targetSession);
            question.setCourseSessionDetail(targetSessionDetail);
            quizQuestionService.saveOrUpdate(question);

            List<RDQuizOption> options = extractOptions(qNode.path("options"), question);
            boolean hasCorrectOption = false;
            for (RDQuizOption option : options) {
                quizOptionService.save(option);
                hasCorrectOption = hasCorrectOption || option.isCorrect();
            }
            if ("multiple_choice".equals(questionType) && !hasCorrectOption && !options.isEmpty()) {
                options.get(0).setCorrect(true);
                quizOptionService.save(options.get(0));
                if (question.getCorrectAnswer() == null || question.getCorrectAnswer().isBlank()) {
                    question.setCorrectAnswer(options.get(0).getOptionText());
                    quizQuestionService.saveOrUpdate(question);
                }
            }

            existing.add(dedupKey);
            created++;
        }

        RDQuestionBankImportResult result = new RDQuestionBankImportResult();
        result.setCourseId(courseId);
        result.setSessionId(sessionId);
        result.setSessionDetailId(sessionDetailId);
        result.setTotalQuestions(total);
        result.setCreatedQuestions(created);
        result.setSkippedQuestions(skipped);
        return result;
    }

    private Set<String> loadExistingQuestionKeys(Integer courseId, Integer sessionId) {
        Set<String> keys = new LinkedHashSet<>();
        List<RDQuizQuestion> existing = quizQuestionService.findByFilters(courseId, sessionId, null, null);
        if (existing == null) {
            return keys;
        }
        for (RDQuizQuestion q : existing) {
            if (q != null && q.getQuestionText() != null) {
                keys.add(normalizeText(q.getQuestionText()));
            }
        }
        return keys;
    }

    private List<RDQuizOption> extractOptions(JsonNode optionsNode, RDQuizQuestion question) {
        List<RDQuizOption> options = new ArrayList<>();
        if (optionsNode == null || !optionsNode.isArray()) {
            return options;
        }
        for (JsonNode oNode : optionsNode) {
            String optionText = firstText(oNode, "option_text", "optionText").trim();
            if (optionText.isEmpty()) {
                continue;
            }
            RDQuizOption option = new RDQuizOption();
            option.setQuestion(question);
            option.setOptionText(optionText);
            option.setCorrect(firstBoolean(oNode, "is_correct", "isCorrect"));
            option.setOptionImage(blankToNull(firstText(oNode, "option_image", "optionImage")));
            options.add(option);
        }
        return options;
    }

    private String firstText(JsonNode node, String... names) {
        if (node == null || names == null) {
            return "";
        }
        for (String name : names) {
            JsonNode field = node.path(name);
            if (!field.isMissingNode() && !field.isNull()) {
                String value = field.asText("");
                if (!value.isBlank()) {
                    return value.trim();
                }
            }
        }
        return "";
    }

    private int firstInt(JsonNode node, int fallback, String... names) {
        if (node == null || names == null) {
            return fallback;
        }
        for (String name : names) {
            JsonNode field = node.path(name);
            if (field.isInt() || field.isLong()) {
                return field.asInt(fallback);
            }
            if (field.isTextual()) {
                try {
                    return Integer.parseInt(field.asText().trim());
                } catch (Exception ignored) {
                    // continue
                }
            }
        }
        return fallback;
    }

    private Integer firstIntOrNull(JsonNode node, String... names) {
        if (node == null || names == null) {
            return null;
        }
        for (String name : names) {
            JsonNode field = node.path(name);
            if (field.isInt() || field.isLong()) {
                return field.asInt();
            }
            if (field.isTextual()) {
                try {
                    return Integer.parseInt(field.asText().trim());
                } catch (Exception ignored) {
                    // continue
                }
            }
        }
        return null;
    }

    private boolean firstBoolean(JsonNode node, String... names) {
        if (node == null || names == null) {
            return false;
        }
        for (String name : names) {
            JsonNode field = node.path(name);
            if (field.isBoolean()) {
                return field.asBoolean(false);
            }
            if (field.isTextual()) {
                String value = field.asText("").trim().toLowerCase();
                if ("true".equals(value) || "yes".equals(value) || "1".equals(value)) {
                    return true;
                }
            }
        }
        return false;
    }

    private RDQuizQuestion.DifficultyLevel mapDifficulty(String raw) {
        if (raw == null || raw.isBlank()) {
            return RDQuizQuestion.DifficultyLevel.Medium;
        }
        String v = raw.trim().toLowerCase();
        switch (v) {
            case "easy":
                return RDQuizQuestion.DifficultyLevel.Easy;
            case "hard":
                return RDQuizQuestion.DifficultyLevel.Hard;
            case "expert":
                return RDQuizQuestion.DifficultyLevel.Expert;
            case "master":
                return RDQuizQuestion.DifficultyLevel.Master;
            case "medium":
            default:
                return RDQuizQuestion.DifficultyLevel.Medium;
        }
    }

    private String normalizeQuestionType(String raw) {
        if (raw == null || raw.isBlank()) {
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
        if ("fill in blank".equals(v) || "fill-in-blank".equals(v) || "fill_in_the_blank".equals(v)) {
            return "fill_in_blank";
        }
        return v;
    }

    private int normalizeMarks(int marks) {
        return marks <= 0 ? 1 : marks;
    }

    private String normalizeText(String text) {
        if (text == null) {
            return "";
        }
        return text.toLowerCase().replaceAll("\\s+", " ").trim();
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
