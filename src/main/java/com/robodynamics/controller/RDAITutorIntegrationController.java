package com.robodynamics.controller;

import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.Comparator;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.robodynamics.dto.RDAITutorEventRequest;
import com.robodynamics.dto.RDAITutorSessionInitRequest;
import com.robodynamics.dto.RDAITutorSessionInitResponse;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.impl.RDAITutorIntegrationService;

@RestController
@RequestMapping("/api/ai-tutor")
public class RDAITutorIntegrationController {

    @Autowired
    private RDAITutorIntegrationService aiTutorIntegrationService;

    @Autowired
    private RDUserService rdUserService;

    @Autowired
    private RDCourseService rdCourseService;

    @Autowired
    private RDCourseSessionService rdCourseSessionService;

    @Autowired
    private RDCourseSessionDetailService rdCourseSessionDetailService;

    @Autowired
    private RDQuizQuestionService rdQuizQuestionService;

    @Autowired
    private RDStudentEnrollmentService studentEnrollmentService;

    @PostMapping("/session/init")
    public ResponseEntity<?> initSession(@RequestBody(required = false) RDAITutorSessionInitRequest request,
                                         HttpSession session) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not signed in"));
        }

        RDAITutorSessionInitRequest resolved = request == null ? new RDAITutorSessionInitRequest() : request;
        Integer childId = resolveChildId(me, resolved.getChildId());
        if (isParent(me) && childId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "childId is required for parent launch when no child is linked."
            ));
        }

        if (isEnrollmentRequiredModule(resolved.getModule())
                && !isStudentEnrolledForModule(childId, resolved.getModule())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "error", "AI Tutor access denied. Student is not enrolled in this module course offering.",
                    "module", normalizeModule(resolved.getModule()),
                    "childId", childId
            ));
        }

        String token = aiTutorIntegrationService.createLaunchToken(
                me,
                childId,
                resolved.getModule(),
                resolved.getGrade()
        );
        String learnerName = resolveLearnerName(me, childId);
        ModuleEnrollmentContext launchContext = resolveEnrollmentForModule(childId, resolved.getModule());
        RDAITutorSessionInitResponse response = new RDAITutorSessionInitResponse();
        response.setLaunchUrl(
                aiTutorIntegrationService.buildLaunchUrl(
                        token,
                        learnerName,
                        resolved.getModule(),
                        launchContext == null ? null : launchContext.enrollmentId,
                        launchContext == null ? null : launchContext.courseId
                )
        );
        response.setExpiresInSec(aiTutorIntegrationService.getTokenTtlSeconds());
        response.setModule(resolved.getModule() == null ? "VEDIC_MATH" : resolved.getModule());
        response.setGrade(resolved.getGrade() == null ? safeGrade(me) : resolved.getGrade());
        response.setChildId(childId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/session/event")
    public ResponseEntity<?> receiveEvent(@RequestBody RDAITutorEventRequest request,
                                          @RequestHeader(value = "X-AI-TUTOR-KEY", required = false) String apiKey) {
        if (!aiTutorIntegrationService.isValidInternalApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid AI tutor API key"));
        }
        if (request == null || request.getSessionId() == null || request.getSessionId().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "sessionId is required"));
        }
        aiTutorIntegrationService.recordEvent(request);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/session/summary")
    public ResponseEntity<?> summary(@RequestParam(value = "childId", required = false) Integer childId,
                                     @RequestParam(value = "module", required = false, defaultValue = "VEDIC_MATH") String module,
                                     @RequestParam(value = "recentLimit", required = false, defaultValue = "15") int recentLimit,
                                     HttpSession session) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not signed in"));
        }

        Integer effectiveChildId = resolveSummaryChild(me, childId);
        Map<String, Object> summary = aiTutorIntegrationService.getSummary(effectiveChildId, module);
        List<RDAITutorEventRequest> recent = aiTutorIntegrationService.getRecentEvents(
                effectiveChildId,
                module,
                recentLimit
        );

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("summary", summary);
        out.put("recentEvents", recent);
        return ResponseEntity.ok(out);
    }

    @GetMapping("/course-template")
    public ResponseEntity<?> courseTemplate(@RequestParam("courseId") Integer courseId,
                                            @RequestHeader(value = "X-AI-TUTOR-KEY", required = false) String apiKey) {
        if (!aiTutorIntegrationService.isValidInternalApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid AI tutor API key"));
        }
        if (courseId == null || courseId <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "courseId must be a positive integer"));
        }

        RDCourse course = rdCourseService.getRDCourse(courseId);
        if (course == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Course not found"));
        }

        List<RDCourseSession> sessions = rdCourseSessionService.getCourseSessionsByCourseId(courseId);
        if (sessions == null) {
            sessions = Collections.emptyList();
        }

        List<Map<String, Object>> chapters = new ArrayList<>();
        for (RDCourseSession session : sessions) {
            if (session == null || session.getCourseSessionId() == null) {
                continue;
            }
            String sessionType = normalizeType(session.getSessionType());
            if (!sessionType.isEmpty() && !"session".equals(sessionType)) {
                continue;
            }

            int courseSessionId = session.getCourseSessionId();
            List<RDCourseSessionDetail> details;
            try {
                details = rdCourseSessionDetailService.getRDCourseSessionDetails(courseSessionId);
            } catch (Exception ex) {
                // Skip broken/missing asset references instead of failing the full template response.
                details = Collections.emptyList();
            }
            if (details == null) {
                details = Collections.emptyList();
            }
            Map<String, Integer> assets = buildAssetCounts(details);
            List<Map<String, Object>> assetItems = buildAssetItems(courseId, details);
            List<Map<String, Object>> questionPool = buildQuestionPool(courseId, courseSessionId, 45);

            String title = safe(session.getSessionTitle(), "Session " + session.getSessionId());
            List<String> subtopics = deriveSubtopics(session, details);
            Map<String, Object> chapter = new LinkedHashMap<>();
            chapter.put("chapterCode", deriveChapterCode(session));
            chapter.put("title", title);
            chapter.put("estimatedMinutes", 35);
            chapter.put("chapterOrder", session.getSessionId() == null ? session.getCourseSessionId() : session.getSessionId());
            chapter.put("subtopics", subtopics);
            chapter.put("learningGoals", deriveLearningGoals(title, subtopics));
            chapter.put("exerciseGroups", List.of("A", "B", "C", "D", "E", "F", "G", "H", "I"));
            chapter.put("exerciseFlow", buildExerciseFlow(subtopics));
            chapter.put("assets", assets);
            chapter.put("assetItems", assetItems);
            chapter.put("questionPool", questionPool);
            if (!assetItems.isEmpty()) {
                Object sourceUrlObj = assetItems.get(0).get("url");
                chapter.put("source", sourceUrlObj == null ? "" : String.valueOf(sourceUrlObj));
            }
            chapters.add(chapter);
        }

        chapters.sort(
            Comparator.comparingInt(c -> toInt(c.get("chapterOrder"), Integer.MAX_VALUE))
        );
        for (Map<String, Object> chapter : chapters) {
            chapter.remove("chapterOrder");
        }

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("courseId", courseId);
        out.put("courseName", safe(course.getCourseName(), ""));
        out.put("chapters", chapters);
        out.put("generatedAt", java.time.Instant.now().toString());
        return ResponseEntity.ok(out);
    }

    private Integer resolveChildId(RDUser me, Integer requestedChildId) {
        if (isStudent(me)) {
            return me.getUserID();
        }
        List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
        if (children == null || children.isEmpty()) {
            return requestedChildId;
        }

        if (requestedChildId != null) {
            Set<Integer> allowed = children.stream()
                    .map(RDUser::getUserID)
                    .collect(Collectors.toSet());
            if (!allowed.contains(requestedChildId)) {
                return null;
            }
            return requestedChildId;
        }
        return children.get(0).getUserID();
    }

    private Integer resolveSummaryChild(RDUser me, Integer requestedChildId) {
        if (isStudent(me)) {
            return me.getUserID();
        }
        if (requestedChildId == null) {
            List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
            if (children == null || children.isEmpty()) {
                return null;
            }
            return children.get(0).getUserID();
        }
        List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
        if (children == null || children.isEmpty()) {
            return null;
        }
        Set<Integer> allowed = children.stream().map(RDUser::getUserID).collect(Collectors.toSet());
        return allowed.contains(requestedChildId) ? requestedChildId : null;
    }

    private static boolean isParent(RDUser user) {
        return user != null && user.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue();
    }

    private static boolean isStudent(RDUser user) {
        return user != null && user.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue();
    }

    private static String safeGrade(RDUser user) {
        if (user == null || user.getGrade() == null || user.getGrade().isBlank()) {
            return "6";
        }
        return user.getGrade();
    }

    private static String safe(String value, String fallback) {
        return value == null ? fallback : value;
    }

    private static String normalizeType(String value) {
        return safe(value, "").trim().toLowerCase(Locale.ENGLISH);
    }

    private static int toInt(Object value, int fallback) {
        if (value == null) {
            return fallback;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(value).trim());
        } catch (Exception ex) {
            return fallback;
        }
    }

    private static String deriveChapterCode(RDCourseSession session) {
        if (session == null) {
            return "CHAPTER_1";
        }
        Integer id = session.getSessionId() != null ? session.getSessionId() : session.getCourseSessionId();
        String base = safe(session.getSessionTitle(), "CHAPTER").trim().toUpperCase(Locale.ENGLISH);
        base = base.replaceAll("[^A-Z0-9]+", "_").replaceAll("_+", "_");
        base = base.replaceAll("^_+|_+$", "");
        if (base.isBlank()) {
            base = "CHAPTER";
        }
        return "S" + id + "_" + base;
    }

    private static List<String> deriveSubtopics(RDCourseSession session, List<RDCourseSessionDetail> details) {
        List<String> out = new ArrayList<>();
        String desc = safe(session == null ? null : session.getSessionDescription(), "").trim();
        if (!desc.isEmpty()) {
            String[] parts = desc.split("[\\n,;|]");
            for (String p : parts) {
                String t = safe(p, "").trim();
                if (!t.isEmpty() && t.length() >= 3) {
                    out.add(t);
                }
                if (out.size() >= 6) {
                    break;
                }
            }
        }

        if (out.isEmpty() && details != null) {
            for (RDCourseSessionDetail d : details) {
                String topic = safe(d == null ? null : d.getTopic(), "").trim();
                if (!topic.isEmpty()) {
                    out.add(topic);
                }
                if (out.size() >= 6) {
                    break;
                }
            }
        }

        if (out.isEmpty()) {
            out.add(safe(session == null ? null : session.getSessionTitle(), "Core Concept"));
        }
        return out;
    }

    private static List<String> deriveLearningGoals(String title, List<String> subtopics) {
        List<String> goals = new ArrayList<>();
        goals.add("Understand core ideas in " + safe(title, "this chapter") + ".");
        goals.add("Apply the concept in exam-style questions.");
        if (subtopics != null && !subtopics.isEmpty()) {
            goals.add("Master subtopic checkpoints: " + subtopics.get(0));
        }
        return goals;
    }

    private static List<Map<String, String>> buildExerciseFlow(List<String> subtopics) {
        List<String> topics = (subtopics == null || subtopics.isEmpty()) ? List.of("Practice") : subtopics;
        List<String> groups = List.of("A", "B", "C", "D", "E", "F", "G", "H", "I");
        int totalGroups = groups.size();
        int totalTopics = topics.size();
        int base = totalGroups / totalTopics;
        int extra = totalGroups % totalTopics;

        List<Map<String, String>> flow = new ArrayList<>();
        int cursor = 0;
        for (int i = 0; i < totalTopics; i++) {
            int width = base + (i < extra ? 1 : 0);
            for (int w = 0; w < width && cursor < totalGroups; w++) {
                flow.add(Map.of("exerciseGroup", groups.get(cursor), "subtopic", topics.get(i)));
                cursor++;
            }
        }
        while (cursor < totalGroups) {
            flow.add(Map.of("exerciseGroup", groups.get(cursor), "subtopic", topics.get(topics.size() - 1)));
            cursor++;
        }
        return flow;
    }

    private static Map<String, Integer> buildAssetCounts(List<RDCourseSessionDetail> details) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        counts.put("video", 0);
        counts.put("pdf", 0);
        counts.put("quiz", 0);
        counts.put("flashcard", 0);
        counts.put("matchinggame", 0);
        counts.put("matchingpair", 0);
        counts.put("assignment", 0);
        counts.put("exampaper", 0);
        if (details == null) {
            return counts;
        }
        for (RDCourseSessionDetail d : details) {
            String t = normalizeType(d == null ? null : d.getType());
            if (t.isEmpty()) {
                continue;
            }
            if ("notes".equals(t)) {
                t = "pdf";
            }
            if ("exam_paper".equals(t) || "exam-paper".equals(t) || "exam paper".equals(t)) {
                t = "exampaper";
            }
            if (counts.containsKey(t)) {
                counts.put(t, counts.get(t) + 1);
            }
        }
        return counts;
    }

    private static List<Map<String, Object>> buildAssetItems(int courseId, List<RDCourseSessionDetail> details) {
        List<Map<String, Object>> out = new ArrayList<>();
        if (details == null) {
            return out;
        }
        for (RDCourseSessionDetail d : details) {
            if (d == null) {
                continue;
            }
            String file = safe(d.getFile(), "").trim();
            if (file.isEmpty()) {
                continue;
            }
            String type = normalizeType(d.getType());
            if ("notes".equals(type)) {
                type = "pdf";
            }
            if ("exam_paper".equals(type) || "exam-paper".equals(type) || "exam paper".equals(type)) {
                type = "exampaper";
            }

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("assetType", type.isEmpty() ? "asset" : type);
            row.put("topic", safe(d.getTopic(), ""));
            row.put("file", file);
            row.put("url", toPublicAssetUrl(courseId, file));
            out.add(row);
        }
        return out;
    }

    private static String toPublicAssetUrl(int courseId, String fileRef) {
        String normalized = safe(fileRef, "").trim().replace('\\', '/');
        if (normalized.isEmpty()) {
            return "";
        }
        if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
            return normalized;
        }
        if (normalized.startsWith("/session_materials/")) {
            return normalized;
        }
        if (normalized.startsWith("session_materials/")) {
            return "/" + normalized;
        }
        String relative = normalized.startsWith("/") ? normalized.substring(1) : normalized;
        return "/session_materials/" + courseId + "/" + relative;
    }

    private List<Map<String, Object>> buildQuestionPool(int courseId, int sessionId, int limit) {
        List<Map<String, Object>> out = new ArrayList<>();
        List<RDQuizQuestion> questions;
        try {
            questions = rdQuizQuestionService.findByFilters(courseId, sessionId, null, null, limit, 0);
        } catch (Exception ex) {
            // Some legacy rows can point to missing media entities; skip question pool in that case.
            return out;
        }
        if (questions == null) {
            return out;
        }
        for (RDQuizQuestion q : questions) {
            if (q == null) {
                continue;
            }
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("questionId", "Q_" + q.getQuestionId());
            row.put("skill", safe(q.getSyllabusTag(), "Concept"));
            row.put("difficulty", q.getDifficultyLevel() == null ? "medium" : q.getDifficultyLevel().name().toLowerCase(Locale.ENGLISH));
            row.put("type", normalizeQuestionType(q.getQuestionType()));
            row.put("questionText", safe(q.getQuestionText(), "Practice question"));
            row.put("hint", safe(q.getAdditionalInfo(), "Use concept and solve step-by-step."));
            row.put("solution", safe(q.getExplanation(), "Review concept and reattempt."));
            row.put("expectedAnswer", safe(q.getCorrectAnswer(), ""));
            row.put("visual", q.getQuestionImage() == null || q.getQuestionImage().isBlank()
                    ? null
                    : Map.of("kind", "image", "src", q.getQuestionImage()));
            out.add(row);
        }
        return out;
    }

    private static String normalizeQuestionType(String questionType) {
        String q = normalizeType(questionType);
        if ("mcq".equals(q) || "multiplechoice".equals(q) || "multiple_choice".equals(q)) {
            return "multiple_choice";
        }
        if ("fillintheblank".equals(q) || "fill_in_blank".equals(q) || "fill_in_the_blank".equals(q)) {
            return "fill_in_blank";
        }
        if ("longanswer".equals(q) || "long_answer".equals(q)) {
            return "long_answer";
        }
        return "short_answer";
    }

    private boolean isStudentEnrolledForModule(Integer studentId, String module) {
        if (studentId == null) {
            return false;
        }
        List<com.robodynamics.model.RDStudentEnrollment> enrollments =
                studentEnrollmentService.getStudentEnrollmentByStudent(studentId);
        if (enrollments == null || enrollments.isEmpty()) {
            return false;
        }
        for (com.robodynamics.model.RDStudentEnrollment enrollment : enrollments) {
            if (enrollment == null || enrollment.getStatus() == 0 || enrollment.getCourseOffering() == null
                    || enrollment.getCourseOffering().getCourse() == null) {
                continue;
            }
            int enrolledCourseId = enrollment.getCourseOffering().getCourse().getCourseId();
            String enrolledCourseName = enrollment.getCourseOffering().getCourse().getCourseName();
            if (aiTutorIntegrationService.isCourseMappedToModule(enrolledCourseId, enrolledCourseName, module)) {
                return true;
            }
        }
        return false;
    }

    private ModuleEnrollmentContext resolveEnrollmentForModule(Integer studentId, String module) {
        if (studentId == null) {
            return null;
        }
        List<com.robodynamics.model.RDStudentEnrollment> enrollments =
                studentEnrollmentService.getStudentEnrollmentByStudent(studentId);
        if (enrollments == null || enrollments.isEmpty()) {
            return null;
        }
        for (com.robodynamics.model.RDStudentEnrollment enrollment : enrollments) {
            if (enrollment == null || enrollment.getStatus() == 0 || enrollment.getCourseOffering() == null
                    || enrollment.getCourseOffering().getCourse() == null) {
                continue;
            }
            int enrolledCourseId = enrollment.getCourseOffering().getCourse().getCourseId();
            String enrolledCourseName = enrollment.getCourseOffering().getCourse().getCourseName();
            if (aiTutorIntegrationService.isCourseMappedToModule(enrolledCourseId, enrolledCourseName, module)) {
                return new ModuleEnrollmentContext(enrollment.getEnrollmentId(), enrolledCourseId);
            }
        }
        return null;
    }

    private static String normalizeModule(String module) {
        if (module == null || module.isBlank()) {
            return "VEDIC_MATH";
        }
        return module.trim().toUpperCase(Locale.ENGLISH);
    }

    private static boolean isEnrollmentRequiredModule(String module) {
        String normalized = normalizeModule(module);
        return "NEET_PHYSICS".equals(normalized)
                || "NEET_CHEMISTRY".equals(normalized)
                || "NEET_BIOLOGY".equals(normalized);
    }

    private String resolveLearnerName(RDUser me, Integer childId) {
        if (me == null) {
            return "";
        }
        if (isStudent(me)) {
            return me.getFullName();
        }
        if (childId == null) {
            return me.getFullName();
        }
        RDUser child = rdUserService.getRDUser(childId);
        if (child == null) {
            return me.getFullName();
        }
        return child.getFullName();
    }

    private static final class ModuleEnrollmentContext {
        private final Integer enrollmentId;
        private final Integer courseId;

        private ModuleEnrollmentContext(Integer enrollmentId, Integer courseId) {
            this.enrollmentId = enrollmentId;
            this.courseId = courseId;
        }
    }
}
