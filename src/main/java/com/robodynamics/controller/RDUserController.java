package com.robodynamics.controller;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDContact;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseTracking;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDCourseTrackingService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class RDUserController {

    private static final Logger log = LoggerFactory.getLogger(RDUserController.class);

    @Autowired private RDCourseOfferingService courseOfferingService;
    @Autowired private RDClassAttendanceService attendanceService;
    @Autowired private RDCourseTrackingService trackingService;       // kept if used elsewhere
    @Autowired private RDCourseService courseService;                  // kept if used elsewhere
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDStudentEnrollmentService enrollmentService;
    @Autowired private RDUserService userService;
    @Autowired private RDCourseTrackingService courseTrackingService;

    /* ================== Unchanged auth / user endpoints (your originals) ================== */

    @GetMapping("/register")
    public ModelAndView home(Model m) {
        RDUser rdUser = new RDUser();
        m.addAttribute("rdUser", rdUser);
        return new ModelAndView("register");
    }

    @GetMapping("/listusers")
    public ModelAndView listusers(Model m) {
        RDUser rdUser = new RDUser();
        m.addAttribute("rdUser", rdUser);
        List<RDUser> rdUserList = userService.getRDUsers();
        m.addAttribute("rdUserList", rdUserList);
        return new ModelAndView("manageusers");
    }

    @PostMapping("/search")
    public ModelAndView search(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
        List<RDUser> rdUserList = userService.searchUsers(rdUser.getProfile_id(), rdUser.getActive());
        model.addAttribute("rdUserList", rdUserList);
        return new ModelAndView("manageusers");
    }

    @PostMapping("/register")
    public String register(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
        userService.registerRDUser(rdUser);
        model.addAttribute("success", "Registered Successfully");
        return "login";
    }

    @GetMapping("/contactus")
    public String register(@ModelAttribute("rdContact") RDContact rdContact, Model model) {
        model.addAttribute(new RDContact());
        return "contactus";
    }

    @GetMapping("/login")
    public String loginDisplay(Model m, HttpSession session) {
        RDUser rdUser = new RDUser();
        m.addAttribute("rdUser", rdUser);
        return "login";
    }

    @GetMapping("/logout")
    public String logout(Model m, HttpSession session) {
        RDUser rdUser = new RDUser();
        if (session.getAttribute("rdUser") != null) {
            session.invalidate();
            m.addAttribute("success", "You have logout Successfully!!!");
        }
        m.addAttribute("rdUser", rdUser);
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute("rdUser") RDUser rdUser, Model model, HttpSession session) {
        try {
            RDUser authenticated = userService.loginRDUser(rdUser);
            if (authenticated != null) {
                model.addAttribute("rdUser", authenticated);
                session.setAttribute("rdUser", authenticated);
                log.info("Login success for username='{}', userId={}", safe(rdUser.getUserName()), authenticated.getUserID());

                String redirectUrl = (String) session.getAttribute("redirectUrl");
                if (redirectUrl != null) {
                    session.removeAttribute("redirectUrl");
                    return "redirect:" + redirectUrl;
                }

                if (authenticated.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
                    return "redirect:/parent/dashboard";
                } else if (authenticated.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
                    return "redirect:/studentDashboard";
                } else if (authenticated.getProfile_id() == RDUser.profileType.ROBO_MENTOR.getValue()) {
                    return "redirect:/mentor/dashboard";
                } else {
                    return "redirect:/dashboard";
                }
            }

            String username = rdUser.getUserName();
            RDUser byName = userService.findByUserName(username);
            if (byName == null) {
                model.addAttribute("error", "No account found with that username.");
                model.addAttribute("errorDetail", "Check for typos or create a new account.");
            } else if (byName.getActive() == 0) {
                model.addAttribute("error", "Your account is inactive.");
                model.addAttribute("errorDetail", "Please contact the administrator to activate your account.");
            } else {
                model.addAttribute("error", "Incorrect password.");
                model.addAttribute("errorDetail", "If you forgot your password, use the 'Forgot password' link.");
            }
        } catch (Exception ex) {
            log.error("Unexpected error during login for username='{}'", safe(rdUser.getUserName()), ex);
            model.addAttribute("error", "Something went wrong while signing you in.");
            model.addAttribute("errorDetail", "Please try again in a moment.");
        }

        model.addAttribute("rdUser", rdUser);
        return "login";
    }

    private String safe(String s) { return s == null ? "" : s.replaceAll("[\\r\\n]", ""); }

    @GetMapping("/dashboard")
    public String homeDashboard() { return "dashboard"; }

    @PostMapping("/dashboard")
    public String showDashboard(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
        List<RDUser> users = userService.searchUsers(rdUser.getProfile_id(), rdUser.getActive());
        model.addAttribute("users", users);
        return "dashboard";
    }

    /* ================== Attendance & Tracking (UPDATED) ================== */

    /**
     * New flat view endpoint so your URL /attendance-tracking-flat?date=YYYY-MM-DD works.
     */
    @GetMapping("/attendance-tracking-flat")
    public String attendanceTrackingFlat(@RequestParam(value = "date", required = false) String dateParam,
                                         Model model, HttpSession session) {
        // Delegate to the main method with view=flat
        return viewAttendanceTracking(dateParam, "flat", model, session);
    }

    /**
     * Main attendance endpoint. Pass view=accordion (default) or view=flat.
     */
    @GetMapping("/attendance-tracking")
    public String viewAttendanceTracking(@RequestParam(value = "date", required = false) String dateParam,
                                         @RequestParam(value = "view", defaultValue = "accordion") String view,
                                         Model model,
                                         HttpSession session) {

        // 1) Parse date
        LocalDate selectedDate;
        if (dateParam != null && !dateParam.isEmpty()) {
            try {
                selectedDate = LocalDate.parse(dateParam);
            } catch (DateTimeParseException e) {
                selectedDate = LocalDate.now();
                model.addAttribute("error", "Invalid date format. Showing today's date.");
            }
        } else {
            selectedDate = LocalDate.now();
        }

        DateTimeFormatter iso = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter pretty = DateTimeFormatter.ofPattern("dd MMM yyyy");
        model.addAttribute("selectedDateFormatted", selectedDate.format(iso));     // for <input type="date">
        model.addAttribute("selectedDate", selectedDate.format(pretty));           // for heading

        // 2) Who am I?
        RDUser current = (RDUser) session.getAttribute("rdUser");
        Integer profileId = (current != null) ? current.getProfile_id() : null;
        Integer userId    = (current != null) ? current.getUserID()      : null;

        // 3) Offerings by role
        List<RDCourseOffering> todayOfferings;
        boolean isAdmin =
                profileId != null &&
                (profileId == RDUser.profileType.SUPER_ADMIN.getValue()
              || profileId == RDUser.profileType.ROBO_ADMIN.getValue()
              || profileId == RDUser.profileType.ROBO_FINANCE_ADMIN.getValue());

        boolean isMentor = profileId != null && (profileId == RDUser.profileType.ROBO_MENTOR.getValue());

        if (isAdmin) {
            todayOfferings = courseOfferingService.getCourseOfferingsByDate(selectedDate);
        } else if (isMentor) {
            todayOfferings = courseOfferingService.getCourseOfferingsByDateAndMentor(selectedDate, userId);
        } else {
            todayOfferings = Collections.emptyList();
        }

        // 4) Build data maps
        Map<Integer, List<RDUser>> enrolledStudentsMap = new HashMap<>();
        Map<Integer, List<RDCourseSession>> courseSessionsMap = new HashMap<>();
        Map<Integer, Map<Integer, String>> attendanceStatusMap = new HashMap<>();
        Map<Integer, Map<Integer, Boolean>> trackingStatusMap = new HashMap<>();
        Map<Integer, Map<Integer, String>> trackingFeedbackMap = new HashMap<>();
        Map<Integer, Map<Integer, Integer>> trackingSessionMap = new HashMap<>();

        for (RDCourseOffering offering : todayOfferings) {
            int offeringId = offering.getCourseOfferingId();

            // Students (distinct)
            List<RDUser> students = userService.getEnrolledStudents(offeringId)
                    .stream().distinct().collect(Collectors.toList());
            enrolledStudentsMap.put(offeringId, students);

            // Sessions for this offering
            List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseOfferingId(offeringId);
            courseSessionsMap.put(offeringId, sessions);

            // Per-student attendance/track/feedback/session
            Map<Integer, String> studentAttendanceMap = new HashMap<>();
            Map<Integer, Boolean> studentTrackingMap   = new HashMap<>();
            Map<Integer, String> studentFeedbackMap    = new HashMap<>();
            Map<Integer, Integer> studentSessionMap    = new HashMap<>();

            for (RDUser student : students) {
                String status = attendanceService.getAttendanceStatusForStudent(offeringId, student.getUserID(), selectedDate);
                studentAttendanceMap.put(student.getUserID(), status != null ? status : "");

                Integer enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(offeringId, student.getUserID());
                RDCourseTracking tracking = (enrollmentId != null)
                        ? courseTrackingService.findByEnrollmentAndDate(enrollmentId, selectedDate)
                        : null;

                if (tracking != null) {
                    Integer sessionId = (tracking.getCourseSession() != null)
                            ? tracking.getCourseSession().getCourseSessionId()
                            : null;
                    studentTrackingMap.put(student.getUserID(), true);
                    studentFeedbackMap.put(student.getUserID(), tracking.getFeedback());
                    studentSessionMap.put(student.getUserID(), sessionId);
                } else {
                    studentTrackingMap.put(student.getUserID(), false);
                    studentFeedbackMap.put(student.getUserID(), "");
                    studentSessionMap.put(student.getUserID(), null);
                }
            }

            attendanceStatusMap.put(offeringId, studentAttendanceMap);
            trackingStatusMap.put(offeringId,   studentTrackingMap);
            trackingFeedbackMap.put(offeringId, studentFeedbackMap);
            trackingSessionMap.put(offeringId,  studentSessionMap);
        }

        // 5) Precompute selected session titles (JSP-friendly: no Streams)
        Map<Integer, Map<Integer, String>> sessionTitleByOffering = new HashMap<>();
        for (Map.Entry<Integer, List<RDCourseSession>> e : courseSessionsMap.entrySet()) {
            int offeringId = e.getKey();
            Map<Integer, String> m = new HashMap<>();
            for (RDCourseSession s : e.getValue()) {
                m.put(s.getCourseSessionId(), s.getSessionTitle());
            }
            sessionTitleByOffering.put(offeringId, m);
        }

        Map<Integer, Map<Integer, String>> selectedSessionTitleMap = new HashMap<>();
        for (RDCourseOffering offering : todayOfferings) {
            int offeringId = offering.getCourseOfferingId();
            Map<Integer, Integer> studSess = trackingSessionMap.getOrDefault(offeringId, Collections.emptyMap());
            Map<Integer, String>  titleMap = sessionTitleByOffering.getOrDefault(offeringId, Collections.emptyMap());

            Map<Integer, String> perStudent = new HashMap<>();
            for (RDUser student : enrolledStudentsMap.getOrDefault(offeringId, Collections.emptyList())) {
                Integer sid = studSess.get(student.getUserID());
                String title = (sid != null) ? titleMap.get(sid) : null;
                if (title == null || title.isBlank()) title = "No session selected";
                perStudent.put(student.getUserID(), title);
            }
            selectedSessionTitleMap.put(offeringId, perStudent);
        }

        // 6) Model
        model.addAttribute("todayOfferings", todayOfferings);
        model.addAttribute("enrolledStudentsMap", enrolledStudentsMap);
        model.addAttribute("courseSessionsMap", courseSessionsMap);
        model.addAttribute("attendanceStatusMap", attendanceStatusMap);
        model.addAttribute("trackingStatusMap", trackingStatusMap);
        model.addAttribute("trackingFeedbackMap", trackingFeedbackMap);
        model.addAttribute("trackingSessionMap", trackingSessionMap);
        model.addAttribute("selectedSessionTitleMap", selectedSessionTitleMap);

        // 7) Choose view
        if ("flat".equalsIgnoreCase(view)) {
            return "attendance-tracking-flat";
        }
        return "attendance-tracking";
    }

    /* ================== Calendar JSON (unchanged) ================== */

    @GetMapping("/attendance-tracking/calendar")
    @ResponseBody
    public List<Map<String, Object>> getCalendarEvents(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long mentorId,
            @RequestParam(required = false) String status) {

        List<RDCourseOffering> offerings = courseOfferingService.getFilteredOfferings(courseId, mentorId, status);

        List<Map<String, Object>> events = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        for (RDCourseOffering offering : offerings) {
            Map<String, Object> event = new HashMap<>();

            String mentorName = (offering.getInstructor() != null)
                    ? offering.getInstructor().getFirstName()
                    : "Unknown Mentor";

            String eventTitle = offering.getCourse().getCourseName() + " - " + mentorName;
            if (offering.getStatus() != null && !offering.getStatus().isEmpty()) {
                eventTitle += " (" + offering.getStatus() + ")";
            }

            event.put("id", offering.getCourseOfferingId());
            event.put("title", eventTitle);

            if (offering.getSessionStartTime() != null) {
                event.put("start", offering.getSessionStartTime().format(formatter));
            }
            if (offering.getSessionEndTime() != null) {
                event.put("end", offering.getSessionEndTime().format(formatter));
            }

            event.put("mentor", mentorName);
            event.put("courseId", offering.getCourse().getCourseId());
            event.put("status", offering.getStatus());

            events.add(event);
        }
        return events;
    }
}
