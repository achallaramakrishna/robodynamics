package com.robodynamics.controller;

import com.robodynamics.dto.RDCreateExamPaperRequest;
import com.robodynamics.dto.RDCreateExamPaperResult;
import com.robodynamics.dto.RDExerciseExtractionRequest;
import com.robodynamics.dto.RDExerciseExtractionResult;
import com.robodynamics.dto.RDQuestionBankImportResult;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDExercisePdfExtractionService;
import com.robodynamics.service.RDExamPrepPaperGenerationService;
import com.robodynamics.service.RDExamQuestionAugmentationService;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDQuestionBankIngestionService;
import com.robodynamics.util.RDRoleRouteUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/exam-prep")
public class RDExamPrepCreateExamController {

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDExamPrepPaperGenerationService examPrepPaperGenerationService;

    @Autowired
    private RDExamQuestionAugmentationService examQuestionAugmentationService;

    @Autowired
    private RDExercisePdfExtractionService exercisePdfExtractionService;

    @Autowired
    private RDQuestionBankIngestionService questionBankIngestionService;

    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @GetMapping("/create")
    public String showCreateExamPage(HttpSession session, Model model) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) {
            return "redirect:/login?redirect=/exam-prep/create";
        }
        if (!isParentOrAdmin(user)) {
            return RDRoleRouteUtil.redirectHomeFor(user);
        }

        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);
        model.addAttribute("currentYear", LocalDate.now().getYear());
        model.addAttribute("defaultCourseId", 34);
        model.addAttribute("isAdminExamPrep", isAdmin(user));
        model.addAttribute("homePath", RDRoleRouteUtil.homePathFor(user));
        return "exam/create-exam";
    }

    @GetMapping(value = "/api/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> getSessionsForCourse(
            @RequestParam("courseId") Integer courseId,
            HttpSession session
    ) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (!isParentOrAdmin(user)) {
            return new ArrayList<>();
        }

        List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        return sessions.stream()
                .filter(s -> s != null && !"unit".equalsIgnoreCase(s.getSessionType()))
                .map(s -> {
                    Map<String, Object> m = new HashMap<>();
                    List<RDQuizQuestion> questions = quizQuestionService.findByFilters(courseId, s.getCourseSessionId(), null, null);
                    long easyCount = questions.stream().filter(q -> q.getDifficultyLevel() == RDQuizQuestion.DifficultyLevel.Easy).count();
                    long mediumCount = questions.stream().filter(q -> q.getDifficultyLevel() == RDQuizQuestion.DifficultyLevel.Medium).count();
                    long hardCount = questions.stream().filter(q -> q.getDifficultyLevel() == RDQuizQuestion.DifficultyLevel.Hard).count();
                    long expertCount = questions.stream().filter(q -> q.getDifficultyLevel() == RDQuizQuestion.DifficultyLevel.Expert).count();
                    long masterCount = questions.stream().filter(q -> q.getDifficultyLevel() == RDQuizQuestion.DifficultyLevel.Master).count();
                    m.put("sessionId", s.getCourseSessionId());
                    m.put("sessionTitle", s.getSessionTitle());
                    m.put("grade", s.getGrade());
                    m.put("sessionType", s.getSessionType());
                    m.put("tierLevel", s.getTierLevel() == null ? "" : s.getTierLevel().name());
                    m.put("questionCount", questions.size());
                    m.put("easyCount", easyCount);
                    m.put("mediumCount", mediumCount);
                    m.put("hardCount", hardCount);
                    m.put("expertCount", expertCount);
                    m.put("masterCount", masterCount);
                    m.put("toughCount", hardCount + expertCount + masterCount);
                    return m;
                })
                .collect(Collectors.toList());
    }

    @PostMapping(
            value = "/api/create-exam",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public ResponseEntity<?> createExamPapers(
            @RequestBody RDCreateExamPaperRequest request,
            HttpSession session
    ) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Session expired. Please login."));
        }
        if (!isParentOrAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Only parents and admins can create exam papers."));
        }

        try {
            RDCreateExamPaperResult result = examPrepPaperGenerationService.generateExamPapers(request, user);
            Map<String, Object> payload = new HashMap<>();
            payload.put("success", true);
            payload.put("message", "Exam papers generated successfully.");
            payload.put("result", result);
            return ResponseEntity.ok(payload);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage() == null ? "Failed to create exam papers." : ex.getMessage()
            ));
        }
    }

    @PostMapping(
            value = "/api/prepare-bank",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public ResponseEntity<?> prepareQuestionBank(
            @RequestBody RDCreateExamPaperRequest request,
            HttpSession session
    ) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Session expired. Please login."));
        }
        if (!isAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Only admins can prepare question banks."));
        }

        int targetMarks = request.getAiTargetMarks() != null
                ? request.getAiTargetMarks()
                : (request.getTotalMarks() != null ? request.getTotalMarks() : 25);
        if (targetMarks <= 0) {
            targetMarks = 25;
        }

        try {
            List<RDQuizQuestion> generated = examQuestionAugmentationService.generateAndStoreQuestions(request, targetMarks, user);
            if (generated == null || generated.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "AI generation returned 0 questions. Please verify model/API connectivity and retry."
                ));
            }
            Map<String, Object> payload = new HashMap<>();
            payload.put("success", true);
            payload.put("message", "Question bank prepared.");
            payload.put("generatedCount", generated.size());
            payload.put("questionIds", generated.stream().map(RDQuizQuestion::getQuestionId).collect(Collectors.toList()));
            return ResponseEntity.ok(payload);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage() == null ? "Failed to prepare question bank." : ex.getMessage()
            ));
        }
    }

    @PostMapping(
            value = "/api/extract-exercises",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public ResponseEntity<?> extractExercisesFromPdf(
            @RequestBody RDExerciseExtractionRequest request,
            HttpSession session
    ) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Session expired. Please login."));
        }
        if (!isAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Only admins can run extraction."));
        }
        try {
            RDExerciseExtractionResult result = exercisePdfExtractionService.extractExercisesToJsonAndUpload(request, user);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Exercise extraction completed.",
                    "result", result
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage() == null ? "Failed to extract exercises." : ex.getMessage()
            ));
        }
    }

    @PostMapping(value = "/api/upload-question-bank", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<?> uploadQuestionBankJson(
            @RequestParam("courseId") Integer courseId,
            @RequestParam("sessionId") Integer sessionId,
            @RequestParam(value = "sessionDetailId", required = false) Integer sessionDetailId,
            @RequestParam("file") MultipartFile file,
            HttpSession session
    ) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Session expired. Please login."));
        }
        if (!isAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Only admins can upload question bank."));
        }
        try {
            RDQuestionBankImportResult result = questionBankIngestionService.importFromJsonFile(
                    file, courseId, sessionId, sessionDetailId, user
            );
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Question bank uploaded successfully.",
                    "result", result
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", ex.getMessage() == null ? "Failed to upload question bank." : ex.getMessage()
            ));
        }
    }

    private boolean isParentOrAdmin(RDUser user) {
        if (user == null) {
            return false;
        }
        if (user.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
            return true;
        }
        return RDRoleRouteUtil.isAdminProfile(user.getProfile_id());
    }

    private boolean isAdmin(RDUser user) {
        return user != null && RDRoleRouteUtil.isAdminProfile(user.getProfile_id());
    }
}
