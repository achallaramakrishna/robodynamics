package com.robodynamics.controller;

import com.robodynamics.dto.CalendarEventDTO;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDStudentEnrollmentService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/admin/api/calendar")
public class RDCalendarController {

    private final RDCourseOfferingService offeringService;
    private final RDStudentEnrollmentService enrollmentService;

    /** 
     * If your DB stores DATE columns at midnight UTC, keeping this true prevents
     * a previous-day shift when converting to LocalDate in IST.
     * If your DB stores DATE in local server time, set this to false.
     */
    private static final boolean USE_UTC_FOR_DATE_COLUMNS = true;

    public RDCalendarController(RDCourseOfferingService offeringService,
                                RDStudentEnrollmentService enrollmentService) {
        this.offeringService = offeringService;
        this.enrollmentService = enrollmentService;
    }

    // -------------------- Public Endpoints --------------------

    // Admin feed
    @GetMapping("/events")
    public List<CalendarEventDTO> adminEvents(
            @RequestParam("start") String startStr,
            @RequestParam("end")   String endStr) {

        ZonedDateTime start = parseCalParam(startStr);
        ZonedDateTime endExcl = parseCalParam(endStr); // FullCalendar end is exclusive

        LocalDate from = start.toLocalDate();
        LocalDate toIncl = endExcl.minusNanos(1).toLocalDate();

        log("ADMIN REQ", "from=%s toIncl=%s rawStart=%s rawEnd=%s", from, toIncl, startStr, endStr);

        List<CalendarEventDTO> out = buildEventsByOffering(null, from, toIncl);
        log("ADMIN OUT", "events=%d", out.size());
        return out;
    }

    // Mentor feed (scoped by mentor)
    @GetMapping("/mentor/events")
    public List<CalendarEventDTO> mentorEvents(
            @RequestParam("start") String startStr,
            @RequestParam("end")   String endStr,
            HttpSession session) {

        Integer mentorId = currentUserId(session);

        ZonedDateTime start = parseCalParam(startStr);
        ZonedDateTime endExcl = parseCalParam(endStr);
        LocalDate from = start.toLocalDate();
        LocalDate toIncl = endExcl.minusNanos(1).toLocalDate();

        log("MENTOR REQ", "mentorId=%s from=%s toIncl=%s rawStart=%s rawEnd=%s",
                mentorId, from, toIncl, startStr, endStr);

        List<CalendarEventDTO> out = buildEventsByOffering(mentorId, from, toIncl);
        log("MENTOR OUT", "events=%d", out.size());
        return out;
    }

    // -------------------- Core Builder (by offering) --------------------

    // Generates events *without* RDClassSession, expanding offering days
    private List<CalendarEventDTO> buildEventsByOffering(Integer mentorId, LocalDate since, LocalDate toIncl) {

        final List<RDCourseOffering> offerings = (mentorId == null)
                ? offeringService.getOfferingsIntersecting(since, toIncl)
                : offeringService.getOfferingsForMentorIntersecting(mentorId, since, toIncl);

        if (offerings == null || offerings.isEmpty()) {
            log("BUILD", "no offerings in window %s..%s (mentorId=%s)", since, toIncl, mentorId);
            return Collections.emptyList();
        }

        log("BUILD", "offerings.size=%d", offerings.size());

        List<CalendarEventDTO> out = new ArrayList<>();

        for (RDCourseOffering off : offerings) {
            if (off == null) continue;

            LocalDate offStart = toLocalDate(off.getStartDate());
            LocalDate offEnd   = toLocalDate(off.getEndDate());

            // Intersection: [since..toIncl] ∩ [offStart..offEnd]
            LocalDate effFrom = (offStart == null || since.isAfter(offStart)) ? since : offStart;
            LocalDate effTo   = (offEnd   == null || offEnd.isAfter(toIncl))  ? toIncl : offEnd;

            log("OFF",
                    "id=%s name=%s offWin=%s..%s eff=%s..%s days='%s' startTime=%s endTime=%s",
                    safeId(off.getCourseOfferingId()),
                    nz(off.getCourseOfferingName()),
                    offStart, offEnd, effFrom, effTo,
                    nz(off.getDaysOfWeek()),
                    off.getSessionStartTime(), off.getSessionEndTime()
            );

            if (effFrom.isAfter(effTo)) {
                log("OFF", "skip (no overlap) id=%s", safeId(off.getCourseOfferingId()));
                continue;
            }

            // Days-of-week
            EnumSet<DayOfWeek> activeDays = parseDaysOfWeek(off.getDaysOfWeek());
            if (activeDays.isEmpty()) {
                // Fallback to everyday if not configured
                activeDays = EnumSet.allOf(DayOfWeek.class);
            }

            // Times with safe defaults
            LocalTime startTime = safeStartTime(off.getSessionStartTime());
            LocalTime endTime   = safeEndTime(startTime, off.getSessionEndTime());

            // Enrollment count (non-fatal on error)
            int enrolled = 0;
            try { enrolled = enrollmentService.countEnrollments(off.getCourseOfferingId()); } catch (Exception ignore) {}

            int before = out.size();

            // Expand dates
            for (LocalDate d = effFrom; !d.isAfter(effTo); d = d.plusDays(1)) {
                if (!activeDays.contains(d.getDayOfWeek())) continue;

                LocalDateTime startTs = d.atTime(startTime);
                LocalDateTime endTs   = d.atTime(endTime);
                if (!endTs.isAfter(startTs)) {
                    // Guard against invalid end <= start
                    endTs = startTs.plusMinutes(60);
                }

                CalendarEventDTO e = new CalendarEventDTO();
                e.setId("O-" + off.getCourseOfferingId() + "-" + d);
                e.setTitle(off.getCourseOfferingName());

                // If DTO is String-based for start/end, use ISO-8601 (no zone)
                e.setStart(startTs.toString());
                e.setEnd(endTs.toString());

                // Extended props
                e.setOfferingId(off.getCourseOfferingId());
                e.setOfferingName(off.getCourseOfferingName());
                if (off.getCourse() != null) {
                    e.setCourseId(off.getCourse().getCourseId());
                    e.setCourseName(off.getCourse().getCourseName());
                }
                if (off.getInstructor() != null) {
                    e.setMentorId(off.getInstructor().getUserID());
                    String fn = nz(off.getInstructor().getFirstName());
                    String ln = nz(off.getInstructor().getLastName());
                    e.setMentorName((fn + " " + ln).trim());
                }
                e.setStudentsCount(enrolled);

                out.add(e);
            }

            log("OFF", "expanded=%d id=%s", (out.size() - before), safeId(off.getCourseOfferingId()));
        }

        log("BUILD", "total events=%d", out.size());
        return out;
    }

    // -------------------- Helpers --------------------

    /** Robust DATE→LocalDate conversion with sql.Date optimization and UTC option to avoid TZ drift */
    private LocalDate toLocalDate(java.util.Date d) {
        if (d == null) return null;
        if (d instanceof java.sql.Date) {
            // sql.Date is a date-only type; this is the safest (no TZ shift)
            return ((java.sql.Date) d).toLocalDate();
        }
        // For util.Date from DATE columns, prefer UTC to avoid previous-day shift in IST
        ZoneId zone = USE_UTC_FOR_DATE_COLUMNS ? ZoneOffset.UTC : ZoneId.systemDefault();
        return d.toInstant().atZone(zone).toLocalDate();
    }

    private static LocalTime safeStartTime(LocalTime t) {
        return (t != null) ? t : LocalTime.of(9, 0);
    }

    private static LocalTime safeEndTime(LocalTime start, LocalTime end) {
        if (end != null && (start == null || end.isAfter(start))) return end;
        LocalTime s = (start != null) ? start : LocalTime.of(9, 0);
        return s.plusMinutes(60);
    }

    private static final Map<String, DayOfWeek> DOW = new HashMap<>();
    static {
        DOW.put("MON", DayOfWeek.MONDAY);     DOW.put("MONDAY", DayOfWeek.MONDAY);
        DOW.put("TUE", DayOfWeek.TUESDAY);    DOW.put("TUESDAY", DayOfWeek.TUESDAY);
        DOW.put("WED", DayOfWeek.WEDNESDAY);  DOW.put("WEDNESDAY", DayOfWeek.WEDNESDAY);
        DOW.put("THU", DayOfWeek.THURSDAY);   DOW.put("THURSDAY", DayOfWeek.THURSDAY);
        DOW.put("FRI", DayOfWeek.FRIDAY);     DOW.put("FRIDAY", DayOfWeek.FRIDAY);
        DOW.put("SAT", DayOfWeek.SATURDAY);   DOW.put("SATURDAY", DayOfWeek.SATURDAY);
        DOW.put("SUN", DayOfWeek.SUNDAY);     DOW.put("SUNDAY", DayOfWeek.SUNDAY);
    }

    private static EnumSet<DayOfWeek> parseDaysOfWeek(String s) {
        if (s == null || s.isBlank()) return EnumSet.noneOf(DayOfWeek.class);
        String norm = s.replaceAll("[^A-Za-z,|/ ]", " ").toUpperCase(Locale.ENGLISH);
        String[] parts = norm.split("[,|/\\s]+");
        EnumSet<DayOfWeek> out = EnumSet.noneOf(DayOfWeek.class);
        for (String p : parts) {
            DayOfWeek d = DOW.get(p.trim());
            if (d != null) out.add(d);
        }
        return out;
    }

    private ZonedDateTime parseCalParam(String raw) {
        try { return OffsetDateTime.parse(raw, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toZonedDateTime(); } catch (Exception ignore) {}
        try { return ZonedDateTime.parse(raw, DateTimeFormatter.ISO_ZONED_DATE_TIME); } catch (Exception ignore) {}
        try { return LocalDateTime.parse(raw, DateTimeFormatter.ISO_LOCAL_DATE_TIME).atZone(ZoneId.systemDefault()); } catch (Exception ignore) {}
        try { return LocalDate.parse(raw, DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay(ZoneId.systemDefault()); } catch (Exception ignore) {}
        return ZonedDateTime.now(ZoneId.systemDefault());
    }

    private Integer currentUserId(HttpSession session) {
        Object o = session.getAttribute("rdUser");
        if (o instanceof RDUser) return ((RDUser) o).getUserID();
        return (Integer) session.getAttribute("loggedInUserId");
    }

    private static String nz(String s) { return (s == null) ? "" : s; }
    private static String safeId(Object o) { return (o == null) ? "-" : o.toString(); }
    private static void log(String tag, String fmt, Object... args) {
        System.out.println("[" + tag + "] " + String.format(fmt, args));
    }
}
