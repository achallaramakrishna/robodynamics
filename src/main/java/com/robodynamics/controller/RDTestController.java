package com.robodynamics.controller;

import java.beans.PropertyEditorSupport;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.dto.RDSessionItem;
import com.robodynamics.form.RDTestCreateForm;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDTest;
import com.robodynamics.model.RDTestDetailRole;
import com.robodynamics.model.RDTestType;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDVisibility;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDTestService;
import com.robodynamics.dto.*;

@Controller
@RequestMapping("/test-management")
public class RDTestController {

    @Autowired private RDTestService testService;
    @Autowired private RDCourseSessionService courseSessionService;

    /* ------------ bind LocalDate (yyyy-MM-dd) ------------ */
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        DateTimeFormatter d = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        binder.registerCustomEditor(LocalDate.class, new PropertyEditorSupport() {
            @Override public void setAsText(String text) {
                if (text == null || text.trim().isEmpty()) { setValue(null); return; }
                setValue(LocalDate.parse(text.trim(), d));
            }
        });
    }

    /* =======================================================
       LIST (index) – role aware
       GET /tests
       ======================================================= */
    @GetMapping
    public String list(@RequestParam(required=false) String q,
                       @RequestParam(required=false) Integer courseId,
                       @RequestParam(required=false) Integer offeringId,
                       @RequestParam(required=false) String grade,
                       @RequestParam(required=false, name="student") String studentQuery,
                       Model model, HttpSession session) {
        // existing: fetch tests
        List<RDTest> tests = testService.findForAdminOrMentorOrParent(q, courseId /*...*/);

        // collect ids
        List<Integer> tids = tests.stream().map(RDTest::getTestId).toList();

        // counts (for student badge)
        Map<Integer, Long> enrollCounts = testService.countEnrollmentsForTests(tids);

        // lightweight grouping for badges (unique offerings + grades per test)
        Map<Integer, List<RDTestEnrollSummaryDTO>> summaries =
            testService.enrollmentsByTest(tids, offeringId, grade, studentQuery);

        // compress to sets for display
        Map<Integer, Set<String>> offeringsByTest = new HashMap<>();
        Map<Integer, Set<String>> gradesByTest    = new HashMap<>();
        for (var e : summaries.entrySet()) {
            int testId = e.getKey();
            Set<String> offs = new LinkedHashSet<>();
            Set<String> grs  = new LinkedHashSet<>();
            for (var d : e.getValue()) {
                offs.add(d.getOfferingName() + " (#" + d.getOfferingId() + ")");
                if (d.getGradeLabel() != null) grs.add(d.getGradeLabel());
            }
            offeringsByTest.put(testId, offs);
            gradesByTest.put(testId, grs);
        }

        model.addAttribute("tests", tests);
        model.addAttribute("q", q);
        model.addAttribute("courseId", courseId);
        model.addAttribute("offeringId", offeringId);
        model.addAttribute("grade", grade);
        model.addAttribute("student", studentQuery);
        model.addAttribute("enrollCounts", enrollCounts);
        model.addAttribute("offeringsByTest", offeringsByTest);
        model.addAttribute("gradesByTest", gradesByTest);
        return "test-management/list";
    }

    /* =======================================================
       NEW (form) – role aware course list
       GET /tests/new
       ======================================================= */
    @GetMapping("/new")
    public String newForm(@RequestParam(value = "courseId", required = false) Integer courseId,
                          @RequestParam(value = "offeringId", required = false) Integer offeringId,
                          @RequestParam(value = "sessionType", required = false) String sessionType,
                          Model model, HttpSession session) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) return "redirect:/login";

        // courses based on role
        List<RDCourse> courses = allowedCoursesForUser(user);

        RDTestCreateForm form = (RDTestCreateForm) model.asMap().get("form");
        if (form == null) form = new RDTestCreateForm();

        if (courseId == null) {
            if (form.getCourseId() != null) courseId = form.getCourseId();
            else if (!courses.isEmpty()) courseId = courses.get(0).getCourseId();
        }
        form.setCourseId(courseId);

        List<RDSessionItem> sessions;
        if (courseId != null) {
            sessions = courseSessionService.findSessionItemsByCourse(courseId, sessionType);
        } else {
            sessions = Collections.emptyList();
        }

        model.addAttribute("courses", courses);
        model.addAttribute("form", form);
        model.addAttribute("sessions", sessions);
        model.addAttribute("chosenCourseId", courseId);
        model.addAttribute("chosenOfferingId", offeringId);
        model.addAttribute("chosenSessionType", sessionType);

        return "test-management/form";
    }

    /* =======================================================
       CREATE (submit)
       POST /tests
       ======================================================= */
    @PostMapping
    public String create(@ModelAttribute("form") RDTestCreateForm form,
                         HttpSession session, RedirectAttributes ra) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) { ra.addFlashAttribute("error", "Please sign in to continue."); return "redirect:/login"; }

        if (form.getCourseId() == null ||
            form.getTestTitle() == null || form.getTestTitle().trim().isEmpty() ||
            form.getTestType() == null || form.getTestDate() == null) {
            ra.addFlashAttribute("error", "Please fill in all required fields.");
            ra.addFlashAttribute("form", form);
            return "redirect:/tests/new";
        }

        RDTestType type = parseEnum(RDTestType.class, form.getTestType());
        if (type == null) {
            ra.addFlashAttribute("error", "Invalid test type.");
            ra.addFlashAttribute("form", form);
            return "redirect:/tests/new";
        }

        try {
            // creators: admin/mentor/parent can create; student typically not. Enforce upstream if needed.
            RDTest created = testService.createTest(
                    user,               // who’s creating (role inside service)
                    form.getCourseId(),
                    form.getTestTitle().trim(),
                    type,
                    form.getTotalMarks(),
                    form.getPassingMarks(),
                    form.getTestDate()
            );

            if (form.getSessionIds() != null && !form.getSessionIds().isEmpty()) {
                testService.linkSessions(created.getTestId(),
                        form.getSessionIds(),
                        RDTestDetailRole.PORTION,
                        user.getUserID());
            }

            ra.addFlashAttribute("message", "Test created successfully.");
            return "redirect:/tests";
        } catch (Exception e) {
            ra.addFlashAttribute("error", e.getMessage() != null ? e.getMessage() : "Failed to create test.");
            ra.addFlashAttribute("form", form);
            return "redirect:/tests/new";
        }
    }

    /* =======================================================
       VIEW – fetch-joined sessions
       GET /tests/view
       ======================================================= */
    @GetMapping("/view")
    public String view(@RequestParam("testId") Integer testId,
                       Model model, HttpSession session, RedirectAttributes ra) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) { ra.addFlashAttribute("error", "Please sign in to continue."); return "redirect:/login"; }

        RDTest t = testService.findByIdWithSessionsIfAllowed(testId, user);
        if (t == null) {
            ra.addFlashAttribute("error", "Test not found or access denied.");
            return "redirect:/tests";
        }

        model.addAttribute("test", t);
        model.addAttribute("linkedIds", new HashSet<>(testService.findLinkedSessionIds(testId)));
        return "test-management/details";
    }

    /* =======================================================
       EDIT – load form
       GET /tests/edit
       ======================================================= */
    @GetMapping("/edit")
    public String editForm(@RequestParam("testId") Integer testId,
                           Model model, HttpSession session, RedirectAttributes ra) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) { ra.addFlashAttribute("error", "Please sign in to continue."); return "redirect:/login"; }

        RDTest t = testService.findByIdIfAllowed(testId, user);
        if (t == null) {
            ra.addFlashAttribute("error", "Test not found or access denied.");
            return "redirect:/tests";
        }

        RDTestCreateForm form = new RDTestCreateForm();
        form.setTestId(t.getTestId());
        form.setCourseId(t.getCourse() != null ? t.getCourse().getCourseId() : null);
        form.setTestTitle(t.getTestTitle());
        form.setTestType(t.getTestType() != null ? t.getTestType().name() : null);
        form.setTotalMarks(t.getTotalMarks());
        form.setPassingMarks(t.getPassingMarks());
        form.setTestDate(t.getTestDate());

        model.addAttribute("courses", allowedCoursesForUser(user));
        model.addAttribute("form", form);
        model.addAttribute("editing", true);
        return "test-management/form";
    }

    /* =======================================================
       EDIT – submit
       POST /tests/edit
       ======================================================= */
    @PostMapping("/edit")
    public String editSubmit(@ModelAttribute("form") RDTestCreateForm form,
                             HttpSession session, RedirectAttributes ra) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) { ra.addFlashAttribute("error", "Please sign in to continue."); return "redirect:/login"; }
        if (form.getTestId() == null) { ra.addFlashAttribute("error", "Missing test id."); return "redirect:/tests"; }
        if (form.getCourseId() == null ||
            form.getTestTitle() == null || form.getTestTitle().trim().isEmpty() ||
            form.getTestType() == null ||
            form.getTestDate() == null) {
            ra.addFlashAttribute("error", "Please fill in all required fields.");
            ra.addFlashAttribute("form", form);
            return "redirect:/tests/edit?testId=" + form.getTestId();
        }

        RDTestType type = parseEnum(RDTestType.class, form.getTestType());
        if (type == null) {
            ra.addFlashAttribute("error", "Invalid test type.");
            ra.addFlashAttribute("form", form);
            return "redirect:/tests/edit?testId=" + form.getTestId();
        }

        try {
            testService.updateIfAllowed(
                    form.getTestId(),
                    user,
                    form.getCourseId(),
                    form.getTestTitle().trim(),
                    type,
                    form.getTotalMarks(),
                    form.getPassingMarks(),
                    form.getTestDate()
            );
            ra.addFlashAttribute("message", "Test updated.");
            return "redirect:/tests/view?testId=" + form.getTestId();
        } catch (Exception ex) {
            ra.addFlashAttribute("error", ex.getMessage() != null ? ex.getMessage() : "Failed to update test.");
            ra.addFlashAttribute("form", form);
            return "redirect:/tests/edit?testId=" + form.getTestId();
        }
    }

    /* =======================================================
       DELETE – submit
       POST /tests/delete
       ======================================================= */
    @PostMapping("/delete")
    public String delete(@RequestParam("testId") Integer testId,
                         HttpSession session, RedirectAttributes ra) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) { ra.addFlashAttribute("error", "Please sign in to continue."); return "redirect:/login"; }
        try {
            testService.deleteIfAllowed(testId, user);
            ra.addFlashAttribute("message", "Test deleted.");
        } catch (Exception ex) {
            ra.addFlashAttribute("error", ex.getMessage() != null ? ex.getMessage() : "Failed to delete test.");
        }
        return "redirect:/tests";
    }

    /* =======================================================
       MAP SESSIONS – form
       GET /tests/map-sessions
       ======================================================= */
    @GetMapping("/map-sessions")
    public String mapSessions(@RequestParam("testId") Integer testId,
                              @RequestParam(value = "courseId", required = false) Integer courseId,
                              @RequestParam(value = "offeringId", required = false) Integer offeringId,
                              @RequestParam(value = "sessionType", required = false) String sessionType,
                              Model model, HttpSession session, RedirectAttributes ra) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) { ra.addFlashAttribute("error", "Please sign in to continue."); return "redirect:/login"; }

        RDTest t = testService.findByIdIfAllowed(testId, user);
        if (t == null) {
            ra.addFlashAttribute("error", "Test not found or access denied.");
            return "redirect:/tests";
        }

        Integer effectiveCourseId = (courseId != null)
                ? courseId
                : (t.getCourse() != null ? t.getCourse().getCourseId() : null);

        List<RDSessionItem> sessions = courseSessionService.findSessionItemsByCourse(effectiveCourseId, sessionType);

        List<Integer> linked = testService.findLinkedSessionIds(testId);
        Map<Integer, Boolean> linkedIdMap = new HashMap<>();
        for (Integer id : linked) linkedIdMap.put(id, Boolean.TRUE);

        model.addAttribute("test", t);
        model.addAttribute("sessions", sessions);
        model.addAttribute("linkedIdMap", linkedIdMap);
        model.addAttribute("courseId", effectiveCourseId);
        model.addAttribute("offeringId", offeringId);
        model.addAttribute("sessionType", sessionType);

        return "test-management/map-sessions";
    }

    /* =======================================================
       MAP SESSIONS – submit
       POST /tests/map-sessions
       ======================================================= */
    @PostMapping("/map-sessions")
    public String saveMappings(@RequestParam("testId") Integer testId,
                               @RequestParam(value = "sessionIds", required = false) List<Integer> sessionIds,
                               HttpSession session, RedirectAttributes ra) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) { ra.addFlashAttribute("error", "Please sign in to continue."); return "redirect:/login"; }

        RDTest t = testService.findByIdIfAllowed(testId, user);
        if (t == null) {
            ra.addFlashAttribute("error", "Test not found or access denied.");
            return "redirect:/tests";
        }

        Set<Integer> desired = (sessionIds == null) ? Collections.emptySet() : new HashSet<>(sessionIds);
        Set<Integer> current = new HashSet<>(testService.findLinkedSessionIds(testId));

        int add = 0, remove = 0;
        for (Integer sid : current) {
            if (!desired.contains(sid)) { testService.unlinkSession(testId, sid); remove++; }
        }
        for (Integer sid : desired) {
            if (!current.contains(sid)) {
                testService.linkSession(testId, sid, RDTestDetailRole.PORTION, user.getUserID(), null,
                        // record which role performed this mapping
                        visibilityFor(user));
                add++;
            }
        }

        ra.addFlashAttribute("message",
                (add == 0 && remove == 0) ? "No changes."
                        : String.format("Sessions updated. Added %d, removed %d.", add, remove));
        return "redirect:/tests/view?testId=" + testId;
    }

    /* =======================================================
       AJAX: sessions for a course – same as parent, open to all
       GET /tests/api/sessions
       ======================================================= */
    @GetMapping(value = "/api/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<RDSessionItem> sessions(@RequestParam("courseId") Integer courseId,
                                        @RequestParam(value = "sessionType", required = false) String sessionType,
                                        @RequestParam(value = "type", required = false) String typeAlias,
                                        HttpSession session) {
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null || courseId == null) return Collections.emptyList();
        String effType = (sessionType != null && !sessionType.isEmpty()) ? sessionType : typeAlias;
        return courseSessionService.findSessionItemsByCourse(courseId, effType);
    }

    /* ===================== helpers ===================== */

    private List<RDCourse> allowedCoursesForUser(RDUser user) {
        switch (user.getProfile_id()) {
            case 1: // SUPER_ADMIN
            case 2: // ROBO_ADMIN
                return testService.allowedCoursesForAdmin(); // implement in service/dao
            case 3: // ROBO_MENTOR
                return testService.allowedCoursesForMentor(user.getUserID());
            case 4: // ROBO_PARENT
                return testService.allowedCoursesForParent(user.getUserID());
            case 5: // ROBO_STUDENT
                return testService.allowedCoursesForStudent(user.getUserID());
            default:
                return Collections.emptyList();
        }
    }
    
    @GetMapping("/api/enrollments")
    @ResponseBody
    public List<RDTestEnrollSummaryDTO> apiEnrollments(@RequestParam Integer testId,
                                                     @RequestParam(required=false) Integer offeringId,
                                                     @RequestParam(required=false) String grade,
                                                     @RequestParam(required=false) String q) {
        return testService.enrollmentsByTest(List.of(testId), offeringId, grade, q)
                          .getOrDefault(testId, Collections.emptyList());
    }

    private static <E extends Enum<E>> E parseEnum(Class<E> type, String raw) {
        if (raw == null) return null;
        String key = raw.trim().replace('-', '_').replace(' ', '_').toUpperCase(Locale.ROOT);
        for (E e : type.getEnumConstants()) if (e.name().equals(key)) return e;
        return null;
    }

    private RDVisibility visibilityFor(RDUser user) {
        switch (user.getProfile_id()) {
            case 1: case 2: return RDVisibility.ADMIN;
            case 3:          return RDVisibility.MENTOR;
            case 4:          return RDVisibility.PARENT;
            case 5:          return RDVisibility.STUDENT;
            default:         return RDVisibility.PARENT;
        }
    }
}
