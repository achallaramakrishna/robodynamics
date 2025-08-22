package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDUser;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.NoResultException;
import java.sql.Date;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.function.Function;

@Repository
@Transactional
public class RDCourseOfferingDaoImpl implements RDCourseOfferingDao {

    @Autowired
    private SessionFactory factory;

    private Session s() { return factory.getCurrentSession(); }

    /* ====================== Create / Read / Update / Delete ====================== */

    @Override
    public void saveRDCourseOffering(RDCourseOffering rdCourseOffering) {
        s().saveOrUpdate(rdCourseOffering);
    }

    @Override
    public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId) {
        return s().get(RDCourseOffering.class, rdCourseOfferingId);
    }

    @Override
    public List<RDCourseOffering> getRDCourseOfferings() {
        String hql = "from RDCourseOffering";
        return s().createQuery(hql, RDCourseOffering.class).getResultList();
    }

    @Override
    public void deleteRDCourseOffering(int id) {
        RDCourseOffering o = s().byId(RDCourseOffering.class).load(id);
        s().delete(o);
    }

    @Override
    public List<RDCourseOffering> getRDCourseOfferingsList(int userId) {
        try {
            String hql = "from RDCourseOffering where user.userID = :userId";
            return s().createQuery(hql, RDCourseOffering.class)
                      .setParameter("userId", userId)
                      .getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        }
    }

    @Override
    public RDCourseOffering getOnlineCourseOffering(int courseId) {
        String hql = "from RDCourseOffering co where co.course.courseId = :courseId";
        List<RDCourseOffering> results = s().createQuery(hql, RDCourseOffering.class)
                                            .setParameter("courseId", courseId)
                                            .getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public List<RDCourseOffering> getRDCourseOfferingsListByCourse(int courseId) {
        String hql = "from RDCourseOffering where course.courseId = :courseId";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("courseId", courseId)
                  .getResultList();
    }

    /* ====================== Day-of-week / Daily lookups ====================== */

    @Override
    public List<RDCourseOffering> getCourseOfferingsByDate(LocalDate date) {
        String shortDay = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH); // e.g., Mon
        String hql = "from RDCourseOffering c " +
                     "where replace(lower(c.daysOfWeek), ' ', '') like :dayOfWeek " +
                     "  and c.startDate <= :d " +
                     "  and c.endDate   >= :d";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("dayOfWeek", "%" + shortDay.toLowerCase(Locale.ROOT) + "%")
                  .setParameter("d", Date.valueOf(date))
                  .getResultList();
    }

    @Override
    public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, Integer userId) {
        String shortDay = selectedDate.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
        String hql = "from RDCourseOffering c " +
                     "left join fetch c.course " +
                     "left join fetch c.instructor m " +
                     "where replace(lower(c.daysOfWeek), ' ', '') like :dayOfWeek " +
                     "  and c.startDate <= :d " +
                     "  and c.endDate   >= :d " +
                     "  and m is not null and m.userID = :mentorId " +
                     "order by c.startDate desc";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("dayOfWeek", "%" + shortDay.toLowerCase(Locale.ROOT) + "%")
                  .setParameter("d", Date.valueOf(selectedDate))
                  .setParameter("mentorId", userId)
                  .getResultList();
    }

    /* ====================== Date overlap (safe, DATE-only) ====================== */

    @Override
    public List<RDCourseOffering> findByDate(LocalDate date) {
        String hql = "from RDCourseOffering o " +
                     "where o.startDate <= :d " +
                     "  and o.endDate   >= :d " +
                     "order by o.startDate asc";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("d", Date.valueOf(date))
                  .getResultList();
    }

    @Override
    public List<RDCourseOffering> findByDateAndMentor(LocalDate date, Integer mentorUserId) {
        String hql = "from RDCourseOffering o " +
                     "where o.instructor.userID = :mid " +
                     "  and o.startDate <= :d " +
                     "  and o.endDate   >= :d " +
                     "order by o.startDate asc";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("mid", mentorUserId)
                  .setParameter("d", Date.valueOf(date))
                  .getResultList();
    }

    @Override
    public List<RDCourseOffering> findBetween(LocalDate startInclusive, LocalDate endInclusive) {
        if (endInclusive.isBefore(startInclusive)) endInclusive = startInclusive;
        String hql = "from RDCourseOffering o " +
                     "where o.endDate   >= :since " +
                     "  and o.startDate <= :till " +
                     "order by o.startDate asc";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("since", Date.valueOf(startInclusive))
                  .setParameter("till",  Date.valueOf(endInclusive))
                  .getResultList();
    }

    @Override
    public List<RDCourseOffering> findBetweenForMentor(LocalDate startInclusive, LocalDate endInclusive, Integer mentorUserId) {
        if (endInclusive.isBefore(startInclusive)) endInclusive = startInclusive;
        String hql = "from RDCourseOffering o " +
                     "where o.instructor.userID = :mid " +
                     "  and o.endDate   >= :since " +
                     "  and o.startDate <= :till " +
                     "order by o.startDate asc";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("mid",   mentorUserId)
                  .setParameter("since", Date.valueOf(startInclusive))
                  .setParameter("till",  Date.valueOf(endInclusive))
                  .getResultList();
    }

    /* ===== Pagination variants (still DATE overlap) ===== */

    @Override
    public List<RDCourseOffering> findBetween(LocalDate startInclusive, LocalDate endInclusive, int offset, int limit) {
        if (endInclusive.isBefore(startInclusive)) endInclusive = startInclusive;
        String hql = "from RDCourseOffering o " +
                     "where o.endDate   >= :since " +
                     "  and o.startDate <= :till " +
                     "order by o.startDate asc";
        Query<RDCourseOffering> q = s().createQuery(hql, RDCourseOffering.class)
                                       .setParameter("since", Date.valueOf(startInclusive))
                                       .setParameter("till",  Date.valueOf(endInclusive));
        if (offset > 0) q.setFirstResult(offset);
        if (limit  > 0) q.setMaxResults(limit);
        return q.getResultList();
    }

    @Override
    public List<RDCourseOffering> findBetweenForMentor(LocalDate startInclusive, LocalDate endInclusive,
                                                       Integer mentorUserId, int offset, int limit) {
        if (endInclusive.isBefore(startInclusive)) endInclusive = startInclusive;
        String hql = "from RDCourseOffering o " +
                     "where o.instructor.userID = :mid " +
                     "  and o.endDate   >= :since " +
                     "  and o.startDate <= :till " +
                     "order by o.startDate asc";
        Query<RDCourseOffering> q = s().createQuery(hql, RDCourseOffering.class)
                                       .setParameter("mid",   mentorUserId)
                                       .setParameter("since", Date.valueOf(startInclusive))
                                       .setParameter("till",  Date.valueOf(endInclusive));
        if (offset > 0) q.setFirstResult(offset);
        if (limit  > 0) q.setMaxResults(limit);
        return q.getResultList();
    }

    /* ===== Convenience aliases / compatibility ===== */

    // Alias if your service has this misnamed signature
    public List<RDCourseOffering> findByDateAndMentor(LocalDate from, LocalDate to) {
        return findBetween(from, to);
    }

    @Override
    public List<RDCourseOffering> getCourseOfferingsBetweenForMentor(LocalDate start, LocalDate end) {
        // No mentor id provided in signature — interpret as unfiltered range
        return getCourseOfferingsBetween(start, end);
    }

    @Override
    public List<RDCourseOffering> getCourseOfferingsBetween(LocalDate start, LocalDate end) {
        if (start == null || end == null) throw new IllegalArgumentException("start and end are required");
        return findBetween(start, end);
    }

    @Override
    public List<RDCourseOffering> getCourseOfferingsBetweenForMentor(LocalDate start, LocalDate end, Integer mentorUserId) {
        if (start == null || end == null) throw new IllegalArgumentException("start and end are required");
        if (mentorUserId == null) throw new IllegalArgumentException("mentorUserId is required");
        return findBetweenForMentor(start, end, mentorUserId);
    }

    // Another odd overload in your interface; interpret as range without mentor
    @Override
    public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, LocalDate to) {
        if (selectedDate == null || to == null) throw new IllegalArgumentException("from/to are required");
        return findBetween(selectedDate, to);
    }

    /* ====================== Calendar / Filter helpers ====================== */

    @Override
    public List<RDCourseOffering> getFilteredOfferings(Long courseId, Long mentorId, String status) {
        StringBuilder hql = new StringBuilder("from RDCourseOffering o where 1=1 ");
        if (courseId != null) hql.append("and o.course.courseId = :cid ");
        if (mentorId != null) hql.append("and o.instructor.userID = :mid ");
        if (status != null && !status.trim().isEmpty()) hql.append("and o.status = :status ");
        hql.append("order by o.startDate asc");

        Query<RDCourseOffering> q = s().createQuery(hql.toString(), RDCourseOffering.class);
        if (courseId != null) q.setParameter("cid", courseId.intValue());
        if (mentorId != null) q.setParameter("mid", mentorId.intValue());
        if (status != null && !status.trim().isEmpty()) q.setParameter("status", status.trim());
        return q.getResultList();
    }

    @Override
    public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId) {
        final String hql =
            "select new com.robodynamics.dto.RDCourseOfferingSummaryDTO(" +
            "  c.courseId, " +
            "  c.courseName, " +
            "  o.courseOfferingId, " +
            "  o.courseOfferingName, " +
            "  concat(coalesce(m.firstName, ''), " +
            "         case when m.lastName is null or m.lastName = '' then '' else concat(' ', m.lastName) end), " +
            "  o.startDate, " +
            "  o.endDate, " +
            "  o.status, " +
            "  count(distinct e.enrollmentId) " +
            ") " +
            "from com.robodynamics.model.RDCourseOffering o " +
            "  join o.course c " +
            "  left join o.instructor m " +
            "  join o.studentEnrollments e " +
            "  join e.student s " +
            "  left join s.mom mom " +
            "  left join s.dad dad " +
            "where (mom.userID = :parentId or dad.userID = :parentId) " +
            "group by c.courseId, c.courseName, " +
            "         o.courseOfferingId, o.courseOfferingName, " +
            "         m.firstName, m.lastName, " +
            "         o.startDate, o.endDate, o.status " +
            "order by o.startDate desc";

        return s().createQuery(hql, RDCourseOfferingSummaryDTO.class)
                  .setParameter("parentId", parentId)
                  .getResultList();
    }

    /* ====================== Utility ====================== */

    private static <K, V> List<V> dedupPreserveOrder(List<V> items, Function<V, K> keyFn) {
        Map<K, V> map = new LinkedHashMap<>();
        for (V v : items) map.put(keyFn.apply(v), v);
        return List.copyOf(map.values());
    }

    @Override
    public List<RDCourseOffering> findOfferingsForMentorIntersecting(Integer mentorId,
                                                                     LocalDate since,
                                                                     LocalDate to) {
        if (mentorId == null || since == null || to == null) return Collections.emptyList();
        if (to.isBefore(since)) to = since;

        String hql = "from RDCourseOffering o " +
                     "where o.instructor.userID = :mid " +
                     "  and o.endDate   >= :since " +
                     "  and o.startDate <= :till " +
                     "order by o.startDate asc";

        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("mid",   mentorId)
                  .setParameter("since", java.sql.Date.valueOf(since))
                  .setParameter("till",  java.sql.Date.valueOf(to))
                  .getResultList();
    }

    @Override
    public List<RDCourseOffering> findOfferingsForMentorIntersecting(LocalDate selectedDate,
                                                                     Integer userId) {
        if (selectedDate == null || userId == null) return Collections.emptyList();
        // Delegate to your existing day+mentor method to avoid duplicate logic.
        return getCourseOfferingsByDateAndMentor(selectedDate, userId);
    }

    @Override
    public List<RDCourseOffering> findFiltered(Long courseId, Long mentorId, String status) {
        StringBuilder hql = new StringBuilder("from RDCourseOffering o where 1=1 ");
        if (courseId != null) hql.append("and o.course.courseId = :cid ");
        if (mentorId != null) hql.append("and o.instructor.userID = :mid ");
        if (! (status == null || status.trim().isEmpty())) hql.append("and o.status = :status ");
        hql.append("order by o.startDate asc");

        var q = s().createQuery(hql.toString(), RDCourseOffering.class);
        if (courseId != null) q.setParameter("cid", courseId.intValue());
        if (mentorId != null) q.setParameter("mid", mentorId.intValue());
        if (! (status == null || status.trim().isEmpty())) q.setParameter("status", status.trim());
        return q.getResultList();
    }

}
