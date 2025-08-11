package com.robodynamics.controller;

import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import com.robodynamics.dto.RDEnrollmentReportDTO;
import com.robodynamics.dto.RDStudentAttendanceDTO;
import com.robodynamics.dto.RDStudentInfoDTO;
import com.robodynamics.dto.RDCourseTrackingDTO;

import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;

import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDCourseTrackingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

@Controller
public class RDParentDashboardController {

    private static final Logger log = LoggerFactory.getLogger(RDParentDashboardController.class);
    private static final DateTimeFormatter DMY = DateTimeFormatter.ofPattern("dd-MMM-yyyy");

    @Autowired private RDCourseOfferingService offeringService;
    @Autowired private RDStudentEnrollmentService enrollmentService;
    @Autowired private RDClassAttendanceService attendanceService;
    @Autowired private RDCourseTrackingService trackingService;

    /* ---------- session helpers ---------- */
    private RDUser getParent(HttpSession session) {
        System.out.println(">>> getParent called");
        Object o = session.getAttribute("rdUser");
        RDUser parent = (o instanceof RDUser) ? (RDUser) o : null;
        System.out.println("<<< getParent returning: " + (parent == null ? "null" : ("userId=" + parent.getUserID())));
        return parent;
    }
    private Integer getParentId(HttpSession session) {
        System.out.println(">>> getParentId called");
        RDUser p = getParent(session);
        Integer id = (p != null) ? p.getUserID() : null;
        System.out.println("<<< getParentId returning: " + id);
        return id;
    }

    /* ============ Views ============ */

    @GetMapping("parent/api/my-children")
    @ResponseBody
    public List<RDStudentInfoDTO> getMyChildren(HttpSession session) {
        System.out.println(">>> getMyChildren called");
        Integer parentId = getParentId(session);
        if (parentId == null) {
            System.out.println("<<< getMyChildren returning empty (no parentId)");
            return Collections.emptyList();
        }
        List<RDStudentInfoDTO> out = enrollmentService.getChildrenByParentId(parentId);
        System.out.println("<<< getMyChildren returning size=" + (out == null ? "null" : out.size()));
        return out == null ? Collections.emptyList() : out;
    }

    @GetMapping("/parent/dashboard")
    public String showParentDashboard(Model model, Principal principal, HttpSession session) {
        System.out.println(">>> showParentDashboard called");
        Integer parentId = getParentId(session);
        List<RDCourseOfferingSummaryDTO> courseOfferings =
                (parentId == null) ? Collections.emptyList() : offeringService.getOfferingsByParentId(parentId);
        List<RDEnrollmentReportDTO> enrollments =
                (parentId == null) ? Collections.emptyList() : enrollmentService.getEnrollmentsByParentId(parentId);

        model.addAttribute("courseOfferings", courseOfferings);
        model.addAttribute("enrollments", enrollments);
        System.out.println("<<< showParentDashboard returning view=parent/dashboard");
        return "parent/dashboard";
    }

    @GetMapping("/parent/reports")
    public String parentReports(Model model, HttpSession session) {
        System.out.println(">>> parentReports called");
        Integer parentId = getParentId(session);
        List<RDEnrollmentReportDTO> enrollments =
                (parentId == null) ? Collections.emptyList() : enrollmentService.getEnrollmentsByParentId(parentId);
        model.addAttribute("enrollments", enrollments);
        System.out.println("<<< parentReports returning view=parent/reports");
        return "parent/reports";
    }

    /* ============ JSON APIs ============ */

    @GetMapping("/parent/api/offerings")
    @ResponseBody
    public List<RDCourseOfferingSummaryDTO> apiOfferings(HttpSession session) {
        System.out.println(">>> apiOfferings called");
        String rid = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("rid", rid);
        Integer parentId = getParentId(session);
        try {
            log.info("[{}] offerings called: parentId={}", rid, parentId);
            List<RDCourseOfferingSummaryDTO> list = (parentId == null)
                    ? Collections.emptyList()
                    : offeringService.getOfferingsByParentId(parentId);
            log.info("[{}] offerings -> {}", rid, (list == null ? 0 : list.size()));
            System.out.println("<<< apiOfferings returning size=" + (list == null ? "null" : list.size()));
            return (list == null) ? Collections.emptyList() : list;
        } finally { MDC.clear(); }
    }

    @GetMapping("/parent/api/enrollments")
    @ResponseBody
    public List<RDEnrollmentReportDTO> apiEnrollments(HttpSession session) {
        System.out.println(">>> apiEnrollments called");
        String rid = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("rid", rid);
        Integer parentId = getParentId(session);
        try {
            log.info("[{}] enrollments called: parentId={}", rid, parentId);
            List<RDEnrollmentReportDTO> list = (parentId == null)
                    ? Collections.emptyList()
                    : enrollmentService.getEnrollmentsByParentId(parentId);
            log.info("[{}] enrollments -> {}", rid, (list == null ? 0 : list.size()));
            System.out.println("<<< apiEnrollments returning size=" + (list == null ? "null" : list.size()));
            return (list == null) ? Collections.emptyList() : list;
        } finally { MDC.clear(); }
    }

    /** Students (enrollments) for an offering, filtered by this parent (mom OR dad). */
    @GetMapping("/parent/api/students-by-offering")
    @ResponseBody
    public List<RDStudentInfoDTO> apiStudentsByOffering(@RequestParam("offeringId") Integer offeringId,
                                                        HttpSession session) {
        System.out.println(">>> apiStudentsByOffering called, offeringId=" + offeringId);
        String rid = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("rid", rid);
        Integer parentId = getParentId(session);
        try {
            log.info("[{}] studentsByOffering called: parentId={}, offeringId={}", rid, parentId, offeringId);

            if (parentId == null || offeringId == null) {
                log.warn("[{}] missing parentId or offeringId -> returning empty", rid);
                System.out.println("<<< apiStudentsByOffering returning empty (missing params)");
                return Collections.emptyList();
            }

            List<RDStudentInfoDTO> list =
                    enrollmentService.getEnrolledStudentInfosByOfferingIdAndParent(offeringId, parentId);

            if (list == null || list.isEmpty()) {
                log.info("[{}] DB-filter service returned empty; using in-memory fallback", rid);
                List<RDStudentEnrollment> enrollments = enrollmentService.getEnrolledStudentsByOfferingId(offeringId);
                if (enrollments == null) {
                    log.info("[{}] enrollments null -> return empty", rid);
                    System.out.println("<<< apiStudentsByOffering returning empty (no enrollments)");
                    return Collections.emptyList();
                }
                List<RDStudentInfoDTO> out = enrollments.stream()
                        .filter(Objects::nonNull)
                        .filter(e -> e.getStudent() != null)
                        .filter(e -> {
                            RDUser s = e.getStudent();
                            Integer momId = (s.getMom() != null) ? s.getMom().getUserID() : null;
                            Integer dadId = (s.getDad() != null) ? s.getDad().getUserID() : null;
                            return Objects.equals(momId, parentId) || Objects.equals(dadId, parentId);
                        })
                        .map(this::toStudentInfoDto)
                        .collect(Collectors.toList());
                log.info("[{}] studentsByOffering -> {} result(s) [fallback]", rid, out.size());
                if (log.isDebugEnabled()) log.info("[{}] sample: {}", rid, summarizeStudents(out, 5));
                System.out.println("<<< apiStudentsByOffering returning (fallback) size=" + out.size());
                return out;
            } else {
                log.info("[{}] studentsByOffering -> {} result(s) [db-filtered]", rid, list.size());
                if (log.isDebugEnabled()) log.info("[{}] sample: {}", rid, summarizeStudents(list, 5));
                System.out.println("<<< apiStudentsByOffering returning (db) size=" + list.size());
                return list;
            }
        } catch (Exception ex) {
            log.error("[{}] studentsByOffering error", rid, ex);
            System.out.println("xxx apiStudentsByOffering error: " + ex.getMessage());
            return Collections.emptyList();
        } finally {
            MDC.clear();
        }
    }

    /** Attendance for an enrollment (guarded to this parent). */
    @GetMapping("/parent/api/attendance")
    @ResponseBody
    public List<RDStudentAttendanceDTO> apiAttendance(@RequestParam("enrollmentId") Integer enrollmentId,
                                                      HttpSession session) {
        System.out.println(">>> apiAttendance called, enrollmentId=" + enrollmentId);
        String rid = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("rid", rid);
        Integer parentId = getParentId(session);
        try {
            log.info("[{}] attendance called: parentId={}, enrollmentId={}", rid, parentId, enrollmentId);

            if (parentId == null || enrollmentId == null) {
                log.warn("[{}] missing parentId or enrollmentId -> returning empty", rid);
                System.out.println("<<< apiAttendance returning empty (missing params)");
                return Collections.emptyList();
            }

            boolean owns = enrollmentService.enrollmentBelongsToParent(enrollmentId, parentId);
            log.info("[{}] enrollment ownership check = {}", rid, owns);
            if (!owns) {
                log.warn("[{}] parent {} does not own enrollment {} -> empty", rid, parentId, enrollmentId);
                System.out.println("<<< apiAttendance returning empty (ownership failed)");
                return Collections.emptyList();
            }

            List<RDClassAttendance> rows = attendanceService.getAttendanceByEnrollment(enrollmentId);
            System.out.println("Rows size - " + rows.size());
            System.out.println(rows);
            int size = (rows == null) ? 0 : rows.size();
            log.info("[{}] attendance rows fetched = {}", rid, size);
            if (log.isDebugEnabled() && size > 0) log.info("[{}] attendance sample: {}", rid, summarizeAttendance(rows, 5));

            List<RDStudentAttendanceDTO> out = new ArrayList<>();
            if (rows != null) {
                for (RDClassAttendance r : rows) {
                    try {
                        out.add(toStudentAttendanceDto(r));
                    } catch (Exception e) {
                        System.out.println("Error mapping attendanceId=" + r.getAttendanceId());
                        e.printStackTrace();
                    }
                }
            }
            System.out.println("<<< apiAttendance hello 22......");

            log.info("[{}] attendance DTOs = {}", rid, out.size());
            if (log.isDebugEnabled() && !out.isEmpty()) log.info("[{}] attendance DTO sample: {}", rid, summarizeAttendanceDTOs(out, 5));
            System.out.println("<<< apiAttendance returning size=" + out.size());
            return out;
        } catch (Exception ex) {
            log.error("[{}] attendance error", rid, ex);
            System.out.println("xxx apiAttendance error: " + ex.getMessage());
            return Collections.emptyList();
        } finally {
            MDC.clear();
        }
    }

    /** Tracking for an enrollment (guarded to this parent). */
    @GetMapping("/parent/api/tracking")
    @ResponseBody
    public List<RDCourseTrackingDTO> apiTracking(@RequestParam("enrollmentId") Integer enrollmentId,
                                                 HttpSession session) {
        System.out.println(">>> apiTracking called, enrollmentId=" + enrollmentId);
        String rid = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("rid", rid);
        Integer parentId = getParentId(session);
        try {
            log.info("[{}] tracking called: parentId={}, enrollmentId={}", rid, parentId, enrollmentId);

            if (parentId == null || enrollmentId == null) {
                log.warn("[{}] missing parentId or enrollmentId -> returning empty", rid);	
                System.out.println("<<< apiTracking returning empty (missing params)");
                return Collections.emptyList();
            }

            boolean owns = enrollmentService.enrollmentBelongsToParent(enrollmentId, parentId);
            log.info("[{}] enrollment ownership check = {}", rid, owns);
            if (!owns) {
                log.warn("[{}] parent {} does not own enrollment {} -> empty", rid, parentId, enrollmentId);
                System.out.println("<<< apiTracking returning empty (ownership failed)");
                return Collections.emptyList();
            }

            List<RDCourseTrackingDTO> out = trackingService.getTrackingByEnrollment(enrollmentId);
            int size = (out == null) ? 0 : out.size();
            log.info("[{}] tracking DTOs = {}", rid, size);
            if (log.isDebugEnabled() && size > 0) log.info("[{}] tracking sample: {}", rid, summarizeTrackingDTOs(out, 5));
            System.out.println("<<< apiTracking returning size=" + (out == null ? "null" : out.size()));
            return (out == null) ? Collections.emptyList() : out;
        } catch (Exception ex) {
            log.error("[{}] tracking error", rid, ex);
            System.out.println("xxx apiTracking error: " + ex.getMessage());
            return Collections.emptyList();
        } finally {
            MDC.clear();
        }
    }

    /* ---------- Summarizers ---------- */

    private static String summarizeStudents(List<RDStudentInfoDTO> list, int max) {
        System.out.println(">>> summarizeStudents called, list size=" + (list == null ? "null" : list.size()) + ", max=" + max);
        if (list == null || list.isEmpty()) return "[]";
        String s = list.stream()
                .limit(Math.max(0, max))
                .map(st -> String.format("#%s %s %s",
                        st.getEnrollmentId(),
                        nv(st.getFirstName()),
                        nv(st.getLastName())))
                .collect(Collectors.joining(" | "));
        System.out.println("<<< summarizeStudents returning: " + s);
        return s;
    }

    private static String summarizeAttendance(List<RDClassAttendance> list, int max) {
        System.out.println(">>> summarizeAttendance called, list size=" + (list == null ? "null" : list.size()) + ", max=" + max);
        if (list == null || list.isEmpty()) return "[]";
        String s = list.stream()
                .limit(Math.max(0, max))
                .map(a -> {
                    String dateStr = (a.getAttendanceDate() == null)
                            ? "-"
                            : a.getAttendanceDate().toInstant()
                              .atZone(ZoneId.systemDefault())
                              .toLocalDate()
                              .toString();
                    return String.format("#%d %s status=%d",
                            a.getAttendanceId(),
                            dateStr,
                            a.getAttendanceStatus());
                })
                .collect(Collectors.joining(" | "));
        System.out.println("<<< summarizeAttendance returning: " + s);
        return s;
    }

    private static String nz(Object o) { return (o == null ? "∅" : String.valueOf(o)); }

    private static String summarizeAttendanceDTOs(List<RDStudentAttendanceDTO> list, int max) {
        if (list == null || list.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder("[");
        int i = 0;
        for (RDStudentAttendanceDTO d : list) {
            if (d == null) continue;
            if (i++ >= max) break;
            sb.append("{id=").append(nz(d.getAttendanceId()))
              .append(", date=").append(nz(d.getClassDate()))   // or getAttendanceDate()
              .append(", status=").append(nz(d.getAttendanceStatusLabel())) // adjust to your DTO
              .append("}, ");
        }
        if (sb.length() > 1) sb.setLength(sb.length() - 2);
        return sb.append("]").toString();
    }

    private static String summarizeTrackingDTOs(List<RDCourseTrackingDTO> list, int max) {
        System.out.println(">>> summarizeTrackingDTOs called, list size=" + (list == null ? "null" : list.size()) + ", max=" + max);
        if (list == null || list.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder();
        int i = 0;
        for (RDCourseTrackingDTO t : list) {
            if (i++ >= Math.max(0, max)) break;
            if (sb.length() > 0) sb.append(" | ");

            String dateStr = "";
            if (t.getTrackingDate() != null) {
                dateStr = t.getTrackingDate()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .format(DMY);
            }

            sb.append(nv(dateStr)).append(' ')
              .append(nv(t.getTopic())).append(" (")
              .append(nv(t.getMentorName())).append(')');
        }
        String s = sb.toString();
        System.out.println("<<< summarizeTrackingDTOs returning: " + s);
        return s;
    }

    /** Null-safe string helper */
    private static String nv(String s) {
        System.out.println(">>> nv called with: " + s);
        String out = (s == null ? "" : s);
        System.out.println("<<< nv returning: " + out);
        return out;
    }

    /* ============ Mappers ============ */

    private RDStudentInfoDTO toStudentInfoDto(RDStudentEnrollment e) {
        System.out.println(">>> toStudentInfoDto called, enrollmentId=" + (e == null ? "null" : e.getEnrollmentId()));
        int enrollmentId = e.getEnrollmentId();
        RDUser s = e.getStudent();
        String first = (s != null && s.getFirstName() != null) ? s.getFirstName() : "";
        String last  = (s != null && s.getLastName()  != null) ? s.getLastName()  : "";
        RDStudentInfoDTO dto = new RDStudentInfoDTO(enrollmentId, first, last);
        System.out.println("<<< toStudentInfoDto returning enrollmentId=" + dto.getEnrollmentId());
        return dto;
    }

    private RDStudentAttendanceDTO toStudentAttendanceDto(RDClassAttendance a) {
        System.out.println(">>> toStudentAttendanceDto called, attendanceId=" + a.getAttendanceId());
        RDStudentAttendanceDTO dto = new RDStudentAttendanceDTO();

        dto.setAttendanceId(a.getAttendanceId());

        if (a.getClassSession() != null) {
            dto.setClassSessionId(a.getClassSession().getClassSessionId());
            dto.setClassDate(toLocalDate(a.getClassSession().getSessionDate()));

            if (a.getClassSession().getCourseOffering() != null) {
                dto.setCourseOfferingId(a.getClassSession().getCourseOffering().getCourseOfferingId());
                dto.setCourseOfferingName(nullSafe(a.getClassSession().getCourseOffering().getCourseOfferingName()));
            }
        }

        int status = a.getAttendanceStatus();
        dto.setAttendanceStatus(status);
        dto.setAttendanceStatusLabel(toStatusLabel(status));

        LocalDate attendanceDate = toLocalDateCompat(a.getAttendanceDate());
        dto.setAttendanceDate(attendanceDate);

        LocalTime attendanceTime = toLocalTimeCompat(a.getAttendanceTime());
        dto.setAttendanceTime(attendanceDate != null && attendanceTime != null
                ? LocalDateTime.of(attendanceDate, attendanceTime)
                : null);

        dto.setAttendanceTime(a.getAttendanceTime());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setRemarks(nullSafe(a.getNotes()));

        if (a.getEnrollment() != null && a.getEnrollment().getStudent() != null) {
            fillStudent(dto, a.getEnrollment().getStudent());
        } else if (a.getStudent() != null) {
            fillStudent(dto, a.getStudent());
        }
        System.out.println("hello 1.....");
        return dto;
    }

    private static LocalDate toLocalDateCompat(Object v) {
        if (v == null) return null;
        if (v instanceof LocalDate) return (LocalDate) v;
        if (v instanceof java.sql.Date) return ((java.sql.Date) v).toLocalDate(); // ✅ safe on JDK 17
        if (v instanceof java.sql.Timestamp) return ((java.sql.Timestamp) v).toLocalDateTime().toLocalDate();
        if (v instanceof java.util.Date) {
            return Instant.ofEpochMilli(((java.util.Date) v).getTime())
                          .atZone(ZoneId.systemDefault())
                          .toLocalDate();
        }
        if (v instanceof Long) { // epoch millis
            return Instant.ofEpochMilli((Long) v).atZone(ZoneId.systemDefault()).toLocalDate();
        }
        if (v instanceof CharSequence) { // e.g., "2025-08-11"
            return LocalDate.parse(v.toString());
        }
        throw new IllegalArgumentException("Unsupported date type: " + v.getClass());
    }

    private static LocalTime toLocalTimeCompat(Object v) {
        if (v == null) return null;
        if (v instanceof LocalTime) return (LocalTime) v;
        if (v instanceof java.sql.Time) return ((java.sql.Time) v).toLocalTime(); // ✅ safe on JDK 17
        if (v instanceof java.sql.Timestamp) return ((java.sql.Timestamp) v).toLocalDateTime().toLocalTime();
        if (v instanceof CharSequence) { // "HH:mm" or "HH:mm:ss"
            String s = v.toString();
            return s.length() == 5 ? LocalTime.parse(s + ":00") : LocalTime.parse(s);
        }
        throw new IllegalArgumentException("Unsupported time type: " + v.getClass());
    }

    /* ---------- helpers ---------- */

    private static LocalDate toLocalDate(Object dateLike) {
        System.out.println(">>> toLocalDate called with: " + (dateLike == null ? "null" : dateLike.getClass().getName()));
        if (dateLike == null) return null;
        if (dateLike instanceof LocalDate) {
            System.out.println("<<< toLocalDate returning LocalDate (as-is)");
            return (LocalDate) dateLike;
        }
        if (dateLike instanceof java.util.Date) {
            LocalDate d = ((java.util.Date) dateLike).toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            System.out.println("<<< toLocalDate converted from java.util.Date -> " + d);
            return d;
        }
        if (dateLike instanceof java.time.LocalDateTime) {
            LocalDate d = ((java.time.LocalDateTime) dateLike).toLocalDate();
            System.out.println("<<< toLocalDate converted from LocalDateTime -> " + d);
            return d;
        }
        System.out.println("<<< toLocalDate unsupported type -> null");
        return null;
    }

    private static String toStatusLabel(int status) {
        System.out.println(">>> toStatusLabel called with status=" + status);
        String label;
        if (status == RDClassAttendance.StatusType.PRESENT.getValue()) label = RDClassAttendance.StatusType.PRESENT.getLabel();
        else if (status == RDClassAttendance.StatusType.ABSENT.getValue()) label = RDClassAttendance.StatusType.ABSENT.getLabel();
        else label = "Unknown";
        System.out.println("<<< toStatusLabel returning: " + label);
        return label;
    }

    private static void fillStudent(RDStudentAttendanceDTO dto, RDUser s) {
        System.out.println(">>> fillStudent called, userId=" + (s == null ? "null" : s.getUserID()));
        dto.setUserID(s.getUserID());
        dto.setFirstName(nullSafe(s.getFirstName()));
        dto.setLastName(nullSafe(s.getLastName()));
        String fn = dto.getFirstName();
        String ln = dto.getLastName();
        dto.setFullName((fn == null || fn.isBlank())
                ? nullSafe(ln)
                : (ln == null || ln.isBlank()) ? fn : (fn + " " + ln));
        System.out.println("<<< fillStudent set fullName=" + dto.getFullName());
    }

    private static String nullSafe(String s) {
        System.out.println(">>> nullSafe called with: " + s);
        String out = (s == null) ? "" : s;
        System.out.println("<<< nullSafe returning: " + out);
        return out;
    }
}
