package com.robodynamics.dao.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.hibernate.Query;
import org.hibernate.QueryException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDDataQualityDao;
import com.robodynamics.dto.RDSessionDetailStat;
import com.robodynamics.model.RDCourseOffering;

@Repository
@Transactional
public class RDDataQualityDaoImpl implements RDDataQualityDao {

    private final SessionFactory sessionFactory;

    public RDDataQualityDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() { return sessionFactory.getCurrentSession(); }

    /* ------------------ helpers ------------------ */

    /** Try binding a LocalDate; if mapping expects java.util.Date, fall back to java.sql.Date. */
    private void bindDate(Query<?> q, String param, LocalDate d) {
        try {
            // Works when the entity field is java.time.LocalDate
            q.setParameter(param, d);
        } catch (IllegalArgumentException | ClassCastException ex) {
            // Works when the entity field is java.util.Date/@Temporal(TemporalType.DATE)
            q.setParameter(param, java.sql.Date.valueOf(d));
        }
    }

    /** Resolve courseId from offeringId (your sessions are linked via course). */
    private Integer courseIdForOffering(Integer offeringId) {
        String hql = "select o.course.courseId from RDCourseOffering o where o.courseOfferingId = :oid";
        Integer cid = (Integer) s().createQuery(hql).setParameter("oid", offeringId).uniqueResult();
        if (cid == null) throw new IllegalStateException("No course found for offeringId=" + offeringId);
        return cid;
    }

    /* ------------------ counts ------------------- */

    @Override
    public int countSessions(Integer offeringId) {
        Integer cid = courseIdForOffering(offeringId);
        String hql = "select count(s.courseSessionId) from RDCourseSession s where s.course.courseId = :cid";
        Long n = (Long) s().createQuery(hql).setParameter("cid", cid).uniqueResult();
        return n == null ? 0 : n.intValue();
    }

    @Override
    public int countSessionsUpToDate(Integer offeringId, LocalDate date) {
        // If you have a dated RDClassSession tied to the offering, use it:
        try {
            String hql = "select count(cs.classSessionId) from RDClassSession cs " +
                         "where cs.courseOffering.courseOfferingId = :oid and cs.sessionDate <= :d";
            Query<?> q = s().createQuery(hql)
                    .setParameter("oid", offeringId);
            bindDate(q, "d", date);
            Long n = (Long) q.uniqueResult();
            return n == null ? 0 : n.intValue();
        } catch (QueryException ex) {
            // No RDClassSession mapping → fall back to planned sessions count
            return countSessions(offeringId);
        }
    }

    @Override
    public int countSessionDetails(Integer offeringId) {
        Integer cid = courseIdForOffering(offeringId);
        String hql = "select count(d.sessionDetailId) from RDCourseSessionDetail d " +
                     "where d.courseSession.course.courseId = :cid";
        Long n = (Long) s().createQuery(hql).setParameter("cid", cid).uniqueResult();
        return n == null ? 0 : n.intValue();
    }

    @Override
    public int countActiveEnrollments(Integer offeringId) {
        String hql = "select count(e.enrollmentId) from RDStudentEnrollment e " +
                     "where e.courseOffering.courseOfferingId = :oid and e.status = 'ACTIVE'";
        Long n = (Long) s().createQuery(hql).setParameter("oid", offeringId).uniqueResult();
        return n == null ? 0 : n.intValue();
    }

    @Override
    public int countAttendanceUpToDate(Integer offeringId, LocalDate date) {
        String hql = "select count(a.attendanceId) from RDClassAttendance a " +
                     "where a.classSession.courseOffering.courseOfferingId = :oid " +
                     "and a.classSession.sessionDate <= :d";
        Query<?> q = s().createQuery(hql)
                .setParameter("oid", offeringId);
        bindDate(q, "d", date);
        Long n = (Long) q.uniqueResult();
        return n == null ? 0 : n.intValue();
    }

    @Override
    public int countTrackingUpToDate(Integer offeringId, LocalDate date) {
        // Prefer a date field on tracking if you have one (e.g., t.date or t.trackingDate)
        try {
            String hql = "select count(t.trackingId) from RDCourseTracking t " +
                         "where t.studentEnrollment.courseOffering.courseOfferingId = :oid " +
                         "and t.trackingDate <= :d";
            Query<?> q = s().createQuery(hql)
                    .setParameter("oid", offeringId);
            bindDate(q, "d", date);
            Long n = (Long) q.uniqueResult();
            return n == null ? 0 : n.intValue();
        } catch (QueryException ex) {
            // Fallback if no date column exists on tracking
            String hql2 = "select count(t.trackingId) from RDCourseTracking t " +
                          "where t.studentEnrollment.courseOffering.courseOfferingId = :oid";
            Long n2 = (Long) s().createQuery(hql2)
                    .setParameter("oid", offeringId)
                    .uniqueResult();
            return n2 == null ? 0 : n2.intValue();
        }
    }

    @Override
    public RDCourseOffering getOfferingWithJoins(Integer offeringId) {
        String hql = "from RDCourseOffering o left join fetch o.course left join fetch o.mentor " +
                     "where o.courseOfferingId = :oid";
        return (RDCourseOffering) s().createQuery(hql)
                .setParameter("oid", offeringId)
                .uniqueResult();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDCourseOffering> getOfferingsByCourseAndDate(Integer courseId, LocalDate date) {
        String hql = "from RDCourseOffering o left join fetch o.course left join fetch o.mentor " +
                     "where o.course.courseId = :cid and o.startDate <= :d and o.endDate >= :d";
        Query<?> q = s().createQuery(hql)
                .setParameter("cid", courseId);
        bindDate(q, "d", date);
        return (List<RDCourseOffering>) q.getResultList();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDSessionDetailStat> listSessionDetailStatsByCourse(Integer courseId) {
        // Uses your mapping: RDCourseSession → course, and RDCourseSessionDetail → courseSession
        String hql =
            "select s.courseSessionId, s.sessionTitle, count(d.sessionDetailId) " +
            "from RDCourseSession s " +
            "left join s.courseSessionDetails d " +
            "where s.course.courseId = :cid " +
            "group by s.courseSessionId, s.sessionTitle " +
            "order by s.tierOrder asc, s.courseSessionId asc";

        List<Object[]> rows = (List<Object[]>) s().createQuery(hql)
            .setParameter("cid", courseId)
            .getResultList();

        return rows.stream()
            .map(r -> new RDSessionDetailStat(
                (Integer) r[0],
                (String)  r[1],
                ((Long)   r[2]).intValue()
            ))
            .collect(Collectors.toList());
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDCourseOffering> getOfferingsIntersecting(LocalDate since, LocalDate to) {
        System.out.println("[DAO] Fetching offerings intersecting " + since + " .. " + to);

        String hql =
            "from RDCourseOffering o " +
            "left join fetch o.course " +
            "left join fetch o.instructor " +
            "where (o.startDate is null or o.startDate <= :to) " +
            "and (o.endDate is null or o.endDate >= :since) " +
            "order by o.course.courseId, o.courseOfferingId";

        org.hibernate.query.Query<?> q = s().createQuery(hql);
        q.setParameter("since", java.sql.Timestamp.valueOf(since.atStartOfDay()));
     //   q.setParameter("to", java.sql.Timestamp.valueOf(to.atTime(LocalTime.MAX)));

        List<RDCourseOffering> list = (List<RDCourseOffering>) q.getResultList();
        System.out.println("[DAO] Offerings fetched: " + list.size());
        for (RDCourseOffering o : list) {
            System.out.println(" -> " + o.getCourseOfferingName() +
                    " | Start=" + o.getStartDate() +
                    " | End=" + o.getEndDate());
        }
        return list;
    }


    @Override
    @SuppressWarnings("unchecked")
    public List<RDCourseOffering> getOfferingsByCourse(Integer courseId) {
        String hql =
            "from RDCourseOffering o " +
            "left join fetch o.course " +
            "left join fetch o.mentor " +
            "where o.course.courseId = :cid " +
            "order by o.startDate, o.courseOfferingId";
        return (List<RDCourseOffering>) s().createQuery(hql)
                .setParameter("cid", courseId)
                .getResultList();
    }

    @Override
    public int countAttendanceInWindow(int offeringId, LocalDate wStart, LocalDate wEnd) {
        // Assumes RDClassAttendance → classSession (dated) → courseOffering
        final String hql =
            "select count(a.attendanceId) " +
            "from RDClassAttendance a " +
            "where a.classSession.courseOffering.courseOfferingId = :oid " +
            "and a.classSession.sessionDate >= :from " +
            "and a.classSession.sessionDate <= :to";

        org.hibernate.query.Query<?> q = s().createQuery(hql)
            .setParameter("oid", offeringId);
        bindDate(q, "from", wStart);
        bindDate(q, "to",   wEnd);

        Long n = (Long) q.uniqueResult();
        return (n == null) ? 0 : n.intValue();
    }

    @Override
    public int countTrackingInWindow(int offeringId, LocalDate wStart, LocalDate wEnd) {
        // Prefer a dedicated date column on tracking (e.g., t.date). If not present,
        // fall back to the associated session's sessionDate.
        try {
            final String hql =
                "select count(t.trackingId) " +
                "from RDCourseTracking t " +
                "where t.enrollment.courseOffering.courseOfferingId = :oid " +
                "and t.date >= :from and t.date <= :to";

            org.hibernate.query.Query<?> q = s().createQuery(hql)
                .setParameter("oid", offeringId);
            bindDate(q, "from", wStart);
            bindDate(q, "to",   wEnd);

            Long n = (Long) q.uniqueResult();
            return (n == null) ? 0 : n.intValue();
        } catch (org.hibernate.QueryException ex) {
            // Fallback: use the session's date if tracking doesn’t have its own date column
            final String hql2 =
                "select count(t.trackingId) " +
                "from RDCourseTracking t " +
                "where t.enrollment.courseOffering.courseOfferingId = :oid " +
                "and t.courseSession.sessionDate >= :from " +
                "and t.courseSession.sessionDate <= :to";

            org.hibernate.query.Query<?> q2 = s().createQuery(hql2)
                .setParameter("oid", offeringId);
            bindDate(q2, "from", wStart);
            bindDate(q2, "to",   wEnd);

            Long n2 = (Long) q2.uniqueResult();
            return (n2 == null) ? 0 : n2.intValue();
        }
    }

}
