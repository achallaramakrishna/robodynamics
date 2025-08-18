package com.robodynamics.service.impl;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import java.time.DayOfWeek;
import java.util.*;
import com.robodynamics.dto.RDDataQualityReportDTO;
import com.robodynamics.dto.RDDataQualityRowDTO;
import com.robodynamics.dto.RDSessionDetailStat;
import com.robodynamics.model.RDCourseOffering;
import static java.util.Objects.equals;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDDataQualityDao;
import com.robodynamics.dto.RDDataQualityReportDTO;
import com.robodynamics.dto.RDDataQualityRowDTO;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDDataQualityService;

@Service
@Transactional
public class RDDataQualityServiceImpl implements RDDataQualityService {

    private final RDCourseOfferingService courseOfferingService;
    private final RDDataQualityDao dataQualityDao;

    // Tune as needed
    private static final int MIN_DETAILS_PER_SESSION = 10;

    public RDDataQualityServiceImpl(RDCourseOfferingService courseOfferingService,
                                    RDDataQualityDao dataQualityDao) {
        this.courseOfferingService = courseOfferingService;
        this.dataQualityDao = dataQualityDao;
    }

    
    @Override
    public RDDataQualityReportDTO computeForDate(LocalDate date) {
        RDDataQualityReportDTO out = RDDataQualityReportDTO.now();
        List<RDCourseOffering> offerings = courseOfferingService.getCourseOfferingsByDate(date);

        int ruleCount = 0;
        for (RDCourseOffering o : offerings) {
            int offeringId = o.getCourseOfferingId();
            String label = "Offering #" + offeringId;
            String name  = o.getCourseOfferingName();

            // Counts via DAO
            int sessionsPlanned   = dataQualityDao.countSessions(offeringId);
            int sessionsToDate    = dataQualityDao.countSessionsUpToDate(offeringId, date);
            int sessionDetails    = dataQualityDao.countSessionDetails(offeringId);
            int activeEnrollments = dataQualityDao.countActiveEnrollments(offeringId);
            int attendanceToDate  = dataQualityDao.countAttendanceUpToDate(offeringId, date);
            int trackingToDate    = dataQualityDao.countTrackingUpToDate(offeringId, date);

            // O1
            out.addRow(row(label, name, "offering", offeringId, "O1", "Offering has course sessions scheduled",
                    1, sessionsPlanned, Math.max(0, 1 - Math.min(1, sessionsPlanned)), pct(sessionsPlanned, 1),
                    sessionsPlanned > 0, "/admin/offerings/" + offeringId + "/sessions"));
            ruleCount++;

            // O2
            int expectedDetails = sessionsPlanned * MIN_DETAILS_PER_SESSION;
            out.addRow(row(label, name, "offering", offeringId, "O2", "Session details sufficiency",
                    expectedDetails, sessionDetails, Math.max(0, expectedDetails - sessionDetails),
                    pct(sessionDetails, expectedDetails), sessionDetails >= expectedDetails,
                    "/admin/offerings/" + offeringId + "/sessions/details"));
            ruleCount++;

            // O3
            boolean mentorOk = (o.getInstructor() != null);
            out.addRow(row(label, name, "offering", offeringId, "O3", "Mentor assigned",
                    1, mentorOk ? 1 : 0, mentorOk ? 0 : 1, mentorOk ? 100.0 : 0.0, mentorOk,
                    "/admin/offerings/" + offeringId + "/edit"));
            ruleCount++;

            // O4
            int expectedAttendance = activeEnrollments * sessionsToDate;
            out.addRow(row(label, name, "offering", offeringId, "O4", "Attendance completeness (to date)",
                    expectedAttendance, attendanceToDate,
                    Math.max(0, expectedAttendance - attendanceToDate),
                    pct(attendanceToDate, expectedAttendance),
                    expectedAttendance == 0 || attendanceToDate >= expectedAttendance,
                    "/admin/offerings/" + offeringId + "/attendance"));
            ruleCount++;

            // O5
            int expectedTracking = activeEnrollments * sessionsToDate;
            out.addRow(row(label, name, "offering", offeringId, "O5", "Tracking completeness (to date)",
                    expectedTracking, trackingToDate,
                    Math.max(0, expectedTracking - trackingToDate),
                    pct(trackingToDate, expectedTracking),
                    expectedTracking == 0 || trackingToDate >= expectedTracking,
                    "/admin/offerings/" + offeringId + "/tracking"));
            ruleCount++;
        }

        out.setSummary(String.format("%d rules checked across %d offerings.", ruleCount, offerings.size()));
        return out;
    }

    @Override
    public RDDataQualityReportDTO computeForOffering(Integer offeringId, LocalDate date) {
        RDDataQualityReportDTO out = RDDataQualityReportDTO.now();

        RDCourseOffering o = dataQualityDao.getOfferingWithJoins(offeringId);
        if (o == null) {
            out.setSummary("No such offering: " + offeringId);
            return out;
        }

        // Reuse the date-wide computation and filter for the single offering
        computeForDate(date).getRows().stream()
            .filter(r -> "offering".equals(r.getScopeType()) && offeringId.equals(r.getScopeId()))
            .forEach(out::addRow);

        out.setSummary("Rules checked for offering #" + offeringId);
        return out;
    }

    @Override
    public RDDataQualityReportDTO computeForCourse(Integer courseId, LocalDate date) {
        RDDataQualityReportDTO out = RDDataQualityReportDTO.now();
        List<RDCourseOffering> offerings = dataQualityDao.getOfferingsByCourseAndDate(courseId, date);

        if (offerings.isEmpty()) {
            out.setSummary("No active offerings for course #" + courseId + " on " + date);
            return out;
        }

        RDDataQualityReportDTO all = computeForDate(date);
        all.getRows().stream()
           .filter(r -> "offering".equals(r.getScopeType())
                     && offerings.stream().anyMatch(o -> r.getScopeId() != null && r.getScopeId().intValue() == o.getCourseOfferingId()))
           .forEach(out::addRow);

        out.setSummary(String.format("Rules checked for course #%d across %d offerings.", courseId, offerings.size()));
        return out;
    }

    /* ---------- Helpers ---------- */

    private RDDataQualityRowDTO row(String label, String name, String scopeType, Integer scopeId,
                                    String code, String text,
                                    Integer expected, Integer found, Integer missing,
                                    Double pct, Boolean ok, String link) {
        return new RDDataQualityRowDTO(scopeType, scopeId, label, name, code, text,
                expected, found, missing, pct, ok, link);
    }



    @Override
    public RDDataQualityReportDTO computeForSince(LocalDate since, LocalDate to) {
        RDDataQualityReportDTO out = RDDataQualityReportDTO.now();

        // All offerings that overlap [since..to]
        List<RDCourseOffering> offerings = dataQualityDao.getOfferingsIntersecting(since, to);

        // ---------- COURSE-LEVEL ----------
        Set<Integer> seenCourses = new HashSet<>();
        for (RDCourseOffering o : offerings) {
            Integer courseId = o.getCourse().getCourseId();
            if (!seenCourses.add(courseId)) continue;

            String courseName = o.getCourse().getCourseName();

            // C1: Course has sessions
            List<RDSessionDetailStat> stats = dataQualityDao.listSessionDetailStatsByCourse(courseId);
            int sessionsPlanned = stats.size();
            out.addRow(row("course", courseId, "Course #" + courseId, courseName,
                    "C1", "Course has sessions",
                    1, (sessionsPlanned > 0 ? 1 : 0), (sessionsPlanned > 0 ? 0 : 1),
                    pct((sessionsPlanned > 0 ? 1 : 0), 1), sessionsPlanned > 0,
                    "/admin/courses/" + courseId + "/sessions"));

            // C2: Each session has ≥ 10 details (aggregate + per-session misses)
            int totalDetails    = stats.stream().mapToInt(RDSessionDetailStat::getDetails).sum();
            int expectedDetails = sessionsPlanned * MIN_DETAILS_PER_SESSION;
            int missingSum      = stats.stream().mapToInt(s -> Math.max(0, MIN_DETAILS_PER_SESSION - s.getDetails())).sum();

            out.addRow(row("course", courseId, "Course #" + courseId, courseName,
                    "C2", "Session details ≥ " + MIN_DETAILS_PER_SESSION + " each (aggregate)",
                    expectedDetails, totalDetails, Math.max(0, expectedDetails - totalDetails),
                    pct(totalDetails, expectedDetails), missingSum == 0,
                    "/admin/courses/" + courseId + "/sessions/details"));

            // Per-session rows for any that are short
            for (RDSessionDetailStat st : stats) {
                if (st.getDetails() >= MIN_DETAILS_PER_SESSION) continue;
                int miss = MIN_DETAILS_PER_SESSION - st.getDetails();
                out.addRow(row("session", st.getSessionId(),
                        "Session #" + st.getSessionId(), st.getSessionTitle(),
                        "S1", "Session has ≥ " + MIN_DETAILS_PER_SESSION + " details",
                        MIN_DETAILS_PER_SESSION, st.getDetails(), miss,
                        pct(st.getDetails(), MIN_DETAILS_PER_SESSION), false,
                        "/admin/courses/" + courseId + "/sessions/" + st.getSessionId() + "/details"));
            }

            // C3: Course has offerings
            int offeringCount = dataQualityDao.getOfferingsByCourse(courseId).size();
            out.addRow(row("course", courseId, "Course #" + courseId, courseName,
                    "C3", "Course has offerings",
                    1, (offeringCount > 0 ? 1 : 0), (offeringCount > 0 ? 0 : 1),
                    (offeringCount > 0 ? 100.0 : 0.0), offeringCount > 0,
                    "/admin/courses/" + courseId + "/offerings"));
        }

        // ---------- OFFERING-LEVEL ----------
        for (RDCourseOffering o : offerings) {
            int offeringId = o.getCourseOfferingId();
            String label   = "Offering #" + offeringId;
            String name    = o.getCourseOfferingName();

            // Clamp window to offering date range
            LocalDate wStart = max(since, toLocal(o.getStartDate()));
            LocalDate wEnd   = min(to,   toLocalOrToday(o.getEndDate(), to));
            if (wEnd.isBefore(wStart)) continue;

            int enrollments     = dataQualityDao.countActiveEnrollments(offeringId);
            int expectedClasses = expectedClassesInWindow(o, wStart, wEnd); // fallback using daysOfWeek
            int attendance      = dataQualityDao.countAttendanceInWindow(offeringId, wStart, wEnd);
            int tracking        = dataQualityDao.countTrackingInWindow(offeringId,  wStart, wEnd);

            int expAtt = enrollments * expectedClasses;
            int expTrk = enrollments * expectedClasses;

            // O1: Has students
            out.addRow(row("offering", offeringId, label, name,
                    "O1", "Offering has active enrollments",
                    1, (enrollments > 0 ? 1 : 0), (enrollments > 0 ? 0 : 1),
                    (enrollments > 0 ? 100.0 : 0.0), enrollments > 0,
                    "/admin/offerings/" + offeringId + "/enrollments"));

            // O2: Attendance completeness (since start)
            out.addRow(row("offering", offeringId, label, name,
                    "O2", "Attendance completeness (since " + wStart + ")",
                    expAtt, attendance, Math.max(0, expAtt - attendance),
                    pct(attendance, expAtt),
                    expAtt == 0 || attendance >= expAtt,
                    "/admin/offerings/" + offeringId + "/attendance"));

            // O3: Tracking completeness (since start)
            out.addRow(row("offering", offeringId, label, name,
                    "O3", "Tracking completeness (since " + wStart + ")",
                    expTrk, tracking, Math.max(0, expTrk - tracking),
                    pct(tracking, expTrk),
                    expTrk == 0 || tracking >= expTrk,
                    "/admin/offerings/" + offeringId + "/tracking"));
        }

        out.setSummary(String.format(
            "Since %s → %s: %d courses, %d offerings checked.",
            since, to,
            (int) offerings.stream().map(o -> o.getCourse().getCourseId()).distinct().count(),
            offerings.size()
        ));
        return out;
    }

    @Override
    public RDDataQualityReportDTO computeForOfferingSince(Integer offeringId, LocalDate since, LocalDate to) {
        RDDataQualityReportDTO all = computeForSince(since, to);
        RDDataQualityReportDTO out = RDDataQualityReportDTO.now();
        for (RDDataQualityRowDTO r : all.getRows()) {
        	if ("offering".equals(r.getScopeType())
        		    && Objects.equals(r.getScopeId(), Integer.valueOf(offeringId))) {
        		    out.addRow(r);
        		}
        }
        out.setSummary("Rules for offering #" + offeringId + " since " + since + " → " + to);
        return out;
    }

    @Override
    public RDDataQualityReportDTO computeForCourseSince(Integer courseId, LocalDate since, LocalDate to) {
        RDDataQualityReportDTO all = computeForSince(since, to);
        RDDataQualityReportDTO out = RDDataQualityReportDTO.now();

        // include course rows for this course
        for (RDDataQualityRowDTO r : all.getRows()) {
        	if ("course".equals(r.getScopeType())
        		    && Objects.equals(r.getScopeId(), courseId)) {
        		    out.addRow(r);
        		}
        }
        // include offering rows that belong to the course
        Set<Integer> offeringIds = new HashSet<>();
        for (RDCourseOffering o : dataQualityDao.getOfferingsByCourse(courseId)) {
            offeringIds.add(o.getCourseOfferingId());
        }
        for (RDDataQualityRowDTO r : all.getRows()) {
            if ("offering".equals(r.getScopeType()) && offeringIds.contains(r.getScopeId())) {
                out.addRow(r);
            }
        }

        out.setSummary("Rules for course #" + courseId + " since " + since + " → " + to);
        return out;
    }

    /* ---------------- helpers ---------------- */
    private RDDataQualityRowDTO row(String scopeType, Integer scopeId, String scopeLabel, String scopeName,
                                    String code, String text,
                                    Integer expected, Integer found, Integer missing,
                                    Double pct, Boolean ok, String link) {
        return new RDDataQualityRowDTO(scopeType, scopeId, scopeLabel, scopeName,
                code, text, expected, found, missing, pct, ok, link);
    }

    private double pct(int found, int expected) {
        if (expected <= 0) return 100.0;
        double val = (found * 100.0) / expected;
        return Math.max(0.0, Math.min(100.0, val));
    }

    private LocalDate toLocal(java.util.Date d) {
        if (d == null) return LocalDate.MIN;
        return d.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
    }
    private LocalDate toLocalOrToday(java.util.Date d, LocalDate today) {
        return (d == null) ? today : toLocal(d);
    }
    private LocalDate max(LocalDate a, LocalDate b){ return a.isAfter(b) ? a : b; }
    private LocalDate min(LocalDate a, LocalDate b){ return a.isBefore(b) ? a : b; }

    /** Fallback: derive expected classes from daysOfWeek when you don’t have a dated RDClassSession entity. */
    private int expectedClassesInWindow(RDCourseOffering o, LocalDate from, LocalDate to) {
        if (o.getDaysOfWeek() == null || o.getDaysOfWeek().trim().isEmpty()) return 0;

        Set<DayOfWeek> allowed = new HashSet<>();
        for (String tok : o.getDaysOfWeek().replace(" ", "").split(",")) {
            switch (tok.toLowerCase()) {
                case "mon": allowed.add(DayOfWeek.MONDAY); break;
                case "tue": case "tues": allowed.add(DayOfWeek.TUESDAY); break;
                case "wed": allowed.add(DayOfWeek.WEDNESDAY); break;
                case "thu": case "thur": case "thurs": allowed.add(DayOfWeek.THURSDAY); break;
                case "fri": allowed.add(DayOfWeek.FRIDAY); break;
                case "sat": allowed.add(DayOfWeek.SATURDAY); break;
                case "sun": allowed.add(DayOfWeek.SUNDAY); break;
            }
        }

        LocalDate start = from.isBefore(to) ? from : to;
        LocalDate end   = to.isAfter(from) ? to : from;

        // clamp to offering window
        if (o.getStartDate() != null) {
            LocalDate s = toLocal(o.getStartDate());
            if (s.isAfter(start)) start = s;
        }
        if (o.getEndDate() != null) {
            LocalDate e = toLocal(o.getEndDate());
            if (e.isBefore(end)) end = e;
        }
        if (end.isBefore(start)) return 0;

        int count = 0;
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            if (allowed.contains(d.getDayOfWeek())) count++;
        }
        return count;
    }
}
