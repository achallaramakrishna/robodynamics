package com.robodynamics.service.impl;

import com.robodynamics.dto.RDCreateExamPaperRequest;
import com.robodynamics.dto.RDCreateExamPaperResult;
import com.robodynamics.dto.RDCreateExamPaperResult.CreatedPaper;
import com.robodynamics.dto.RDExamPaperUploadDTO;
import com.robodynamics.dto.RDExamPaperUploadDTO.AnswerKeyDTO;
import com.robodynamics.dto.RDExamPaperUploadDTO.SectionDTO;
import com.robodynamics.dto.RDExamPaperUploadDTO.SectionQuestionDTO;
import com.robodynamics.dto.RDQuizOptionDTO;
import com.robodynamics.dto.RDQuizQuestionDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDExamPaperService;
import com.robodynamics.service.RDExamPrepPaperGenerationService;
import com.robodynamics.service.RDExamQuestionAugmentationService;
import com.robodynamics.service.RDQuizQuestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RDExamPrepPaperGenerationServiceImpl implements RDExamPrepPaperGenerationService {
    private static final String GENERATED_EXAM_SESSION_TITLE = "Exam Papers - Parent Generated";
    private static final int RANDOM_SELECTION_ATTEMPTS = 16;
    private static final List<String> TOUGH_DIFFICULTIES = List.of("Hard", "Expert");
    private static final List<String> DEFAULT_TYPES_FOR_AI = List.of(
            "multiple_choice", "short_answer", "long_answer", "fill_in_blank"
    );
    private static final Set<String> NON_MATH_BANNED_TERMS = Set.of(
            "photosynthesis", "chlorophyll", "stomata", "mitochondria", "respiration",
            "ecosystem", "food chain", "atom", "molecule", "chemical equation", "biology",
            "physics", "evaporation cycle", "condensation cycle", "habitat", "cell wall",
            "cell membrane", "osmosis", "genetic", "dna", "renewable energy",
            "greenhouse gas", "capital of france", "oxygenating blood", "unit of life",
            "cell division", "mitosis", "calvin cycle", "chloroplast"
    );
    private static final Set<String> MATH_SIGNAL_TERMS = Set.of(
            "add", "addition", "subtract", "subtraction", "difference", "sum", "total",
            "multiply", "multiplication", "divide", "division", "quotient", "remainder",
            "factor", "multiple", "fraction", "decimal", "percentage", "ratio", "average",
            "place value", "round off", "perimeter", "area", "volume", "measurement",
            "geometry", "angle", "shape", "pattern", "net", "time", "temperature",
            "data", "table", "graph", "bar graph", "line plot", "cm", "mm", "km",
            "kg", "ml", "rupees", "₹", "inr", "rs."
    );
    private static final Set<String> ADVANCED_MATH_BANNED_TERMS_FOR_G5 = Set.of(
            "derivative", "integral", "trigonometry", "sin(", "cos(", "tan(",
            "f(x)", "limit as", "matrix", "determinant"
    );
    private static final Logger log = LoggerFactory.getLogger(RDExamPrepPaperGenerationServiceImpl.class);

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @Autowired
    private RDExamPaperService examPaperService;

    @Autowired
    private RDExamQuestionAugmentationService examQuestionAugmentationService;

    @Override
    @Transactional
    public RDCreateExamPaperResult generateExamPapers(RDCreateExamPaperRequest request, RDUser createdBy) {
        validateRequest(request);

        int requestedPaperCount = normalizePaperCount(request.getNumberOfPapers());
        int targetMarks = request.getTotalMarks();
        boolean allowAi = Boolean.TRUE.equals(request.getAllowAiAugmentation());
        List<Integer> sessionIds = distinctSessionIds(request.getSessionIds());
        if (sessionIds.isEmpty()) {
            throw new IllegalArgumentException("Select at least one valid chapter/session.");
        }
        int aiGeneratedCount = 0;

        Map<Integer, RDQuizQuestion> questionPoolMap = loadQuestionPool(request.getCourseId(), sessionIds);
        if (allowAi) {
            aiGeneratedCount += proactivelyAugmentWithToughQuestions(request, createdBy, sessionIds, questionPoolMap);
        }
        applyPoolFilters(questionPoolMap, request.getQuestionTypes(), request.getDifficultyLevels(), request);
        if (questionPoolMap.isEmpty()) {
            throw new IllegalArgumentException("No questions found for selected chapters and filters.");
        }

        List<RDQuizQuestion> questionPool = new ArrayList<>(questionPoolMap.values());
        questionPool.sort(Comparator.comparingInt(RDQuizQuestion::getQuestionId));

        RDCreateExamPaperResult result = new RDCreateExamPaperResult();
        result.setRequestedPaperCount(requestedPaperCount);
        result.setCreatedPapers(new ArrayList<>());

        Set<Integer> globallyUsedQuestionIds = new HashSet<>();
        for (int paperIndex = 1; paperIndex <= requestedPaperCount; paperIndex++) {
            List<RDQuizQuestion> selected = selectQuestionsForPaper(questionPool, globallyUsedQuestionIds, targetMarks, paperIndex);
            if (sumMarks(selected) != targetMarks) {
                if (allowAi) {
                    int shortfall = Math.max(1, targetMarks - sumMarks(selected));
                    List<RDQuizQuestion> aiGenerated = examQuestionAugmentationService.generateAndStoreQuestions(request, shortfall, createdBy);
                    aiGeneratedCount += aiGenerated.size();
                    for (RDQuizQuestion q : aiGenerated) {
                        questionPoolMap.putIfAbsent(q.getQuestionId(), q);
                    }
                    questionPool = new ArrayList<>(questionPoolMap.values());
                    applyPoolFiltersToList(questionPool, request.getQuestionTypes(), request.getDifficultyLevels(), request);
                    selected = selectQuestionsForPaper(questionPool, globallyUsedQuestionIds, targetMarks, paperIndex + 1000);
                }
            }

            int selectedMarks = sumMarks(selected);
            if (selectedMarks != targetMarks) {
                throw new IllegalStateException(
                        "Unable to match exact total marks (" + targetMarks + ") for paper " + paperIndex
                                + ". Please adjust question filters or enable broader AI generation.");
            }

            for (RDQuizQuestion question : selected) {
                globallyUsedQuestionIds.add(question.getQuestionId());
            }

            RDCourseSessionDetail generatedDetail = createGeneratedSessionDetail(
                    request.getCourseId(),
                    sessionIds.get(0),
                    buildPaperTitle(request, paperIndex)
            );

            RDExamPaperUploadDTO payload = buildExamPaperPayload(request, selected, generatedDetail.getTopic());
            try {
                examPaperService.upsertExamPaperFromJson(
                        payload,
                        sessionIds.get(0),
                        generatedDetail.getCourseSessionDetailId(),
                        createdBy
                );
            } catch (Exception ex) {
                throw new IllegalStateException("Failed to persist generated exam paper: " + ex.getMessage(), ex);
            }
            RDExamPaper createdPaper = examPaperService.getExamPapersBySessionDetail(generatedDetail.getCourseSessionDetailId());
            if (createdPaper != null) {
                CreatedPaper cp = new CreatedPaper();
                cp.setExamPaperId(createdPaper.getExamPaperId());
                cp.setTitle(createdPaper.getTitle());
                cp.setTotalMarks(createdPaper.getTotalMarks());
                cp.setSessionDetailId(generatedDetail.getCourseSessionDetailId());
                result.getCreatedPapers().add(cp);
            }
        }

        result.setCreatedPaperCount(result.getCreatedPapers().size());
        result.setAiGeneratedQuestionsCount(aiGeneratedCount);
        return result;
    }

    private void validateRequest(RDCreateExamPaperRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request payload is required.");
        }
        if (request.getCourseId() == null) {
            throw new IllegalArgumentException("Course is required.");
        }
        if (request.getSessionIds() == null || request.getSessionIds().isEmpty()) {
            throw new IllegalArgumentException("Select at least one chapter/session.");
        }
        if (request.getTotalMarks() == null || request.getTotalMarks() <= 0) {
            throw new IllegalArgumentException("Total marks must be greater than 0.");
        }
    }

    private int normalizePaperCount(Integer value) {
        if (value == null || value < 1) {
            return 1;
        }
        return Math.min(value, 10);
    }

    private List<Integer> distinctSessionIds(List<Integer> incoming) {
        if (incoming == null) {
            return Collections.emptyList();
        }
        return incoming.stream()
                .filter(id -> id != null && id > 0)
                .distinct()
                .collect(Collectors.toList());
    }

    private Map<Integer, RDQuizQuestion> loadQuestionPool(Integer courseId, List<Integer> sessionIds) {
        Map<Integer, RDQuizQuestion> pool = new LinkedHashMap<>();
        for (Integer sessionId : sessionIds) {
            List<RDQuizQuestion> sessionQuestions = quizQuestionService.findByFilters(courseId, sessionId, null, null);
            for (RDQuizQuestion q : sessionQuestions) {
                if (q != null) {
                    pool.putIfAbsent(q.getQuestionId(), q);
                }
            }
        }
        return pool;
    }

    private void applyPoolFilters(
            Map<Integer, RDQuizQuestion> pool,
            List<String> questionTypes,
            List<String> difficultyLevels,
            RDCreateExamPaperRequest request
    ) {
        Set<String> typeSet = normalizeTypeSet(questionTypes);
        Set<String> difficultySet = normalizeDifficultySet(difficultyLevels);
        pool.entrySet().removeIf(e -> !isQuestionEligible(e.getValue(), typeSet, difficultySet, request));
    }

    private void applyPoolFiltersToList(
            List<RDQuizQuestion> pool,
            List<String> questionTypes,
            List<String> difficultyLevels,
            RDCreateExamPaperRequest request
    ) {
        Set<String> typeSet = normalizeTypeSet(questionTypes);
        Set<String> difficultySet = normalizeDifficultySet(difficultyLevels);
        pool.removeIf(q -> !isQuestionEligible(q, typeSet, difficultySet, request));
    }

    private boolean isQuestionEligible(
            RDQuizQuestion question,
            Set<String> typeSet,
            Set<String> difficultySet,
            RDCreateExamPaperRequest request
    ) {
        if (question == null || !question.isActive()) {
            return false;
        }
        String qType = normalizeQuestionType(question.getQuestionType());
        if (!typeSet.isEmpty() && !typeSet.contains(qType)) {
            return false;
        }
        String qDifficulty = question.getDifficultyLevel() == null ? "" : question.getDifficultyLevel().name();
        if (!difficultySet.isEmpty() && !difficultySet.contains(qDifficulty)) {
            return false;
        }
        if (!isQuestionTopicallyAllowed(question, request)) {
            return false;
        }
        return true;
    }

    private boolean isQuestionTopicallyAllowed(RDQuizQuestion question, RDCreateExamPaperRequest request) {
        if (!isMathContext(request)) {
            return true;
        }

        String text = (question.getQuestionText() == null ? "" : question.getQuestionText().trim());
        if (text.isEmpty()) {
            return false;
        }
        String normalized = text.toLowerCase(Locale.ENGLISH);
        for (String banned : NON_MATH_BANNED_TERMS) {
            if (normalized.contains(banned)) {
                return false;
            }
        }
        if (request != null && request.getCourseId() != null && request.getCourseId() == 34) {
            for (String banned : ADVANCED_MATH_BANNED_TERMS_FOR_G5) {
                if (normalized.contains(banned)) {
                    return false;
                }
            }
        }

        if (containsMathSignal(normalized)) {
            return true;
        }

        // Fallback: allow only if question has numbers or math operators.
        return normalized.matches(".*\\d+.*")
                || normalized.contains("+")
                || normalized.contains("-")
                || normalized.contains("*")
                || normalized.contains("/")
                || normalized.contains("%");
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

    private boolean containsMathSignal(String normalizedText) {
        for (String signal : MATH_SIGNAL_TERMS) {
            if (normalizedText.contains(signal)) {
                return true;
            }
        }
        return false;
    }

    private Set<String> normalizeTypeSet(List<String> types) {
        if (types == null || types.isEmpty()) {
            return Collections.emptySet();
        }
        return types.stream()
                .map(this::normalizeQuestionType)
                .filter(s -> s != null && !s.isEmpty())
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private Set<String> normalizeDifficultySet(List<String> levels) {
        if (levels == null || levels.isEmpty()) {
            return Collections.emptySet();
        }
        Set<String> set = new LinkedHashSet<>();
        for (String level : levels) {
            String normalized = normalizeDifficulty(level);
            if (!normalized.isEmpty()) {
                set.add(normalized);
            }
        }
        return set;
    }

    private List<RDQuizQuestion> selectQuestionsForPaper(
            List<RDQuizQuestion> pool,
            Set<Integer> globallyUsedQuestionIds,
            int targetMarks,
            int seedOffset
    ) {
        List<RDQuizQuestion> unused = pool.stream()
                .filter(q -> !globallyUsedQuestionIds.contains(q.getQuestionId()))
                .collect(Collectors.toList());
        List<RDQuizQuestion> used = pool.stream()
                .filter(q -> globallyUsedQuestionIds.contains(q.getQuestionId()))
                .collect(Collectors.toList());

        if (unused.isEmpty() && used.isEmpty()) {
            return Collections.emptyList();
        }

        List<RDQuizQuestion> best = Collections.emptyList();
        int bestMarks = -1;
        long baseSeed = System.currentTimeMillis() + (31L * seedOffset) + (17L * targetMarks);

        for (int attempt = 0; attempt < RANDOM_SELECTION_ATTEMPTS; attempt++) {
            List<RDQuizQuestion> randomizedUnused = new ArrayList<>(unused);
            List<RDQuizQuestion> randomizedUsed = new ArrayList<>(used);
            Random random = new Random(baseSeed + attempt);
            Collections.shuffle(randomizedUnused, random);
            Collections.shuffle(randomizedUsed, random);

            List<RDQuizQuestion> prioritized = new ArrayList<>(randomizedUnused);
            prioritized.addAll(randomizedUsed);
            List<RDQuizQuestion> candidate = selectBySubsetSum(prioritized, targetMarks);
            int marks = sumMarks(candidate);
            if (marks == targetMarks) {
                return candidate;
            }
            if (marks > bestMarks) {
                bestMarks = marks;
                best = candidate;
            }
        }
        return best;
    }

    private List<RDQuizQuestion> selectBySubsetSum(List<RDQuizQuestion> questions, int targetMarks) {
        if (questions == null || questions.isEmpty() || targetMarks <= 0) {
            return Collections.emptyList();
        }

        boolean[] reachable = new boolean[targetMarks + 1];
        int[] prevSum = new int[targetMarks + 1];
        int[] pickedIndex = new int[targetMarks + 1];
        for (int i = 0; i <= targetMarks; i++) {
            prevSum[i] = -1;
            pickedIndex[i] = -1;
        }
        reachable[0] = true;

        for (int idx = 0; idx < questions.size(); idx++) {
            int marks = normalizeMarks(questions.get(idx).getMaxMarks());
            if (marks <= 0 || marks > targetMarks) {
                continue;
            }
            for (int sum = targetMarks; sum >= marks; sum--) {
                if (!reachable[sum] && reachable[sum - marks]) {
                    reachable[sum] = true;
                    prevSum[sum] = sum - marks;
                    pickedIndex[sum] = idx;
                }
            }
        }

        int bestSum = targetMarks;
        while (bestSum > 0 && !reachable[bestSum]) {
            bestSum--;
        }
        if (bestSum <= 0) {
            return Collections.emptyList();
        }

        List<RDQuizQuestion> selected = new ArrayList<>();
        int cursor = bestSum;
        while (cursor > 0) {
            int qIndex = pickedIndex[cursor];
            if (qIndex < 0) {
                break;
            }
            selected.add(questions.get(qIndex));
            cursor = prevSum[cursor];
        }
        Collections.reverse(selected);
        return selected;
    }

    private int sumMarks(List<RDQuizQuestion> questions) {
        int sum = 0;
        if (questions == null) {
            return sum;
        }
        for (RDQuizQuestion q : questions) {
            sum += normalizeMarks(q.getMaxMarks());
        }
        return sum;
    }

    private int normalizeMarks(int marks) {
        return marks <= 0 ? 1 : marks;
    }

    private int proactivelyAugmentWithToughQuestions(
            RDCreateExamPaperRequest request,
            RDUser createdBy,
            List<Integer> sessionIds,
            Map<Integer, RDQuizQuestion> questionPoolMap
    ) {
        if (sessionIds == null || sessionIds.isEmpty()) {
            return 0;
        }

        RDCreateExamPaperRequest toughRequest = copyForToughAugmentation(request, sessionIds);
        int marksToGenerate = Math.max(20, Math.min(80, Math.max(20, request.getTotalMarks() / 2)));
        try {
            List<RDQuizQuestion> generated = examQuestionAugmentationService.generateAndStoreQuestions(
                    toughRequest,
                    marksToGenerate,
                    createdBy
            );
            if (generated == null || generated.isEmpty()) {
                return 0;
            }
            for (RDQuizQuestion q : generated) {
                questionPoolMap.putIfAbsent(q.getQuestionId(), q);
            }
            return generated.size();
        } catch (Exception ex) {
            log.warn("Tough-question pre-augmentation failed for courseId={} sessionIds={}: {}",
                    request.getCourseId(), sessionIds, ex.getMessage());
            return 0;
        }
    }

    private RDCreateExamPaperRequest copyForToughAugmentation(RDCreateExamPaperRequest source, List<Integer> sessionIds) {
        RDCreateExamPaperRequest copy = new RDCreateExamPaperRequest();
        copy.setCourseId(source.getCourseId());
        copy.setSessionIds(new ArrayList<>(sessionIds));
        copy.setQuestionTypes(source.getQuestionTypes() == null || source.getQuestionTypes().isEmpty()
                ? new ArrayList<>(DEFAULT_TYPES_FOR_AI)
                : new ArrayList<>(source.getQuestionTypes()));
        copy.setDifficultyLevels(new ArrayList<>(TOUGH_DIFFICULTIES));
        copy.setExamType(source.getExamType());
        copy.setTotalMarks(source.getTotalMarks());
        copy.setDurationMinutes(source.getDurationMinutes());
        copy.setNumberOfPapers(1);
        copy.setAiTargetMarks(source.getAiTargetMarks());
        copy.setAllowAiAugmentation(Boolean.TRUE);
        copy.setTitlePrefix(source.getTitlePrefix());
        copy.setSubject(source.getSubject());
        copy.setBoard(source.getBoard());
        copy.setExamYear(source.getExamYear());
        return copy;
    }

    private String buildPaperTitle(RDCreateExamPaperRequest request, int paperIndex) {
        String prefix = request.getTitlePrefix() == null || request.getTitlePrefix().isBlank()
                ? "Generated Exam"
                : request.getTitlePrefix().trim();
        String type = request.getExamType() == null || request.getExamType().isBlank()
                ? "GENERAL"
                : request.getExamType().trim().toUpperCase();
        return prefix + " - " + type + " - Paper " + paperIndex;
    }

    private RDCourseSessionDetail createGeneratedSessionDetail(Integer courseId, Integer sessionId, String topic) {
        RDCourseSession session = courseSessionService.getCourseSession(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("Invalid session selected: " + sessionId);
        }
        if (session.getCourse() == null || session.getCourse().getCourseId() != courseId) {
            throw new IllegalArgumentException("Selected chapter does not belong to selected course.");
        }
        RDCourseSession targetSession = resolveOrCreateGeneratedExamSession(courseId, session);

        RDCourseSessionDetail detail = new RDCourseSessionDetail();
        detail.setCourse(session.getCourse());
        detail.setCourseSession(targetSession);
        detail.setTopic(topic);
        detail.setType("exampaper");
        detail.setCreationDate(new Date());
        detail.setVersion(1);
        detail.setHasAnimation(Boolean.FALSE);
        detail.setAssignment(false);
        courseSessionDetailService.saveRDCourseSessionDetail(detail);
        return detail;
    }

    private RDCourseSession resolveOrCreateGeneratedExamSession(Integer courseId, RDCourseSession anchorSession) {
        List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        for (RDCourseSession existing : sessions) {
            if (existing == null) {
                continue;
            }
            if ("session".equalsIgnoreCase(existing.getSessionType())
                    && GENERATED_EXAM_SESSION_TITLE.equalsIgnoreCase(existing.getSessionTitle())) {
                return existing;
            }
        }

        RDCourse course = courseService.getRDCourse(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Invalid course selected: " + courseId);
        }

        RDCourseSession generatedSession = new RDCourseSession();
        generatedSession.setCourse(course);
        generatedSession.setSessionType("session");
        generatedSession.setSessionTitle(GENERATED_EXAM_SESSION_TITLE);
        generatedSession.setSessionDescription("Auto-created session that groups parent-generated exam papers.");
        generatedSession.setCreationDate(new Date());
        generatedSession.setVersion(1);
        generatedSession.setGrade(anchorSession.getGrade());
        generatedSession.setTierLevel(anchorSession.getTierLevel());
        generatedSession.setTierOrder(anchorSession.getTierOrder() + 1);
        generatedSession.setSessionId(nextGeneratedSessionId(sessions));
        courseSessionService.saveCourseSession(generatedSession);
        return generatedSession;
    }

    private Integer nextGeneratedSessionId(List<RDCourseSession> sessions) {
        int maxSessionId = 0;
        if (sessions != null) {
            for (RDCourseSession session : sessions) {
                if (session == null || session.getSessionId() == null) {
                    continue;
                }
                if (session.getSessionId() > maxSessionId) {
                    maxSessionId = session.getSessionId();
                }
            }
        }
        return maxSessionId + 1;
    }

    private RDExamPaperUploadDTO buildExamPaperPayload(
            RDCreateExamPaperRequest request,
            List<RDQuizQuestion> selectedQuestions,
            String title
    ) {
        RDExamPaperUploadDTO dto = new RDExamPaperUploadDTO();
        RDCourse course = courseService.getRDCourse(request.getCourseId());

        dto.setTitle(title);
        dto.setSubject((request.getSubject() == null || request.getSubject().isBlank())
                ? (course == null ? "General" : course.getCourseName())
                : request.getSubject());
        dto.setBoard((request.getBoard() == null || request.getBoard().isBlank())
                ? "CBSE"
                : request.getBoard());
        dto.setExamYear(request.getExamYear() == null ? LocalDate.now().getYear() : request.getExamYear());
        dto.setExamType(request.getExamType() == null ? "FINAL_EXAM" : request.getExamType());
        dto.setPatternCode("AUTO_" + request.getCourseId() + "_" + System.currentTimeMillis());
        dto.setDurationMinutes(request.getDurationMinutes() == null ? 90 : request.getDurationMinutes());
        dto.setTotalMarks(request.getTotalMarks());
        dto.setInstructions("Generated from chapter-wise question bank filters.");
        dto.setNegativeMarking(Boolean.FALSE);
        dto.setNegativeMarkValue(0.0);
        dto.setShuffleSections(Boolean.FALSE);
        dto.setShuffleQuestions(Boolean.FALSE);

        SectionDTO section = new SectionDTO();
        section.setSectionName("A");
        section.setTitle("Generated Section");
        section.setDescription("Auto-selected from chapter-wise question bank.");
        section.setInstructions("Answer all questions.");
        section.setAttemptType("ALL");
        section.setAttemptCount(selectedQuestions.size());
        section.setCompulsory(Boolean.TRUE);
        section.setSectionOrder(1);
        section.setShuffleQuestions(Boolean.FALSE);
        section.setTotalMarks(request.getTotalMarks());

        List<SectionQuestionDTO> sqList = new ArrayList<>();
        int displayOrder = 1;
        for (RDQuizQuestion q : selectedQuestions) {
            SectionQuestionDTO sq = new SectionQuestionDTO();
            sq.setQuestion(toQuestionDto(q, request.getExamType()));
            sq.setMarks(normalizeMarks(q.getMaxMarks()));
            sq.setNegativeMarks(0.0);
            sq.setDisplayOrder(displayOrder++);
            sq.setMandatory(Boolean.TRUE);
            sq.setMaxWordLimit("long_answer".equalsIgnoreCase(q.getQuestionType()) ? 350 : 150);
            sq.setSubLabel(null);
            sq.setParentQuestionId(null);
            sq.setInternalChoiceGroup(null);
            sq.setAnswerKey(toAnswerKeyDto(q));
            sqList.add(sq);
        }
        section.setQuestions(sqList);
        dto.setSections(Collections.singletonList(section));
        return dto;
    }

    private RDQuizQuestionDTO toQuestionDto(RDQuizQuestion q, String examType) {
        RDQuizQuestionDTO dto = new RDQuizQuestionDTO();
        dto.setQuestionText(q.getQuestionText());
        dto.setQuestionType(normalizeQuestionType(q.getQuestionType()));
        dto.setDifficultyLevel(q.getDifficultyLevel() == null ? "Medium" : q.getDifficultyLevel().name());
        dto.setCorrectAnswer(q.getCorrectAnswer());
        dto.setMaxMarks(normalizeMarks(q.getMaxMarks()));
        dto.setAdditionalInfo(q.getAdditionalInfo());
        dto.setPoints(q.getPoints() == null ? normalizeMarks(q.getMaxMarks()) : q.getPoints());
        dto.setExamType(examType == null ? q.getExamType() : examType);
        dto.setQuestionImage(q.getQuestionImage());
        dto.setSyllabusTag(q.getSyllabusTag());
        dto.setExplanation(q.getExplanation());
        dto.setExamYear(q.getExamYear());
        dto.setExamPaper(q.getExamPaper());
        dto.setIsPYQ(q.getIsPYQ());

        List<RDQuizOptionDTO> optionDTOS = new ArrayList<>();
        if (q.getOptions() != null) {
            List<RDQuizOption> optionList = new ArrayList<>(q.getOptions());
            optionList.sort(Comparator.comparingInt(RDQuizOption::getOptionId));
            for (RDQuizOption option : optionList) {
                RDQuizOptionDTO o = new RDQuizOptionDTO();
                o.setOptionText(option.getOptionText());
                o.setCorrect(option.isCorrect());
                o.setOptionImage(option.getOptionImage());
                optionDTOS.add(o);
            }
        }
        dto.setOptions(optionDTOS);
        return dto;
    }

    private AnswerKeyDTO toAnswerKeyDto(RDQuizQuestion q) {
        AnswerKeyDTO ak = new AnswerKeyDTO();
        String modelAnswer = q.getCorrectAnswer();
        if (modelAnswer == null || modelAnswer.isBlank()) {
            modelAnswer = q.getExplanation();
        }
        if (modelAnswer == null || modelAnswer.isBlank()) {
            modelAnswer = "Answer to be reviewed by evaluator.";
        }
        ak.setModelAnswer(modelAnswer);
        List<String> keyPoints = new ArrayList<>();
        if (q.getExplanation() != null && !q.getExplanation().isBlank()) {
            keyPoints.add(q.getExplanation());
        }
        if (q.getAdditionalInfo() != null && !q.getAdditionalInfo().isBlank()) {
            keyPoints.add(q.getAdditionalInfo());
        }
        ak.setKeyPoints(keyPoints);
        ak.setExpectedKeywords(modelAnswer);
        return ak;
    }

    private String normalizeQuestionType(String raw) {
        if (raw == null) {
            return "short_answer";
        }
        String v = raw.trim().toLowerCase();
        switch (v) {
            case "mcq":
            case "multiple choice":
                return "multiple_choice";
            case "long answer":
                return "long_answer";
            case "short answer":
                return "short_answer";
            case "fill in blank":
            case "fill-in-blank":
                return "fill_in_blank";
            default:
                return v;
        }
    }

    private String normalizeDifficulty(String raw) {
        if (raw == null) {
            return "";
        }
        String v = raw.trim().toLowerCase();
        switch (v) {
            case "easy":
                return "Easy";
            case "hard":
                return "Hard";
            case "expert":
                return "Expert";
            case "master":
                return "Master";
            case "medium":
                return "Medium";
            default:
                return "";
        }
    }
}
