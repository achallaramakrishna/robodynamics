package com.robodynamics.controller;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
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

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class RDUserController {

    private static final Logger log = LoggerFactory.getLogger(RDUserController.class);

    @Autowired private RDCourseOfferingService courseOfferingService;
    @Autowired private RDClassAttendanceService attendanceService;
    @Autowired private RDCourseTrackingService trackingService;       // if used elsewhere
    @Autowired private RDCourseService courseService;                  // if used elsewhere
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDStudentEnrollmentService enrollmentService;
    @Autowired private RDUserService userService;
    @Autowired private RDCourseTrackingService courseTrackingService;

    /* ================== Unchanged auth / user endpoints ================== */

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
     * Flat view shortcut, accepts the same filters as the main view.
     */
    @GetMapping("/attendance-tracking-flat")
    public String attendanceTrackingFlat(
            @RequestParam Map<String, String> params,
            Model model, HttpSession session) {
        params.putIfAbsent("view", "flat");
        return buildAttendanceModel(params, model, session);
    }

    /**
     * Main attendance endpoint. Pass view=accordion (default) or view=flat.
     */
    @GetMapping("/attendance-tracking")
    public String viewAttendanceTracking(
            @RequestParam Map<String, String> params,
            Model model, HttpSession session) {
        params.putIfAbsent("view", "accordion");
        return buildAttendanceModel(params, model, session);
    }

    /**
     * Core builder that reads all filters, computes the date window, aggregates data,
     * applies filters (mentor/offering/student/status/hasFeedback), and fills the model.
     *
     * Status semantics across a range:
     *   - "Present" if student was present on ANY day in the window, else "Absent".
     * Has feedback semantics:
     *   - "yes" if ANY non-empty feedback exists in the window, else "no".
     * Session title shown:
     *   - The latest (by date) selected session within the window; "No session selected" if none.
     */
    private String buildAttendanceModel(Map<String, String> params, Model model, HttpSession session) {
        final String view = val(params.get("view"), "accordion");

        // -------- Parse range & dates (all optional) --------
        final String rangeParam     = trimToNull(params.get("range"));         // day|week|month|custom
        final String dateParam      = trimToNull(params.get("date"));          // yyyy-MM-dd
        final String startDateParam = trimToNull(params.get("startDate"));     // yyyy-MM-dd
        final String endDateParam   = trimToNull(params.get("endDate"));       // yyyy-MM-dd

        LocalDate baseDate = parseDateOr(dateParam, LocalDate.now());
        DateWindow window = computeWindow(val(rangeParam, "day"), baseDate, startDateParam, endDateParam);

        // UI echo
        DateTimeFormatter iso = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        model.addAttribute("selectedRange", window.range);
        model.addAttribute("selectedDateFormatted", window.base.format(iso));
        model.addAttribute("startDateFormatted", window.start.format(iso));
        model.addAttribute("endDateFormatted", window.end.format(iso));
        model.addAttribute("displayDateRange", humanRange(window.start, window.end));

        // -------- Parse text filters (optional) --------
        final String mentorQ   = lowerOrNull(params.get("mentor"));
        final String offeringQ = lowerOrNull(params.get("offering"));
        final String studentQ  = lowerOrNull(params.get("student"));
        final String statusQ   = trimToNull(params.get("status"));       // "Present" | "Absent" | null
        final String hasFbQ    = trimToNull(params.get("hasFeedback"));  // "yes" | "no" | null

        // -------- Who am I? --------
        RDUser current = (RDUser) session.getAttribute("rdUser");
        Integer profileId = (current != null) ? current.getProfile_id() : null;
        Integer userId    = (current != null) ? current.getUserID()      : null;

        boolean isAdmin =
                profileId != null &&
                (profileId == RDUser.profileType.SUPER_ADMIN.getValue()
              || profileId == RDUser.profileType.ROBO_ADMIN.getValue()
              || profileId == RDUser.profileType.ROBO_FINANCE_ADMIN.getValue());

        boolean isMentor = profileId != null && (profileId == RDUser.profileType.ROBO_MENTOR.getValue());

        // -------- Fetch offerings in the date window (dedup by ID) --------
        Map<Integer, RDCourseOffering> offeringById = new LinkedHashMap<>();
        for (LocalDate d : daysBetween(window.start, window.end)) {
            List<RDCourseOffering> dayOfferings;
            if (isAdmin) {
                dayOfferings = safeList(courseOfferingService.getCourseOfferingsByDate(d));
            } else if (isMentor) {
                dayOfferings = safeList(courseOfferingService.getCourseOfferingsByDateAndMentor(d, userId));
            } else {
                dayOfferings = Collections.emptyList();
            }
            for (RDCourseOffering o : dayOfferings) {
                if (o == null) continue;
                // Apply mentor/offering text filters early (optional)
                if (!matchesMentor(o, mentorQ)) continue;
                if (!matchesOffering(o, offeringQ)) continue;
                offeringById.putIfAbsent(o.getCourseOfferingId(), o);
            }
        }
        List<RDCourseOffering> offerings = new ArrayList<>(offeringById.values());

        // -------- Prepare model maps expected by JSP --------
        Map<Integer, List<RDUser>> enrolledStudentsMap = new HashMap<>();
        Map<Integer, List<RDCourseSession>> courseSessionsMap = new HashMap<>();
        Map<Integer, Map<Integer, String>> attendanceStatusMap = new HashMap<>();
        Map<Integer, Map<Integer, Boolean>> trackingStatusMap = new HashMap<>();
        Map<Integer, Map<Integer, String>> trackingFeedbackMap = new HashMap<>();
        Map<Integer, Map<Integer, Integer>> trackingSessionMap = new HashMap<>();

        int resultCount = 0; // number of rendered student rows

        // -------- Build per-offering data --------
        for (RDCourseOffering offering : offerings) {
            int offeringId = offering.getCourseOfferingId();

            // Sessions for this offering (for title lookup later)
            List<RDCourseSession> sessions = safeList(courseSessionService.getCourseSessionsByCourseOfferingId(offeringId));
            courseSessionsMap.put(offeringId, sessions);

            // Students (distinct), apply optional student text filter later (and status/hasFeedback after aggregation)
            List<RDUser> studentsAll = safeList(userService.getEnrolledStudents(offeringId)).stream()
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            // Prepare per-student maps
            Map<Integer, String>  studentAttendanceMap = new HashMap<>();
            Map<Integer, Boolean> studentTrackingMap   = new HashMap<>();
            Map<Integer, String>  studentFeedbackMap   = new HashMap<>();
            Map<Integer, Integer> studentSessionMap    = new HashMap<>();
            List<RDUser>          studentsToRender     = new ArrayList<>();

            // Aggregate across window
            for (RDUser student : studentsAll) {
                if (student == null) continue;
                int sid = student.getUserID();

                // Optional student name filter (substring on "first last")
                if (studentQ != null) {
                    String full = (nz(student.getFirstName()) + " " + nz(student.getLastName())).toLowerCase(Locale.ROOT);
                    if (!full.contains(studentQ)) {
                        continue; // skip early
                    }
                }

                Integer enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(offeringId, sid);

                boolean presentAny = false;
                String  latestFeedback = "";
                Integer latestSessionId = null;
                LocalDate latestFbDate = null;

                for (LocalDate d : daysBetween(window.start, window.end)) {
                    try {
                        // Attendance
                        String status = attendanceService.getAttendanceStatusForStudent(offeringId, sid, d);
                        if ("Present".equalsIgnoreCase(nz(status))) {
                            presentAny = true;
                        }

                        // Tracking / feedback
                        if (enrollmentId != null) {
                            RDCourseTracking tr = courseTrackingService.findByEnrollmentAndDate(enrollmentId, d);
                            if (tr != null) {
                                String fb = nz(tr.getFeedback());
                                if (!fb.isBlank()) {
                                    if (latestFbDate == null || d.isAfter(latestFbDate)) {
                                        latestFbDate = d;
                                        latestFeedback = fb;
                                        latestSessionId = (tr.getCourseSession() != null) ? tr.getCourseSession().getCourseSessionId() : null;
                                    }
                                }
                            }
                        }
                    } catch (Exception ex) {
                        // Defensive: continue for that day if any lookup fails
                        log.debug("Aggregate fail offeringId={}, sid={}, date={}", offeringId, sid, d, ex);
                    }
                }

                String finalStatus = presentAny ? "Present" : "Absent";
                boolean hasFb = !latestFeedback.isBlank();

                // Optional filters: status, hasFeedback
                if (statusQ != null) {
                    if (!finalStatus.equalsIgnoreCase(statusQ)) {
                        continue; // skip this student row
                    }
                }
                if (hasFbQ != null) {
                    boolean wantYes = "yes".equalsIgnoreCase(hasFbQ);
                    if (wantYes && !hasFb) continue;
                    if (!wantYes && hasFb) continue;
                }

                // Keep student for rendering and populate maps
                studentsToRender.add(student);
                studentAttendanceMap.put(sid, finalStatus);
                studentTrackingMap.put(sid, hasFb);
                studentFeedbackMap.put(sid, latestFeedback);       // may be ""
                studentSessionMap.put(sid, latestSessionId);       // may be null
            }

            if (!studentsToRender.isEmpty()) {
                enrolledStudentsMap.put(offeringId, studentsToRender);
                attendanceStatusMap.put(offeringId, studentAttendanceMap);
                trackingStatusMap.put(offeringId,   studentTrackingMap);
                trackingFeedbackMap.put(offeringId, studentFeedbackMap);
                trackingSessionMap.put(offeringId,  studentSessionMap);
                resultCount += studentsToRender.size();
            } else {
                // still expose sessions map for completeness; students/other maps omitted to avoid empty table rows
                enrolledStudentsMap.put(offeringId, Collections.emptyList());
            }
        }

        // -------- Translate session ids -> titles for JSP badge --------
        Map<Integer, Map<Integer, String>> sessionTitleByOffering = new HashMap<>();
        for (Map.Entry<Integer, List<RDCourseSession>> e : courseSessionsMap.entrySet()) {
            int offeringId = e.getKey();
            Map<Integer, String> m = new HashMap<>();
            for (RDCourseSession s : e.getValue()) {
                if (s != null) m.put(s.getCourseSessionId(), nz(s.getSessionTitle()));
            }
            sessionTitleByOffering.put(offeringId, m);
        }

        Map<Integer, Map<Integer, String>> selectedSessionTitleMap = new HashMap<>();
        for (RDCourseOffering offering : offerings) {
            int offeringId = offering.getCourseOfferingId();

            Map<Integer, Integer> studSess = trackingSessionMap.getOrDefault(offeringId, Collections.emptyMap());
            Map<Integer, String>  titleMap = sessionTitleByOffering.getOrDefault(offeringId, Collections.emptyMap());

            Map<Integer, String> perStudent = new HashMap<>();
            for (RDUser student : enrolledStudentsMap.getOrDefault(offeringId, Collections.emptyList())) {
                int sid = student.getUserID();
                Integer sessId = studSess.get(sid);
                String title = (sessId != null) ? titleMap.get(sessId) : null;
                if (title == null || title.isBlank()) title = "No session selected";
                perStudent.put(sid, title);
            }
            selectedSessionTitleMap.put(offeringId, perStudent);
        }

        // -------- Put into model --------
        model.addAttribute("todayOfferings", offerings); // same variable name your JSP expects
        model.addAttribute("enrolledStudentsMap", enrolledStudentsMap);
        model.addAttribute("courseSessionsMap", courseSessionsMap);
        model.addAttribute("attendanceStatusMap", attendanceStatusMap);
        model.addAttribute("trackingStatusMap", trackingStatusMap);
        model.addAttribute("trackingFeedbackMap", trackingFeedbackMap);
        model.addAttribute("trackingSessionMap", trackingSessionMap);
        model.addAttribute("selectedSessionTitleMap", selectedSessionTitleMap);
        model.addAttribute("resultCount", resultCount);

        // Choose view
        return "flat".equalsIgnoreCase(view) ? "attendance-tracking-flat" : "attendance-tracking";
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

    /* ================== Helpers ================== */

    private static String val(String v, String d) { return (v == null || v.isBlank()) ? d : v; }
    private static String nz(String v) { return v == null ? "" : v; }
    private static String lowerOrNull(String v) {
        if (v == null) return null;
        String t = v.trim();
        return t.isEmpty() ? null : t.toLowerCase(Locale.ROOT);
    }
    private static String trimToNull(String v) {
        if (v == null) return null;
        String t = v.trim();
        return t.isEmpty() ? null : t;
    }
    private static <T> List<T> safeList(List<T> list) { return list == null ? Collections.emptyList() : list; }

    private static LocalDate parseDateOr(String val, LocalDate fallback) {
        if (val == null) return fallback;
        try {
            return LocalDate.parse(val);
        } catch (DateTimeParseException e) {
            return fallback;
        }
    }

    private static Iterable<LocalDate> daysBetween(LocalDate start, LocalDate endInclusive) {
        List<LocalDate> days = new ArrayList<>();
        LocalDate d = start;
        while (!d.isAfter(endInclusive)) {
            days.add(d);
            d = d.plusDays(1);
        }
        return days;
    }

    private static boolean matchesMentor(RDCourseOffering o, String qLower) {
        if (qLower == null) return true;
        try {
            String fn = (o.getInstructor() != null) ? nz(o.getInstructor().getFirstName()) : "";
            String ln = (o.getInstructor() != null) ? nz(o.getInstructor().getLastName())  : "";
            String full = (fn + " " + ln).trim().toLowerCase(Locale.ROOT);
            return full.contains(qLower);
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean matchesOffering(RDCourseOffering o, String qLower) {
        if (qLower == null) return true;
        try {
            String name = nz(o.getCourseOfferingName()).toLowerCase(Locale.ROOT);
            String courseName = (o.getCourse() != null) ? nz(o.getCourse().getCourseName()).toLowerCase(Locale.ROOT) : "";
            return name.contains(qLower) || courseName.contains(qLower);
        } catch (Exception e) {
            return false;
        }
    }

    private static String humanRange(LocalDate start, LocalDate end) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");
        if (start.equals(end)) return start.format(fmt);
        return start.format(fmt) + " — " + end.format(fmt);
    }

    private static class DateWindow {
        final String range;     // day|week|month|custom (sanitized)
        final LocalDate base;   // base date (dateParam or today)
        final LocalDate start;  // inclusive
        final LocalDate end;    // inclusive
        DateWindow(String range, LocalDate base, LocalDate start, LocalDate end) {
            this.range = range; this.base = base; this.start = start; this.end = end;
        }
    }

    private static DateWindow computeWindow(String range, LocalDate base, String startStr, String endStr) {
        range = (range == null) ? "day" : range.toLowerCase(Locale.ROOT);
        LocalDate start = base, end = base;

        switch (range) {
            case "week": {
                // Monday–Sunday window around base
                DayOfWeek first = DayOfWeek.MONDAY;
                start = base.with(TemporalAdjusters.previousOrSame(first));
                end   = start.plusDays(6);
                break;
            }
            case "month": {
                start = base.with(TemporalAdjusters.firstDayOfMonth());
                end   = base.with(TemporalAdjusters.lastDayOfMonth());
                break;
            }
            case "custom": {
                LocalDate s = parseOrNull(startStr);
                LocalDate e = parseOrNull(endStr);
                if (s != null && e != null && !e.isBefore(s)) {
                    start = s; end = e;
                } else if (s != null && e == null) {
                    start = s; end = s;
                } else if (s == null && e != null) {
                    start = e; end = e;
                } // else keep base/base
                break;
            }
            case "day":
            default:
                // start=end=base already set
                range = "day";
        }
        return new DateWindow(range, base, start, end);
    }

    private static LocalDate parseOrNull(String val) {
        if (val == null || val.isBlank()) return null;
        try { return LocalDate.parse(val); } catch (DateTimeParseException e) { return null; }
    }
}
