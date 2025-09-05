package com.robodynamics.controller;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.dto.RDAttendanceFlatRowDTO;
import com.robodynamics.model.*;
import com.robodynamics.service.*;

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
    @Autowired private RDCourseService courseService;
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDStudentEnrollmentService enrollmentService;
    @Autowired private RDUserService userService;
    @Autowired private RDCourseTrackingService courseTrackingService;
    @Autowired private RDTicketService ticketService;

    // Flat (existing) service
    @Autowired private RDAttendanceFlatService attendanceFlatService;

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
                    addParentTicketStats(session, model);
                    // NEW: feed child names for JSP badge/hidden input
                    session.setAttribute("childNamesCsv", getChildNamesCsv(authenticated.getUserID()));
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
    public String homeDashboard(Model model, HttpSession session) {
        addAdminTicketStats(session, model);
        return "dashboard";
    }

    private void addParentTicketStats(HttpSession session, Model model) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) return;

        Integer myId = me.getUserID();
        Map<String, Integer> stats = new HashMap<>();
        stats.put("open",        ticketService.countScoped("OPEN",        null, myId, null, false));
        stats.put("inProgress",  ticketService.countScoped("IN_PROGRESS", null, myId, null, false));
        stats.put("resolved",    ticketService.countScoped("RESOLVED",    null, myId, null, false));
        stats.put("closed",      ticketService.countScoped("CLOSED",      null, myId, null, false));

        model.addAttribute("ticketStatsParent", stats);
    }

    /* ================== Attendance & Tracking ================== */

    @GetMapping("/attendance-tracking-flat")
    public String attendanceTrackingFlat(@RequestParam Map<String, String> params,
                                         Model model, HttpSession session) {
        params.putIfAbsent("view", "flat");
        return buildAttendanceModel(params, model, session);
    }

    @GetMapping("/attendance-tracking")
    public String viewAttendanceTracking(@RequestParam Map<String, String> params,
                                         Model model, HttpSession session) {
        params.putIfAbsent("view", "accordion");
        return buildAttendanceModel(params, model, session);
    }

    private String buildAttendanceModel(Map<String, String> params, Model model, HttpSession session) {
        final String view   = val(params.get("view"), "accordion");
        final String range  = val(trimToNull(params.get("range")), "day");
        final String dateS  = trimToNull(params.get("date"));
        final String sS     = trimToNull(params.get("startDate"));
        final String eS     = trimToNull(params.get("endDate"));

        LocalDate base = parseDateOr(dateS, LocalDate.now());
        DateWindow window = computeWindow(range, base, sS, eS);

        model.addAttribute("selectedRange", range);
        model.addAttribute("selectedDateFormatted", window.base.toString());
        model.addAttribute("startDateFormatted", window.start.toString());
        model.addAttribute("endDateFormatted", window.end.toString());
        model.addAttribute("displayDateRange", humanRange(window.start, window.end));

        if ("flat".equalsIgnoreCase(view)) {
            // ---- FLAT VIEW with role scoping ----
            Integer offeringId   = null;
            Integer studentId    = null;
            String  studentLike  = lowerOrNull(params.get("student"));
            String  mentorLike   = lowerOrNull(params.get("mentor"));
            String  offeringLike = lowerOrNull(params.get("offering"));
            String  status       = trimToNull(params.get("status"));
            String  hasFeedback  = trimToNull(params.get("hasFeedback"));

            RDUser current = (RDUser) session.getAttribute("rdUser");
            Integer profileId = (current != null) ? current.getProfile_id() : null;
            Integer userId    = (current != null) ? current.getUserID()      : null;

            boolean isAdmin =
                    profileId != null && (
                        profileId == RDUser.profileType.SUPER_ADMIN.getValue()
                     || profileId == RDUser.profileType.ROBO_ADMIN.getValue()
                     || profileId == RDUser.profileType.ROBO_FINANCE_ADMIN.getValue()
                    );
            boolean isMentor = profileId != null && profileId == RDUser.profileType.ROBO_MENTOR.getValue();
            boolean isParent = profileId != null && profileId == RDUser.profileType.ROBO_PARENT.getValue();

            // For mentors/parents we ignore free-text to avoid bypassing scope
            if (isMentor) mentorLike = null;
            if (isParent) { mentorLike = null; studentLike = null; }

            String effectiveRange = "custom".equalsIgnoreCase(range)
                ? ((Math.abs(window.end.toEpochDay() - window.start.toEpochDay()) + 1) <= 7 ? "week" : "month")
                : range;

            List<RDAttendanceFlatRowDTO> rows = attendanceFlatService.findFlat(
                    effectiveRange, window.base,
                    offeringId, studentId, studentLike, mentorLike, offeringLike, status, hasFeedback
            );

            // ----- HARD SCOPE FILTERS (name-based, case-insensitive) -----
            if (isMentor && current != null) {
                final String myFull = (nz(current.getFirstName()) + " " + nz(current.getLastName())).trim().toLowerCase(Locale.ROOT);
                rows = rows.stream()
                        .filter(r -> {
                            String rn = nz(r.getMentorName()).trim().toLowerCase(Locale.ROOT);
                            return !rn.isEmpty() && rn.equals(myFull); // exact match
                        })
                        .collect(Collectors.toList());
            }

            if (isParent && current != null) {
                // Resolve child names once; use exact, case-insensitive match
                Set<String> childNames = getChildNamesSet(current.getUserID());
                if (!childNames.isEmpty()) {
                    rows = rows.stream()
                            .filter(r -> {
                                String sn = nz(r.getStudentName()).trim().toLowerCase(Locale.ROOT);
                                return childNames.contains(sn);
                            })
                            .collect(Collectors.toList());
                } else {
                    rows = Collections.emptyList();
                }
            }

            long expected = rows.size();
            long marked   = rows.stream().filter(r -> !"—".equals(r.getAttendanceOnDate())).count();
            long present  = rows.stream().filter(r -> "Present".equals(r.getAttendanceOnDate())).count();

            model.addAttribute("flatRows", rows);
            model.addAttribute("resultCount", rows.size());
            model.addAttribute("expectedCount", expected);
            model.addAttribute("markedCount", marked);
            model.addAttribute("presentCount", present);

            return "attendance-tracking-flat";
        } else {
            // ---- ACCORDION VIEW (existing) ----
            buildAccordionModel(window, params, model, session);
            return "attendance-tracking";
        }
    }

    /** Accordion-only data builder (unchanged from your version) */
    private void buildAccordionModel(DateWindow window, Map<String, String> params, Model model, HttpSession session) {
        RDUser current = (RDUser) session.getAttribute("rdUser");
        Integer profileId = (current != null) ? current.getProfile_id() : null;
        Integer userId    = (current != null) ? current.getUserID()      : null;

        boolean isAdmin =
                profileId != null &&
                (profileId == RDUser.profileType.SUPER_ADMIN.getValue()
              || profileId == RDUser.profileType.ROBO_ADMIN.getValue()
              || profileId == RDUser.profileType.ROBO_FINANCE_ADMIN.getValue());

        boolean isMentor = profileId != null && (profileId == RDUser.profileType.ROBO_MENTOR.getValue());

        String mentorQ   = lowerOrNull(params.get("mentor"));
        String offeringQ = lowerOrNull(params.get("offering"));
        String studentQ  = lowerOrNull(params.get("student"));
        String statusQ   = trimToNull(params.get("status"));
        String hasFbQ    = trimToNull(params.get("hasFeedback"));

        Map<Integer, RDCourseOffering> offeringById = new LinkedHashMap<>();
        for (LocalDate d : daysBetween(window.start, window.end)) {
            List<RDCourseOffering> dayOfferings =
                isAdmin ? safeList(courseOfferingService.getCourseOfferingsByDate(d)) :
                (isMentor ? safeList(courseOfferingService.getCourseOfferingsByDateAndMentor(d, userId))
                          : Collections.emptyList());
            for (RDCourseOffering o : dayOfferings) {
                if (o == null) continue;
                if (!matchesMentor(o, mentorQ)) continue;
                if (!matchesOffering(o, offeringQ)) continue;
                offeringById.putIfAbsent(o.getCourseOfferingId(), o);
            }
        }
        List<RDCourseOffering> offerings = new ArrayList<>(offeringById.values());
        offerings.sort(Comparator.comparing(
            (RDCourseOffering o) -> Optional.ofNullable(o.getSessionStartTime())
                                            .orElse(LocalTime.MIN)
        ));

        Map<Integer, List<RDUser>> enrolledStudentsMap = new HashMap<>();
        Map<Integer, List<RDCourseSession>> courseSessionsMap = new HashMap<>();
        Map<Integer, Map<Integer, String>> attendanceStatusMap = new HashMap<>();
        Map<Integer, Map<Integer, Boolean>> trackingStatusMap = new HashMap<>();
        Map<Integer, Map<Integer, String>> trackingFeedbackMap = new HashMap<>();
        Map<Integer, Map<Integer, Integer>> trackingSessionMap = new HashMap<>();
        int resultCount = 0;

        for (RDCourseOffering offering : offerings) {
            int offeringId = offering.getCourseOfferingId();

            List<RDCourseSession> sessions = safeList(
                courseSessionService.getCourseSessionsByCourseOfferingId(offeringId));
            courseSessionsMap.put(offeringId, sessions);

            List<RDUser> studentsAll = safeList(userService.getEnrolledStudents(offeringId))
                    .stream().filter(Objects::nonNull).distinct().collect(Collectors.toList());

            Map<Integer, String>  attMap  = new HashMap<>();
            Map<Integer, Boolean> trkMap  = new HashMap<>();
            Map<Integer, String>  fbMap   = new HashMap<>();
            Map<Integer, Integer> sessMap = new HashMap<>();
            List<RDUser> renderList = new ArrayList<>();

            for (RDUser stu : studentsAll) {
                int sid = stu.getUserID();

                if (studentQ != null) {
                    String full = (nz(stu.getFirstName()) + " " + nz(stu.getLastName())).toLowerCase(Locale.ROOT);
                    if (!full.contains(studentQ)) continue;
                }

                Integer enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(offeringId, sid);

                boolean presentAny = false;
                String latestFb = "";
                Integer latestSessId = null;
                LocalDate latestFbDate = null;

                for (LocalDate d : daysBetween(window.start, window.end)) {
                    String status = attendanceService.getAttendanceStatusForStudent(offeringId, sid, d);
                    if ("Present".equalsIgnoreCase(nz(status))) presentAny = true;

                    if (enrollmentId != null) {
                        RDCourseTracking tr = courseTrackingService.findByEnrollmentAndDate(enrollmentId, d);
                        if (tr != null) {
                            String fb = nz(tr.getFeedback());
                            if (!fb.isBlank() && (latestFbDate == null || d.isAfter(latestFbDate))) {
                                latestFbDate = d;
                                latestFb = fb;
                                latestSessId = (tr.getCourseSession() != null)
                                        ? tr.getCourseSession().getCourseSessionId()
                                        : null;
                            }
                        }
                    }
                }

                String finalStatus = presentAny ? "Present" : "Absent";
                boolean hasFb = !latestFb.isBlank();

                if (statusQ != null && !finalStatus.equalsIgnoreCase(statusQ)) continue;
                if (hasFbQ != null) {
                    boolean wantYes = "yes".equalsIgnoreCase(hasFbQ);
                    if (wantYes && !hasFb) continue;
                    if (!wantYes && hasFb) continue;
                }

                renderList.add(stu);
                attMap.put(sid, finalStatus);
                trkMap.put(sid, hasFb);
                fbMap.put(sid, latestFb);
                sessMap.put(sid, latestSessId);
            }

            enrolledStudentsMap.put(offeringId, renderList);
            attendanceStatusMap.put(offeringId, attMap);
            trackingStatusMap.put(offeringId, trkMap);
            trackingFeedbackMap.put(offeringId, fbMap);
            trackingSessionMap.put(offeringId, sessMap);
            resultCount += renderList.size();
        }

        model.addAttribute("todayOfferings", offerings);
        model.addAttribute("enrolledStudentsMap", enrolledStudentsMap);
        model.addAttribute("courseSessionsMap", courseSessionsMap);
        model.addAttribute("attendanceStatusMap", attendanceStatusMap);
        model.addAttribute("trackingStatusMap", trackingStatusMap);
        model.addAttribute("trackingFeedbackMap", trackingFeedbackMap);
        model.addAttribute("trackingSessionMap", trackingSessionMap);
        model.addAttribute("resultCount", resultCount);
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
        try { return LocalDate.parse(val); } catch (DateTimeParseException e) { return fallback; }
    }

    private static Iterable<LocalDate> daysBetween(LocalDate start, LocalDate endInclusive) {
        List<LocalDate> days = new ArrayList<>();
        LocalDate d = start;
        while (!d.isAfter(endInclusive)) { days.add(d); d = d.plusDays(1); }
        return days;
    }

    private static boolean matchesMentor(RDCourseOffering o, String qLower) {
        if (qLower == null) return true;
        try {
            String fn = (o.getInstructor() != null) ? nz(o.getInstructor().getFirstName()) : "";
            String ln = (o.getInstructor() != null) ? nz(o.getInstructor().getLastName())  : "";
            String full = (fn + " " + ln).trim().toLowerCase(Locale.ROOT);
            return full.contains(qLower);
        } catch (Exception e) { return false; }
    }

    private static boolean matchesOffering(RDCourseOffering o, String qLower) {
        if (qLower == null) return true;
        try {
            String name = nz(o.getCourseOfferingName()).toLowerCase(Locale.ROOT);
            String courseName = (o.getCourse() != null) ? nz(o.getCourse().getCourseName()).toLowerCase(Locale.ROOT) : "";
            return name.contains(qLower) || courseName.contains(qLower);
        } catch (Exception e) { return false; }
    }

    private static String humanRange(LocalDate start, LocalDate end) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy");
        if (start.equals(end)) return start.format(fmt);
        return start.format(fmt) + " — " + end.format(fmt);
    }

    private static class DateWindow {
        final String range;
        final LocalDate base;
        final LocalDate start;
        final LocalDate end;
        DateWindow(String range, LocalDate base, LocalDate start, LocalDate end) {
            this.range = range; this.base = base; this.start = start; this.end = end;
        }
    }

    private static DateWindow computeWindow(String range, LocalDate base, String startStr, String endStr) {
        range = (range == null) ? "day" : range.toLowerCase(Locale.ROOT);
        LocalDate start = base, end = base;

        switch (range) {
            case "week": {
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
                if (s != null && e != null && !e.isBefore(s)) { start = s; end = e; }
                else if (s != null) { start = s; end = s; }
                else if (e != null) { start = e; end = e; }
                break;
            }
            case "day":
            default: /* base/base */ break;
        }
        return new DateWindow(range, base, start, end);
    }

    private static LocalDate parseOrNull(String val) {
        if (val == null || val.isBlank()) return null;
        try { return LocalDate.parse(val); } catch (DateTimeParseException e) { return null; }
    }

    // ===== Parent scoping helpers =====

    /** Uses your existing service: getStudentEnrollmentByParent(int parentId) */
    private Set<Integer> getStudentIdsForParent(Integer parentUserId) {
        if (parentUserId == null) return Collections.emptySet();
        try {
            List<RDStudentEnrollment> enr = enrollmentService.getStudentEnrollmentByParent(parentUserId);
            if (enr == null) return Collections.emptySet();
            return enr.stream()
                      .map(e -> e.getStudent() != null ? e.getStudent().getUserID() : null)
                      .filter(Objects::nonNull)
                      .collect(Collectors.toCollection(LinkedHashSet::new));
        } catch (Exception ex) {
            log.warn("Failed to resolve studentIds for parent {}", parentUserId, ex);
            return Collections.emptySet();
        }
    }

    /** Returns case-insensitive set of child full names for name-based scoping. */
    private Set<String> getChildNamesSet(Integer parentUserId) {
        if (parentUserId == null) return Collections.emptySet();
        List<RDStudentEnrollment> enr = enrollmentService.getStudentEnrollmentByParent(parentUserId);
        if (enr == null) return Collections.emptySet();
        return enr.stream()
                  .map(RDStudentEnrollment::getStudent)
                  .filter(Objects::nonNull)
                  .map(u -> (nz(u.getFirstName()) + " " + nz(u.getLastName())).trim().toLowerCase(Locale.ROOT))
                  .filter(s -> !s.isBlank())
                  .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    /** Populates a readable CSV for the parent badge. */
    private String getChildNamesCsv(Integer parentUserId) {
        if (parentUserId == null) return "";
        List<RDStudentEnrollment> enr = enrollmentService.getStudentEnrollmentByParent(parentUserId);
        if (enr == null) return "";
        return enr.stream()
                  .map(RDStudentEnrollment::getStudent)
                  .filter(Objects::nonNull)
                  .map(u -> (nz(u.getFirstName()) + " " + nz(u.getLastName())).trim())
                  .filter(s -> !s.isBlank())
                  .distinct()
                  .collect(Collectors.joining(", "));
    }

    // ===== Admin ticket stats helper (unchanged from your version) =====
    private void addAdminTicketStats(HttpSession session, Model model) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) return;
        int pid = me.getProfile_id();
        boolean isAdmin =
            pid == RDUser.profileType.SUPER_ADMIN.getValue()
         || pid == RDUser.profileType.ROBO_ADMIN.getValue()
         || pid == RDUser.profileType.ROBO_FINANCE_ADMIN.getValue();

        if (!isAdmin) return;

        Map<String, Integer> ticketStats = new HashMap<>();
        ticketStats.put("open",        ticketService.countScoped("OPEN",        null, null, null, false));
        ticketStats.put("inProgress",  ticketService.countScoped("IN_PROGRESS", null, null, null, false));
        ticketStats.put("resolved",    ticketService.countScoped("RESOLVED",    null, null, null, false));
        ticketStats.put("closed",      ticketService.countScoped("CLOSED",      null, null, null, false));

        model.addAttribute("ticketStats", ticketStats);
    }
}
