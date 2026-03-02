package com.robodynamics.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.robodynamics.dto.RDExerciseExtractionRequest;
import com.robodynamics.dto.RDExerciseExtractionResult;
import com.robodynamics.dto.RDQuestionBankImportResult;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDExercisePdfExtractionService;
import com.robodynamics.service.RDQuestionBankIngestionService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class RDExercisePdfExtractionServiceImpl implements RDExercisePdfExtractionService {

    @Value("${rd.session.materials.base:/opt/robodynamics/session_materials}")
    private String materialsBase;

    private static final Pattern START_PATTERN = Pattern.compile("(?m)^\\s*(?:Q\\.?\\s*\\d+|\\d+\\.|\\d+\\)|\\(\\d+\\))\\s+");
    private static final Pattern OPTION_PATTERN = Pattern.compile("(?is)(?:\\(|\\b)([A-Da-d])(?:\\)|\\.)\\s*(.+?)(?=(?:\\(|\\b)[A-Da-d](?:\\)|\\.)\\s|$)");
    private static final Pattern MARKS_PATTERN = Pattern.compile("(?i)(\\d+)\\s*(?:mark|marks|m)\\b");
    private static final Pattern EXERCISE_CODE_PATTERN = Pattern.compile("(?i)exercise[_\\s-]*([0-9]+[A-Z])");

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @Autowired
    private RDQuestionBankIngestionService questionBankIngestionService;

    @Override
    public RDExerciseExtractionResult extractExercisesToJsonAndUpload(
            RDExerciseExtractionRequest request,
            RDUser actor
    ) throws Exception {
        if (request == null || request.getCourseId() == null) {
            throw new IllegalArgumentException("courseId is required.");
        }

        Integer courseId = request.getCourseId();
        List<RDCourseSession> sessions = resolveSessions(courseId, request.getSessionIds());
        if (sessions.isEmpty()) {
            throw new IllegalArgumentException("No sessions found for selected course.");
        }

        boolean includeNonExercise = Boolean.TRUE.equals(request.getIncludeNonExercise());
        boolean dryRun = Boolean.TRUE.equals(request.getDryRun());
        int maxPdfs = request.getMaxPdfs() == null ? Integer.MAX_VALUE : Math.max(1, request.getMaxPdfs());

        ArrayNode allQuestions = objectMapper.createArrayNode();
        Map<String, ArrayNode> exerciseBuckets = new LinkedHashMap<>();
        int scanned = 0;
        List<String> failedFiles = new ArrayList<>();

        for (RDCourseSession session : sessions) {
            List<RDCourseSessionDetail> details = courseSessionDetailService.getBySessionAndType(session.getCourseSessionId(), "pdf");
            if (details == null || details.isEmpty()) {
                continue;
            }
            for (RDCourseSessionDetail detail : details) {
                if (scanned >= maxPdfs) {
                    break;
                }
                if (detail == null) {
                    continue;
                }
                if (!includeNonExercise && !looksLikeExercise(detail)) {
                    continue;
                }
                Path pdfPath = resolvePdfPath(courseId, detail.getFile());
                if (pdfPath == null || !Files.exists(pdfPath)) {
                    failedFiles.add(detail.getFile());
                    continue;
                }

                scanned++;
                try {
                    String exerciseCode = resolveExerciseCode(detail);
                    ArrayNode bucket = exerciseBuckets.computeIfAbsent(exerciseCode, k -> objectMapper.createArrayNode());
                    extractQuestionsFromPdf(bucket, pdfPath, courseId, session, detail);
                } catch (Exception ex) {
                    failedFiles.add(pdfPath.toString() + " :: " + ex.getMessage());
                }
            }
            if (scanned >= maxPdfs) {
                break;
            }
        }

        List<String> jsonPaths = new ArrayList<>();
        int extractedCount = 0;
        for (Map.Entry<String, ArrayNode> e : exerciseBuckets.entrySet()) {
            String exerciseCode = e.getKey();
            ArrayNode questions = e.getValue();
            if (questions == null || questions.size() == 0) {
                continue;
            }
            extractedCount += questions.size();
            ObjectNode root = objectMapper.createObjectNode();
            root.put("course_id", courseId);
            root.put("exercise_code", exerciseCode);
            root.put("generated_at", LocalDateTime.now().toString());
            root.set("questions", questions);
            String path = writeExtractionJson(courseId, exerciseCode, root);
            jsonPaths.add(path);
            for (JsonNode q : questions) {
                allQuestions.add(q);
            }
        }

        RDExerciseExtractionResult result = new RDExerciseExtractionResult();
        result.setCourseId(courseId);
        result.setScannedPdfCount(scanned);
        result.setExtractedQuestionCount(extractedCount);
        result.setGeneratedJsonPath(jsonPaths.isEmpty() ? null : jsonPaths.get(0));
        result.setGeneratedJsonPaths(jsonPaths);
        result.setFailedFiles(failedFiles);

        if (!dryRun && allQuestions.size() > 0) {
            Integer anchorSessionId = sessions.get(0).getCourseSessionId();
            RDQuestionBankImportResult importResult = questionBankIngestionService.importFromJsonNode(
                    objectMapper.createObjectNode()
                            .put("course_id", courseId)
                            .set("questions", allQuestions),
                    courseId,
                    anchorSessionId,
                    null,
                    actor
            );
            result.setImportResult(importResult);
        }
        return result;
    }

    private List<RDCourseSession> resolveSessions(Integer courseId, List<Integer> selectedIds) {
        List<RDCourseSession> all = courseSessionService.getCourseSessionsByCourseId(courseId);
        if (all == null || all.isEmpty()) {
            return Collections.emptyList();
        }
        Set<Integer> wanted = new LinkedHashSet<>();
        if (selectedIds != null) {
            for (Integer id : selectedIds) {
                if (id != null && id > 0) {
                    wanted.add(id);
                }
            }
        }
        List<RDCourseSession> resolved = new ArrayList<>();
        for (RDCourseSession s : all) {
            if (s == null) {
                continue;
            }
            if ("unit".equalsIgnoreCase(s.getSessionType())) {
                continue;
            }
            if (!wanted.isEmpty() && !wanted.contains(s.getCourseSessionId())) {
                continue;
            }
            resolved.add(s);
        }
        return resolved;
    }

    private boolean looksLikeExercise(RDCourseSessionDetail detail) {
        String topic = detail.getTopic() == null ? "" : detail.getTopic().toLowerCase(Locale.ROOT);
        String file = detail.getFile() == null ? "" : detail.getFile().toLowerCase(Locale.ROOT);
        return topic.contains("exercise")
                || topic.contains("worksheet")
                || file.contains("exercise")
                || file.contains("worksheet")
                || file.contains("_set");
    }

    private Path resolvePdfPath(Integer courseId, String fileRef) {
        if (fileRef == null || fileRef.isBlank()) {
            return null;
        }
        String normalized = fileRef.trim().replace("\\", "/");
        if (normalized.startsWith("/session_materials/")) {
            String rel = normalized.substring("/session_materials/".length());
            return Paths.get(materialsBase, rel);
        }
        Path asIs = Paths.get(normalized);
        if (asIs.isAbsolute()) {
            return asIs;
        }
        Path inCourse = Paths.get(materialsBase, String.valueOf(courseId), normalized);
        if (Files.exists(inCourse)) {
            return inCourse;
        }
        return Paths.get(materialsBase, normalized);
    }

    private void extractQuestionsFromPdf(
            ArrayNode out,
            Path pdfPath,
            Integer courseId,
            RDCourseSession session,
            RDCourseSessionDetail detail
    ) throws Exception {
        try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            int pages = Math.max(1, document.getNumberOfPages());
            for (int i = 1; i <= pages; i++) {
                stripper.setStartPage(i);
                stripper.setEndPage(i);
                String pageText = safeText(stripper.getText(document));
                if (pageText.isBlank()) {
                    continue;
                }
                List<QuestionDraft> drafts = parseQuestionDrafts(pageText);
                for (QuestionDraft draft : drafts) {
                    ObjectNode q = out.addObject();
                    q.put("question_text", draft.questionText);
                    q.put("question_type", draft.questionType);
                    q.put("difficulty_level", draft.difficulty);
                    q.put("max_marks", draft.maxMarks);
                    q.put("correct_answer", draft.correctAnswer);
                    q.put("additional_info", "Imported from chapter exercise PDF");
                    q.put("question_image", draft.hasImageCue ? "PAGE_IMAGE_PLACEHOLDER" : "");
                    q.put("source_pdf", pdfPath.getFileName().toString());
                    q.put("source_page", i);
                    q.put("course_id", courseId);
                    q.put("course_session_id", session.getCourseSessionId());
                    q.put("course_session_detail_id", detail.getCourseSessionDetailId());

                    ArrayNode options = q.putArray("options");
                    for (OptionDraft option : draft.options) {
                        ObjectNode o = options.addObject();
                        o.put("option_text", option.text);
                        o.put("is_correct", option.correct);
                        o.put("option_image", "");
                    }
                }
            }
        }
    }

    private List<QuestionDraft> parseQuestionDrafts(String text) {
        List<String> blocks = splitQuestionBlocks(text);
        List<QuestionDraft> drafts = new ArrayList<>();
        for (String block : blocks) {
            QuestionDraft q = buildDraft(block);
            if (q != null && !q.questionText.isBlank()) {
                drafts.add(q);
            }
        }
        return drafts;
    }

    private List<String> splitQuestionBlocks(String text) {
        List<String> blocks = new ArrayList<>();
        Matcher m = START_PATTERN.matcher(text);
        List<Integer> starts = new ArrayList<>();
        while (m.find()) {
            starts.add(m.start());
        }
        if (starts.isEmpty()) {
            for (String line : text.split("\\R")) {
                String t = line.trim();
                if (t.length() > 15 && (t.endsWith("?") || t.matches(".*\\bfind\\b.*|.*\\bsolve\\b.*"))) {
                    blocks.add(t);
                }
            }
            return blocks;
        }
        for (int i = 0; i < starts.size(); i++) {
            int from = starts.get(i);
            int to = (i + 1 < starts.size()) ? starts.get(i + 1) : text.length();
            String block = text.substring(from, to).trim();
            if (!block.isBlank()) {
                blocks.add(block);
            }
        }
        return blocks;
    }

    private QuestionDraft buildDraft(String rawBlock) {
        String block = rawBlock.replaceAll("\\r", "").trim();
        block = block.replaceFirst("^(?i)\\s*(Q\\.?\\s*)?\\d+[\\.)]?\\s*", "").trim();
        if (block.isBlank()) {
            return null;
        }

        Matcher optionMatcher = OPTION_PATTERN.matcher(block);
        List<OptionDraft> options = new ArrayList<>();
        while (optionMatcher.find()) {
            String optionText = optionMatcher.group(2) == null ? "" : optionMatcher.group(2).trim();
            if (!optionText.isBlank()) {
                options.add(new OptionDraft(optionText, false));
            }
        }

        String correctAnswer = extractCorrectAnswer(block);
        if (!correctAnswer.isBlank() && options.size() >= 2 && correctAnswer.matches("(?i)[A-D]")) {
            int idx = Character.toUpperCase(correctAnswer.charAt(0)) - 'A';
            if (idx >= 0 && idx < options.size()) {
                options.get(idx).correct = true;
                correctAnswer = options.get(idx).text;
            }
        }

        if (options.size() >= 2 && correctAnswer.isBlank()) {
            options.get(0).correct = true;
            correctAnswer = options.get(0).text;
        } else if (!correctAnswer.isBlank() && options.size() >= 2) {
            for (OptionDraft option : options) {
                if (option.text.equalsIgnoreCase(correctAnswer.trim())) {
                    option.correct = true;
                }
            }
        }

        String questionText = options.size() >= 2 ? stripOptions(block) : block;
        String questionType = detectQuestionType(questionText, options);
        int maxMarks = detectMarks(block, questionType);
        String difficulty = detectDifficulty(maxMarks, questionText);
        boolean hasImageCue = hasImageCue(questionText);

        QuestionDraft draft = new QuestionDraft();
        draft.questionText = questionText;
        draft.questionType = questionType;
        draft.maxMarks = maxMarks;
        draft.correctAnswer = correctAnswer;
        draft.difficulty = difficulty;
        draft.hasImageCue = hasImageCue;
        draft.options = options;
        return draft;
    }

    private String detectQuestionType(String text, List<OptionDraft> options) {
        if (options != null && options.size() >= 2) {
            return "multiple_choice";
        }
        String v = text.toLowerCase(Locale.ROOT);
        if (v.contains("____") || v.contains("fill in the blank")) {
            return "fill_in_blank";
        }
        if (v.length() > 170 || v.contains("explain") || v.contains("justify") || v.contains("describe")) {
            return "long_answer";
        }
        return "short_answer";
    }

    private int detectMarks(String block, String questionType) {
        Matcher m = MARKS_PATTERN.matcher(block);
        if (m.find()) {
            try {
                int marks = Integer.parseInt(m.group(1));
                return Math.max(1, marks);
            } catch (Exception ignored) {
                // fall through
            }
        }
        if ("multiple_choice".equals(questionType) || "fill_in_blank".equals(questionType)) {
            return 1;
        }
        if ("long_answer".equals(questionType)) {
            return 5;
        }
        return 2;
    }

    private String detectDifficulty(int marks, String questionText) {
        if (marks >= 5) {
            return "Hard";
        }
        if (marks <= 1) {
            return "Easy";
        }
        String v = questionText.toLowerCase(Locale.ROOT);
        if (v.contains("challenge") || v.contains("prove")) {
            return "Hard";
        }
        return "Medium";
    }

    private String extractCorrectAnswer(String block) {
        Matcher m = Pattern.compile("(?im)\\bans(?:wer)?\\s*[:\\-]?\\s*([A-D]|[^\\r\\n]{1,120})").matcher(block);
        if (m.find()) {
            return m.group(1) == null ? "" : m.group(1).trim();
        }
        return "";
    }

    private String stripOptions(String block) {
        Matcher m = Pattern.compile("(?is)^(.*?)(?:\\(|\\b)[A-Da-d](?:\\)|\\.)\\s+.*$").matcher(block);
        if (m.matches()) {
            return m.group(1).trim();
        }
        return block;
    }

    private boolean hasImageCue(String text) {
        String v = text.toLowerCase(Locale.ROOT);
        return v.contains("diagram")
                || v.contains("figure")
                || v.contains("graph")
                || v.contains("draw")
                || v.contains("table");
    }

    private String safeText(String text) {
        if (text == null) {
            return "";
        }
        return text.replace('\u0000', ' ').trim();
    }

    private String writeExtractionJson(Integer courseId, String exerciseCode, JsonNode root) throws Exception {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        Path dir = Paths.get(materialsBase, String.valueOf(courseId), "extracted_json");
        Files.createDirectories(dir);
        String codePart = sanitizeExerciseCode(exerciseCode);
        Path file = dir.resolve("exercise_" + codePart + "_qbank_" + courseId + "_" + ts + ".json");
        byte[] bytes = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(root)
                .getBytes(StandardCharsets.UTF_8);
        Files.write(file, bytes);
        return file.toString();
    }

    private String resolveExerciseCode(RDCourseSessionDetail detail) {
        String topic = detail.getTopic() == null ? "" : detail.getTopic();
        String file = detail.getFile() == null ? "" : detail.getFile();
        Matcher m1 = EXERCISE_CODE_PATTERN.matcher(topic);
        if (m1.find()) {
            return m1.group(1).toUpperCase(Locale.ROOT);
        }
        Matcher m2 = EXERCISE_CODE_PATTERN.matcher(file);
        if (m2.find()) {
            return m2.group(1).toUpperCase(Locale.ROOT);
        }
        return "misc";
    }

    private String sanitizeExerciseCode(String exerciseCode) {
        if (exerciseCode == null || exerciseCode.isBlank()) {
            return "misc";
        }
        return exerciseCode.replaceAll("[^A-Za-z0-9_-]", "_").toLowerCase(Locale.ROOT);
    }

    private static class QuestionDraft {
        private String questionText;
        private String questionType;
        private int maxMarks;
        private String correctAnswer;
        private String difficulty;
        private boolean hasImageCue;
        private List<OptionDraft> options = new ArrayList<>();
    }

    private static class OptionDraft {
        private String text;
        private boolean correct;

        private OptionDraft(String text, boolean correct) {
            this.text = text;
            this.correct = correct;
        }
    }
}
