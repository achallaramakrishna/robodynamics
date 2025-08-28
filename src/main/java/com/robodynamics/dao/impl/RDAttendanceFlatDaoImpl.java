package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDAttendanceFlatDao;
import com.robodynamics.dto.RDAttendanceFlatRowDTO;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.NativeQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Repository
@Transactional(readOnly = true)
public class RDAttendanceFlatDaoImpl implements RDAttendanceFlatDao {

    private final SessionFactory sessionFactory;

    public RDAttendanceFlatDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    // -------- helpers --------
    private Session s() { return sessionFactory.getCurrentSession(); }

    private static String likeWrap(String s) { return (s == null || s.isBlank()) ? null : "%" + s.trim() + "%"; }
    private static String normalize(String s) { return (s == null) ? null : s.trim().toLowerCase(Locale.ROOT); }

    /** Robust conversion to LocalTime from TIME, TIMESTAMP or String (HH:mm[:ss]) */
    private static LocalTime toLocalTime(Object v) {
        if (v == null) return null;
        if (v instanceof Time)      return ((Time) v).toLocalTime();
        if (v instanceof Timestamp) return ((Timestamp) v).toLocalDateTime().toLocalTime();
        if (v instanceof CharSequence) return LocalTime.parse(v.toString());
        return null;
    }

    /** Robust conversion to LocalDate from SQL/Util Date or String (yyyy-MM-dd) */
    private static LocalDate toLocalDate(Object v) {
        if (v == null) return null;
        if (v instanceof Date)          return ((Date) v).toLocalDate();
        if (v instanceof java.util.Date) return ((java.util.Date) v).toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();
        if (v instanceof CharSequence)  return LocalDate.parse(v.toString());
        return null;
    }

    /** For DTOs expecting java.sql.Date */
    private static Date toSqlDate(Object v) {
        if (v == null) return null;
        if (v instanceof Date) return (Date) v;
        if (v instanceof java.util.Date) return new Date(((java.util.Date) v).getTime());
        if (v instanceof LocalDate) return Date.valueOf((LocalDate) v);
        if (v instanceof CharSequence) return Date.valueOf(LocalDate.parse(v.toString()));
        return null;
    }

    private List<RDAttendanceFlatRowDTO> mapRows(List<Object[]> rows) {
        List<RDAttendanceFlatRowDTO> out = new ArrayList<>(rows.size());
        for (Object[] r : rows) {
            int i = 0;
            RDAttendanceFlatRowDTO dto = new RDAttendanceFlatRowDTO();
            dto.setOfferingId               ((Number) r[i++] == null ? null : ((Number) r[i-1]).intValue());
            dto.setOfferingName             ((String)  r[i++]);
            dto.setMentorName               ((String)  r[i++]);
            dto.setStudentId                ((Number) r[i++] == null ? null : ((Number) r[i-1]).intValue());
            dto.setStudentName              ((String)  r[i++]);

            // Was: ((Date) r[i++]).toLocalDate()  → blew up when driver returned String
            // Use SQL DATE cast + tolerant mapper to keep it stable:
            dto.setSessionDate(toLocalDate(r[i++]));
            	// keep DTO signature setSessionDate(Date)

            dto.setWeekday                  ((String)  r[i++]);
            dto.setSessionStartTime         (toLocalTime(r[i++]));   // TIME or DATETIME or String
            dto.setSessionEndTime           (toLocalTime(r[i++]));
            dto.setAttendanceOnDate         ((String)  r[i++]);
            dto.setAttendanceMarkedAt       ((Timestamp) r[i++]);
            dto.setFeedbackOnDate           ((String)  r[i++]);
            dto.setTrackingSessionIdOnDate  (r[i] == null ? null : ((Number) r[i]).intValue()); i++;
            dto.setTrackingMarkedAt         ((Timestamp) r[i++]);
            dto.setTrackingMarkedBy         ((String)  r[i++]);
            out.add(dto);
        }
        return out;
    }

    private void bindCommon(NativeQuery<?> q,
                            Integer offeringId, Integer studentId,
                            String studentLike, String mentorLike, String offeringLike,
                            String status, String hasFeedback) {
        q.setParameter("offeringId", offeringId);
        q.setParameter("studentId",  studentId);

        q.setParameter("studentLike",  likeWrap(studentLike));
        q.setParameter("mentorLike",   likeWrap(mentorLike));
        q.setParameter("offeringLike", likeWrap(offeringLike));

        q.setParameter("status",      normalize(status));
        q.setParameter("hasFeedback", normalize(hasFeedback));
    }

    // -------- DAY --------
    @Override
    public List<RDAttendanceFlatRowDTO> findDay(LocalDate day,
                                              Integer offeringId, Integer studentId,
                                              String studentLike, String mentorLike, String offeringLike,
                                              String status, String hasFeedback) {

        String sql =
            "WITH " +
            " offering_day AS ( " +
            "   SELECT o.course_offering_id, o.course_offering_name, o.instructor_id, o.mentor_id, " +
            "          o.session_start_time, o.session_end_time, " +
            "          REPLACE(COALESCE(o.days_of_week,''), ' ', '') AS days_csv " +
            "     FROM rd_course_offerings o " +
            "    WHERE (o.start_date IS NULL OR o.start_date <= :day) " +
            "      AND (o.end_date   IS NULL OR o.end_date   >= :day) " +
            "      AND (:offeringId IS NULL OR o.course_offering_id = :offeringId) " +
            "      AND o.days_of_week IS NOT NULL " +
            "      AND REPLACE(o.days_of_week,' ','') REGEXP (DATE_FORMAT(:day, '%a')) " +
            " ), " +
            " att_today AS ( " +
            "   SELECT a.*, ROW_NUMBER() OVER (PARTITION BY a.enrollment_id, a.attendance_date " +
            "          ORDER BY a.created_at DESC, a.attendance_id DESC) rn " +
            "     FROM rd_class_attendance a WHERE a.attendance_date = :day " +
            " ), " +
            " trk_today AS ( " +
            "   SELECT t.student_enrollment_id AS enrollment_id, t.feedback, t.tracking_date, " +
            "          t.course_session_id, t.created_at, t.created_by, " +
            "          ROW_NUMBER() OVER (PARTITION BY t.student_enrollment_id, t.tracking_date " +
            "          ORDER BY t.created_at DESC, t.tracking_id DESC) rn " +
            "     FROM rd_course_tracking t WHERE t.tracking_date = :day " +
            " ) " +
            " SELECT " +
            "   od.course_offering_id            AS offering_id, " +
            "   od.course_offering_name          AS offering_name, " +
            "   COALESCE(CONCAT_WS(' ', m.first_name, m.last_name), '—') AS mentor_name, " +
            "   u.user_id                        AS student_id, " +
            "   CONCAT_WS(' ', u.first_name, u.last_name) AS student_name, " +
            "   CAST(:day AS DATE)               AS session_date, " + // <— force DATE
            "   DATE_FORMAT(:day, '%a')          AS weekday, " +
            "   od.session_start_time, od.session_end_time, " +
            "   CASE WHEN a.attendance_status = 1 THEN 'Present' " +
            "        WHEN a.attendance_status IS NULL THEN '—' ELSE 'Absent' END AS attendance_on_date, " +
            "   a.created_at AS attendance_marked_at, " +
            "   t.feedback   AS feedback_on_date, " +
            "   t.course_session_id AS tracking_session_id_on_date, " +
            "   t.created_at AS tracking_marked_at, " +
            "   CONCAT_WS(' ', cb.first_name, cb.last_name) AS tracking_marked_by " +
            " FROM offering_day od " +
            " JOIN rd_student_enrollments e ON e.course_offering_id = od.course_offering_id " +
            " JOIN rd_users u ON u.user_id = e.student_id " +
            " LEFT JOIN rd_users m  ON m.user_id = COALESCE(od.instructor_id, od.mentor_id) " +
            " LEFT JOIN att_today a ON a.enrollment_id = e.enrollment_id AND a.rn = 1 " +
            " LEFT JOIN trk_today t ON t.enrollment_id = e.enrollment_id AND t.rn = 1 " +
            " LEFT JOIN rd_users cb ON cb.user_id = t.created_by " +
            " WHERE (:studentId   IS NULL OR u.user_id = :studentId) " +
            "   AND (:studentLike IS NULL OR CONCAT_WS(' ', u.first_name, u.last_name) LIKE :studentLike) " +
            "   AND (:mentorLike  IS NULL OR CONCAT_WS(' ', m.first_name, m.last_name) LIKE :mentorLike) " +
            "   AND (:offeringLike IS NULL OR od.course_offering_name LIKE :offeringLike) " +
            "   AND ( :status IS NULL OR " +
            "        ( (:status = 'present' AND a.attendance_status = 1) " +
            "       OR  (:status = 'absent'  AND (a.attendance_status = 0 OR a.attendance_status IS NULL)) ) " +
            "       ) " +
            "   AND ( :hasFeedback IS NULL OR " +
            "        ( (:hasFeedback='yes' AND t.feedback IS NOT NULL AND LENGTH(TRIM(t.feedback))>0) " +
            "       OR  (:hasFeedback='no'  AND (t.feedback IS NULL OR LENGTH(TRIM(t.feedback))=0)) ) " +
            "       ) " +
            " ORDER BY od.session_start_time, od.course_offering_id, student_name ";

        NativeQuery<Object[]> q = s().createNativeQuery(sql);
        q.setParameter("day", Date.valueOf(day));
        bindCommon(q, offeringId, studentId, studentLike, mentorLike, offeringLike, status, hasFeedback);

        List<Object[]> rows = q.list();
        return mapRows(rows);
    }

    // -------- WEEK --------
    @Override
    public List<RDAttendanceFlatRowDTO> findWeek(LocalDate base,
                                               Integer offeringId, Integer studentId,
                                               String studentLike, String mentorLike, String offeringLike,
                                               String status, String hasFeedback) {
        LocalDate from = base.minusDays(base.getDayOfWeek().getValue() - DayOfWeek.MONDAY.getValue());
        LocalDate to   = from.plusDays(6);

        String sql =
            "WITH RECURSIVE cal AS ( " +
            "  SELECT CAST(:from AS DATE) AS d " + // <— force DATE
            "  UNION ALL SELECT DATE_ADD(d, INTERVAL 1 DAY) FROM cal WHERE d < CAST(:to AS DATE) " + // <— force DATE
            "), offering_days AS ( " +
            "  SELECT o.course_offering_id, o.course_offering_name, o.instructor_id, o.mentor_id, " +
            "         o.session_start_time, o.session_end_time, o.start_date, o.end_date, " +
            "         REPLACE(COALESCE(o.days_of_week,''), ' ', '') AS days_csv " +
            "    FROM rd_course_offerings o " +
            "   WHERE (o.start_date IS NULL OR o.start_date <= :to) " +
            "     AND (o.end_date   IS NULL OR o.end_date   >= :from) " +
            "     AND (:offeringId IS NULL OR o.course_offering_id = :offeringId) " +
            "), enr AS ( " +
            "  SELECT e.enrollment_id, e.course_offering_id, u.user_id AS student_id, " +
            "         CONCAT_WS(' ', u.first_name, u.last_name) AS student_name " +
            "    FROM rd_student_enrollments e JOIN rd_users u ON u.user_id = e.student_id " +
            "   WHERE (:studentId IS NULL OR u.user_id = :studentId) " +
            "     AND (:studentLike IS NULL OR CONCAT_WS(' ', u.first_name, u.last_name) LIKE :studentLike) " +
            "), sched_days AS ( " +
            "  SELECT od.course_offering_id, c.d AS session_date " +
            "    FROM offering_days od JOIN cal c " +
            "      ON c.d BETWEEN COALESCE(od.start_date, c.d) AND COALESCE(od.end_date, c.d) " +
            "     AND od.days_csv <> '' " +
            "     AND od.days_csv REGEXP (CASE DAYOFWEEK(c.d) " +
            "        WHEN 1 THEN 'Sun' WHEN 2 THEN 'Mon' WHEN 3 THEN 'Tue' WHEN 4 THEN 'Wed' " +
            "        WHEN 5 THEN 'Thu' WHEN 6 THEN 'Fri' WHEN 7 THEN 'Sat' END) " +
            "), mentors AS ( SELECT u.user_id, CONCAT_WS(' ', u.first_name, u.last_name) AS name FROM rd_users u ), " +
            " att_by_day AS ( " +
            "  SELECT a.enrollment_id, a.attendance_date, a.attendance_status, a.created_at, " +
            "         ROW_NUMBER() OVER (PARTITION BY a.enrollment_id, a.attendance_date " +
            "         ORDER BY a.created_at DESC, a.attendance_id DESC) rn " +
            "    FROM rd_class_attendance a WHERE a.attendance_date BETWEEN :from AND :to " +
            "), trk_by_day AS ( " +
            "  SELECT t.student_enrollment_id AS enrollment_id, t.tracking_date, t.feedback, t.course_session_id, " +
            "         t.created_at, t.created_by, " +
            "         ROW_NUMBER() OVER (PARTITION BY t.student_enrollment_id, t.tracking_date " +
            "         ORDER BY t.created_at DESC, t.tracking_id DESC) rn " +
            "    FROM rd_course_tracking t WHERE t.tracking_date BETWEEN :from AND :to " +
            ") " +
            " SELECT " +
            "  od.course_offering_id AS offering_id, od.course_offering_name AS offering_name, " +
            "  COALESCE(mn.name,'—') AS mentor_name, " +
            "  en.student_id, en.student_name, sd.session_date, DATE_FORMAT(sd.session_date, '%a') AS weekday, " +
            "  od.session_start_time, od.session_end_time, " +
            "  CASE WHEN a.attendance_status = 1 THEN 'Present' " +
            "       WHEN a.attendance_status IS NULL THEN '—' ELSE 'Absent' END AS attendance_on_date, " +
            "  a.created_at AS attendance_marked_at, " +
            "  t.feedback AS feedback_on_date, t.course_session_id AS tracking_session_id_on_date, " +
            "  t.created_at AS tracking_marked_at, cb.name AS tracking_marked_by " +
            " FROM sched_days sd " +
            " JOIN offering_days od ON od.course_offering_id = sd.course_offering_id " +
            " JOIN enr en           ON en.course_offering_id = od.course_offering_id " +
            " LEFT JOIN mentors mn  ON mn.user_id = COALESCE(od.instructor_id, od.mentor_id) " +
            " LEFT JOIN att_by_day a ON a.enrollment_id = en.enrollment_id AND a.attendance_date = sd.session_date AND a.rn = 1 " +
            " LEFT JOIN trk_by_day t ON t.enrollment_id = en.enrollment_id AND t.tracking_date  = sd.session_date AND t.rn = 1 " +
            " LEFT JOIN mentors cb    ON cb.user_id = t.created_by " +
            " WHERE (:mentorLike  IS NULL OR mn.name LIKE :mentorLike) " +
            "   AND (:offeringLike IS NULL OR od.course_offering_name LIKE :offeringLike) " +
            "   AND ( :status IS NULL OR " +
            "        ( (:status = 'present' AND a.attendance_status = 1) " +
            "       OR  (:status = 'absent'  AND (a.attendance_status = 0 OR a.attendance_status IS NULL)) ) " +
            "       ) " +
            "   AND ( :hasFeedback IS NULL OR " +
            "        ( (:hasFeedback='yes' AND t.feedback IS NOT NULL AND LENGTH(TRIM(t.feedback))>0) " +
            "       OR  (:hasFeedback='no'  AND (t.feedback IS NULL OR LENGTH(TRIM(t.feedback))=0)) ) " +
            "       ) " +
            " ORDER BY od.course_offering_id, en.student_name, sd.session_date ";

        NativeQuery<Object[]> q = s().createNativeQuery(sql);
        q.setParameter("from", Date.valueOf(from));
        q.setParameter("to",   Date.valueOf(to));
        bindCommon(q, offeringId, studentId, studentLike, mentorLike, offeringLike, status, hasFeedback);

        return mapRows(q.list());
    }

    // -------- MONTH --------
    @Override
    public List<RDAttendanceFlatRowDTO> findMonth(LocalDate base,
                                                Integer offeringId, Integer studentId,
                                                String studentLike, String mentorLike, String offeringLike,
                                                String status, String hasFeedback) {
        LocalDate from = base.withDayOfMonth(1);
        LocalDate to   = base.withDayOfMonth(base.lengthOfMonth());

        String sql =
            "WITH RECURSIVE cal AS ( " +
            "  SELECT CAST(:from AS DATE) AS d " + // <— force DATE
            "  UNION ALL SELECT DATE_ADD(d, INTERVAL 1 DAY) FROM cal WHERE d < CAST(:to AS DATE) " + // <— force DATE
            "), offering_days AS ( " +
            "  SELECT o.course_offering_id, o.course_offering_name, o.instructor_id, o.mentor_id, " +
            "         o.session_start_time, o.session_end_time, o.start_date, o.end_date, " +
            "         REPLACE(COALESCE(o.days_of_week,''), ' ', '') AS days_csv " +
            "    FROM rd_course_offerings o " +
            "   WHERE (o.start_date IS NULL OR o.start_date <= :to) " +
            "     AND (o.end_date   IS NULL OR o.end_date   >= :from) " +
            "     AND (:offeringId IS NULL OR o.course_offering_id = :offeringId) " +
            "), enr AS ( " +
            "  SELECT e.enrollment_id, e.course_offering_id, u.user_id AS student_id, " +
            "         CONCAT_WS(' ', u.first_name, u.last_name) AS student_name " +
            "    FROM rd_student_enrollments e JOIN rd_users u ON u.user_id = e.student_id " +
            "   WHERE (:studentId IS NULL OR u.user_id = :studentId) " +
            "     AND (:studentLike IS NULL OR CONCAT_WS(' ', u.first_name, u.last_name) LIKE :studentLike) " +
            "), sched_days AS ( " +
            "  SELECT od.course_offering_id, c.d AS session_date " +
            "    FROM offering_days od JOIN cal c " +
            "      ON c.d BETWEEN COALESCE(od.start_date, c.d) AND COALESCE(od.end_date, c.d) " +
            "     AND od.days_csv <> '' " +
            "     AND od.days_csv REGEXP (CASE DAYOFWEEK(c.d) " +
            "        WHEN 1 THEN 'Sun' WHEN 2 THEN 'Mon' WHEN 3 THEN 'Tue' WHEN 4 THEN 'Wed' " +
            "        WHEN 5 THEN 'Thu' WHEN 6 THEN 'Fri' WHEN 7 THEN 'Sat' END) " +
            "), mentors AS ( SELECT u.user_id, CONCAT_WS(' ', u.first_name, u.last_name) AS name FROM rd_users u ), " +
            " att_by_day AS ( " +
            "  SELECT a.enrollment_id, a.attendance_date, a.attendance_status, a.created_at, " +
            "         ROW_NUMBER() OVER (PARTITION BY a.enrollment_id, a.attendance_date " +
            "         ORDER BY a.created_at DESC, a.attendance_id DESC) rn " +
            "    FROM rd_class_attendance a WHERE a.attendance_date BETWEEN :from AND :to " +
            "), trk_by_day AS ( " +
            "  SELECT t.student_enrollment_id AS enrollment_id, t.tracking_date, t.feedback, t.course_session_id, " +
            "         t.created_at, t.created_by, " +
            "         ROW_NUMBER() OVER (PARTITION BY t.student_enrollment_id, t.tracking_date " +
            "         ORDER BY t.created_at DESC, t.tracking_id DESC) rn " +
            "    FROM rd_course_tracking t WHERE t.tracking_date BETWEEN :from AND :to " +
            ") " +
            " SELECT " +
            "  od.course_offering_id AS offering_id, od.course_offering_name AS offering_name, " +
            "  COALESCE(mn.name,'—') AS mentor_name, " +
            "  en.student_id, en.student_name, sd.session_date, DATE_FORMAT(sd.session_date, '%a') AS weekday, " +
            "  od.session_start_time, od.session_end_time, " +
            "  CASE WHEN a.attendance_status = 1 THEN 'Present' " +
            "       WHEN a.attendance_status IS NULL THEN '—' ELSE 'Absent' END AS attendance_on_date, " +
            "  a.created_at AS attendance_marked_at, " +
            "  t.feedback AS feedback_on_date, t.course_session_id AS tracking_session_id_on_date, " +
            "  t.created_at AS tracking_marked_at, cb.name AS tracking_marked_by " +
            " FROM sched_days sd " +
            " JOIN offering_days od ON od.course_offering_id = sd.course_offering_id " +
            " JOIN enr en           ON en.course_offering_id = od.course_offering_id " +
            " LEFT JOIN mentors mn  ON mn.user_id = COALESCE(od.instructor_id, od.mentor_id) " +
            " LEFT JOIN att_by_day a ON a.enrollment_id = en.enrollment_id AND a.attendance_date = sd.session_date AND a.rn = 1 " +
            " LEFT JOIN trk_by_day t ON t.enrollment_id = en.enrollment_id AND t.tracking_date  = sd.session_date AND t.rn = 1 " +
            " LEFT JOIN mentors cb    ON cb.user_id = t.created_by " +
            " WHERE (:mentorLike  IS NULL OR mn.name LIKE :mentorLike) " +
            "   AND (:offeringLike IS NULL OR od.course_offering_name LIKE :offeringLike) " +
            "   AND ( :status IS NULL OR " +
            "        ( (:status = 'present' AND a.attendance_status = 1) " +
            "       OR  (:status = 'absent'  AND (a.attendance_status = 0 OR a.attendance_status IS NULL)) ) " +
            "       ) " +
            "   AND ( :hasFeedback IS NULL OR " +
            "        ( (:hasFeedback='yes' AND t.feedback IS NOT NULL AND LENGTH(TRIM(t.feedback))>0) " +
            "       OR  (:hasFeedback='no'  AND (t.feedback IS NULL OR LENGTH(TRIM(t.feedback))=0)) ) " +
            "       ) " +
            " ORDER BY od.course_offering_id, en.student_name, sd.session_date ";

        NativeQuery<Object[]> q = s().createNativeQuery(sql);
        q.setParameter("from", Date.valueOf(from));
        q.setParameter("to",   Date.valueOf(to));
        bindCommon(q, offeringId, studentId, studentLike, mentorLike, offeringLike, status, hasFeedback);

        return mapRows(q.list());
    }
}
