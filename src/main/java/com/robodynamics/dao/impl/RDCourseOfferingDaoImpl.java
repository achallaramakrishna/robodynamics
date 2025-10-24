package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dto.RDCourseOfferingDTO;
import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import com.robodynamics.model.RDCourseOffering;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.NoResultException;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
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
        String hql = "from RDCourseOffering where isActive = true order by startDate asc";
        return s().createQuery(hql, RDCourseOffering.class).getResultList();
    }

    @Override
    public void deleteRDCourseOffering(int id) {
        RDCourseOffering o = s().byId(RDCourseOffering.class).load(id);
        s().delete(o);
    }

    /* ====================== Activation / Deactivation ====================== */

    @Override
    public void deactivateCourseOffering(int id) {
        String hql = "update RDCourseOffering set isActive = false where courseOfferingId = :id";
        s().createQuery(hql)
          .setParameter("id", id)
          .executeUpdate();
    }

    @Override
    public void activateCourseOffering(int id) {
        String hql = "update RDCourseOffering set isActive = true where courseOfferingId = :id";
        s().createQuery(hql)
          .setParameter("id", id)
          .executeUpdate();
    }

    @Override
    public List<RDCourseOffering> getAllCourseOfferings(boolean includeInactive) {
        String hql = includeInactive
                ? "from RDCourseOffering order by startDate asc"
                : "from RDCourseOffering where isActive = true order by startDate asc";
        return s().createQuery(hql, RDCourseOffering.class).getResultList();
    }

    /* ====================== Mentor / Course Queries ====================== */

    @Override
    public List<RDCourseOffering> getRDCourseOfferingsList(int userId) {
        try {
            String hql = "from RDCourseOffering where instructor.userID = :userId and isActive = true order by startDate asc";
            return s().createQuery(hql, RDCourseOffering.class)
                      .setParameter("userId", userId)
                      .getResultList();
        } catch (NoResultException e) {
            return Collections.emptyList();
        }
    }

    @Override
    public RDCourseOffering getOnlineCourseOffering(int courseId) {
        String hql = "from RDCourseOffering co where co.course.courseId = :courseId and co.isActive = true";
        List<RDCourseOffering> results = s().createQuery(hql, RDCourseOffering.class)
                                            .setParameter("courseId", courseId)
                                            .getResultList();
        return results.isEmpty() ? null : results.get(0);
    }

    @Override
    public List<RDCourseOffering> getRDCourseOfferingsListByCourse(int courseId) {
        String hql = "from RDCourseOffering co " +
                     "JOIN FETCH co.instructor " +  // Eagerly fetch instructor
                     "where co.course.courseId = :courseId and co.isActive = true " +
                     "order by co.startDate asc";
        return s().createQuery(hql, RDCourseOffering.class)
                 .setParameter("courseId", courseId)
                 .getResultList();
    }


    @Override
    public List<RDCourseOffering> getCourseOfferingsByMentor(int userID) {
        String hql = "SELECT DISTINCT co FROM RDCourseOffering co " +
                     "LEFT JOIN FETCH co.studentEnrollments es " +
                     "WHERE co.instructor.userID = :mentorId AND co.isActive = true " +
                     "ORDER BY co.startDate ASC";
        return s().createQuery(hql, RDCourseOffering.class)
                 .setParameter("mentorId", userID)
                 .getResultList();
    }

    /* ====================== Day-of-week / Daily lookups ====================== */

    @Override
    public List<RDCourseOffering> getCourseOfferingsByDate(LocalDate selectedDate) {
        Session session = factory.getCurrentSession();

        String shortDay = selectedDate.getDayOfWeek()
                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                .toLowerCase(Locale.ROOT);

        String hql = "from RDCourseOffering c " +
                     "left join fetch c.course " +
                     "left join fetch c.instructor " +
                     "where c.isActive = true " +
                     "and (c.startDate is null or c.startDate <= :date) " +
                     "and (c.endDate is null or c.endDate >= :date) " +
                     "and lower(replace(c.daysOfWeek, ' ', '')) like :dayOfWeek " +
                     "order by c.sessionStartTime asc";

        return session.createQuery(hql, RDCourseOffering.class)
                .setParameter("date", java.sql.Date.valueOf(selectedDate))
                .setParameter("dayOfWeek", "%" + shortDay + "%")
                .getResultList();
    }


    @Override
    public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, Integer mentorId) {
        Session session = factory.getCurrentSession();

        String shortDay = selectedDate.getDayOfWeek()
                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                .toLowerCase(Locale.ROOT);

        String hql = "from RDCourseOffering c " +
                     "left join fetch c.course " +
                     "left join fetch c.instructor m " +
                     "where c.isActive = true " +
                     "and (c.startDate is null or c.startDate <= :date) " +
                     "and (c.endDate is null or c.endDate >= :date) " +
                     "and lower(replace(c.daysOfWeek, ' ', '')) like :dayOfWeek ";

        // ✅ Fix: Use mentorId instead of userID
        if (mentorId != null) {
            hql += "and (m.userID = :mentorId or c.mentor.mentorId = :mentorId) ";
        }

        hql += "order by c.sessionStartTime asc";

        Query<RDCourseOffering> query = session.createQuery(hql, RDCourseOffering.class)
                .setParameter("date", java.sql.Date.valueOf(selectedDate))
                .setParameter("dayOfWeek", "%" + shortDay + "%");

        if (mentorId != null) {
            query.setParameter("mentorId", mentorId);
        }

        return query.getResultList();
    }



    /* ====================== Date overlap (safe, DATE-only) ====================== */

    @Override
    public List<RDCourseOffering> findByDate(LocalDate date) {
        String hql = "from RDCourseOffering o " +
                     "where o.isActive = true and o.startDate <= :d and o.endDate >= :d order by o.startDate asc";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("d", Date.valueOf(date))
                  .getResultList();
    }

    @Override
    public List<RDCourseOffering> findByDateAndMentor(LocalDate date, Integer mentorUserId) {
        String hql = "from RDCourseOffering o " +
                     "where o.isActive = true and o.instructor.userID = :mid " +
                     "and o.startDate <= :d and o.endDate >= :d order by o.startDate asc";
        return s().createQuery(hql, RDCourseOffering.class)
                  .setParameter("mid", mentorUserId)
                  .setParameter("d", Date.valueOf(date))
                  .getResultList();
    }

    
    /* ====================== Filtered / Calendar ====================== */

    @Override
    public List<RDCourseOffering> getFilteredOfferings(Long courseId, Long mentorId, String status) {
        StringBuilder hql = new StringBuilder("from RDCourseOffering o where o.isActive = true ");
        if (courseId != null) hql.append("and o.course.courseId = :cid ");
        if (mentorId != null) hql.append("and o.instructor.userID = :mid ");
        hql.append("order by o.startDate asc");
        Query<RDCourseOffering> q = s().createQuery(hql.toString(), RDCourseOffering.class);
        if (courseId != null) q.setParameter("cid", courseId.intValue());
        if (mentorId != null) q.setParameter("mid", mentorId.intValue());
        return q.getResultList();
    }

    @Override
    public List<RDCourseOffering> findFiltered(Long courseId, Long mentorId, String status) {
        StringBuilder hql = new StringBuilder("from RDCourseOffering o where o.isActive = true ");
        if (courseId != null) hql.append("and o.course.courseId = :cid ");
        if (mentorId != null) hql.append("and o.instructor.userID = :mid ");
        hql.append("order by o.startDate asc");
        Query<RDCourseOffering> q = s().createQuery(hql.toString(), RDCourseOffering.class);
        if (courseId != null) q.setParameter("cid", courseId.intValue());
        if (mentorId != null) q.setParameter("mid", mentorId.intValue());
        return q.getResultList();
    }

    /* ====================== Parent View (Summary) ====================== */

    @Override
    public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId) {
        if (parentId == null) return Collections.emptyList();
        String hql =
            "select new com.robodynamics.dto.RDCourseOfferingSummaryDTO(" +
            "  c.courseId, c.courseName, o.courseOfferingId, o.courseOfferingName, " +
            "  concat(coalesce(m.firstName, ''), case when m.lastName is null or m.lastName = '' then '' else concat(' ', m.lastName) end), " +
            "  o.startDate, o.endDate, " +
            "  case when o.isActive = true then 'Active' else 'Inactive' end, " +
            "  count(distinct e.enrollmentId)) " +
            "from com.robodynamics.model.RDCourseOffering o " +
            "join o.course c left join o.instructor m " +
            "join o.studentEnrollments e join e.student s " +
            "left join s.mom mom left join s.dad dad " +
            "where (mom.userID = :parentId or dad.userID = :parentId) and o.isActive = true " +
            "group by c.courseId, c.courseName, o.courseOfferingId, o.courseOfferingName, m.firstName, m.lastName, o.startDate, o.endDate, o.isActive " +
            "order by o.startDate desc";
        return s().createQuery(hql, RDCourseOfferingSummaryDTO.class)
                  .setParameter("parentId", parentId)
                  .getResultList();
    }

    @Override
    public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId, boolean includeInactive) {
        if (parentId == null) return Collections.emptyList();
        String hql =
            "select new com.robodynamics.dto.RDCourseOfferingSummaryDTO(" +
            "  c.courseId, c.courseName, o.courseOfferingId, o.courseOfferingName, " +
            "  concat(coalesce(m.firstName, ''), case when m.lastName is null or m.lastName = '' then '' else concat(' ', m.lastName) end), " +
            "  o.startDate, o.endDate, " +
            "  case when o.isActive = true then 'Active' else 'Inactive' end, " +
            "  count(distinct e.enrollmentId)) " +
            "from com.robodynamics.model.RDCourseOffering o " +
            "join o.course c left join o.instructor m " +
            "join o.studentEnrollments e join e.student s " +
            "left join s.mom mom left join s.dad dad " +
            "where (mom.userID = :parentId or dad.userID = :parentId) " +
            (includeInactive ? "" : "and o.isActive = true ") +
            "group by c.courseId, c.courseName, o.courseOfferingId, o.courseOfferingName, m.firstName, m.lastName, o.startDate, o.endDate, o.isActive " +
            "order by o.startDate desc";
        return s().createQuery(hql, RDCourseOfferingSummaryDTO.class)
                  .setParameter("parentId", parentId)
                  .getResultList();
    }

    /* ====================== Overlapping Queries ====================== */

  
    /* ====================== Mentor Intersect ====================== */

    @Override
    public List<RDCourseOffering> findOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to) {
    	System.out.println("[DAO] Fetching offerings for mentorId=" + mentorId + " between " + since + " .. " + to);

        String hql =
            "from RDCourseOffering o " +
            "left join fetch o.course " +
            "left join fetch o.instructor " +
            "where o.instructor.userID = :mentorId " +
            "and (o.startDate is null or o.startDate <= :to) " +
            "and (o.endDate   is null or o.endDate   >= :since) " +
            "order by o.course.courseId, o.courseOfferingId";

        org.hibernate.query.Query<?> q = s().createQuery(hql);
        q.setParameter("mentorId", mentorId);
        q.setParameter("since", java.sql.Timestamp.valueOf(since.atStartOfDay()));
        q.setParameter("to", java.sql.Timestamp.valueOf(to.atTime(LocalTime.MAX)));

        List<RDCourseOffering> list = (List<RDCourseOffering>) q.getResultList();

        System.out.println("[DAO] Offerings fetched for mentorId=" + mentorId + ": " + list.size());
        for (RDCourseOffering o : list) {
            String cname = (o.getCourse() != null) ? o.getCourse().getCourseName() : "(no course)";
            System.out.println("   -> Offering ID=" + o.getCourseOfferingId() +
                    " | Name=" + o.getCourseOfferingName() +
                    " | Course=" + cname +
                    " | Start=" + o.getStartDate() +
                    " | End=" + o.getEndDate() +
                    " | Days=" + o.getDaysOfWeek());
        }

        return list;
    }

    @Override
    public List<RDCourseOffering> findOfferingsForMentorIntersecting(LocalDate selectedDate, Integer userId) {
        return getCourseOfferingsByDateAndMentor(selectedDate, userId);
    }

    /* ====================== Utility ====================== */

    private static <K, V> List<V> dedupPreserveOrder(List<V> items, Function<V, K> keyFn) {
        Map<K, V> map = new LinkedHashMap<>();
        for (V v : items) map.put(keyFn.apply(v), v);
        return List.copyOf(map.values());
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
            "and o.isActive = true " +
            "order by o.course.courseId, o.courseOfferingId";

        org.hibernate.query.Query<?> q = s().createQuery(hql);
        q.setParameter("since", java.sql.Timestamp.valueOf(since.atStartOfDay()));
        q.setParameter("to", java.sql.Timestamp.valueOf(to.atTime(LocalTime.MAX)));

        List<RDCourseOffering> list = (List<RDCourseOffering>) q.getResultList();
        System.out.println("[DAO] Offerings fetched: " + list.size());
        for (RDCourseOffering o : list) {
            String cname = (o.getCourse() != null) ? o.getCourse().getCourseName() : "(no course)";
            System.out.println(" -> " + o.getCourseOfferingName() +
                    " | Start=" + o.getStartDate() +
                    " | End=" + o.getEndDate() +
                    " | Course=" + cname +
                    " | Mentor=" + ((o.getInstructor() != null) ? o.getInstructor().getFirstName() : "N/A"));
        }
        return list;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDCourseOffering> getOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to) {
        System.out.println("[DAO] Fetching offerings for mentorId=" + mentorId + " between " + since + " .. " + to);

        String hql =
            "from RDCourseOffering o " +
            "left join fetch o.course " +
            "left join fetch o.instructor " +
            "where o.instructor.userID = :mentorId " +
            "and (o.startDate is null or o.startDate <= :to) " +
            "and (o.endDate is null or o.endDate >= :since) " +
            "and o.isActive = true " +
            "order by o.course.courseId, o.courseOfferingId";

        org.hibernate.query.Query<?> q = s().createQuery(hql);
        q.setParameter("mentorId", mentorId);
        q.setParameter("since", java.sql.Timestamp.valueOf(since.atStartOfDay()));
        q.setParameter("to", java.sql.Timestamp.valueOf(to.atTime(LocalTime.MAX)));

        List<RDCourseOffering> list = (List<RDCourseOffering>) q.getResultList();
        System.out.println("[DAO] Offerings fetched for mentorId=" + mentorId + ": " + list.size());
        for (RDCourseOffering o : list) {
            String cname = (o.getCourse() != null) ? o.getCourse().getCourseName() : "(no course)";
            System.out.println("   -> Offering ID=" + o.getCourseOfferingId() +
                    " | Name=" + o.getCourseOfferingName() +
                    " | Course=" + cname +
                    " | Start=" + o.getStartDate() +
                    " | End=" + o.getEndDate() +
                    " | Days=" + o.getDaysOfWeek());
        }
        return list;
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDCourseOffering> getAllRDCourseOfferings() {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDCourseOffering o " +
                     "LEFT JOIN FETCH o.course " +
                     "LEFT JOIN FETCH o.instructor " +
                     "ORDER BY o.course.courseName ASC, o.courseOfferingName ASC";
        return session.createQuery(hql, RDCourseOffering.class).getResultList();
    }

	

	@Override
	public List<RDCourseOffering> findBetween(LocalDate startInclusive, LocalDate endInclusive, int offset, int limit) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<RDCourseOffering> findBetweenForMentor(LocalDate startInclusive, LocalDate endInclusive,
			Integer mentorUserId, int offset, int limit) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<RDCourseOffering> findActiveByCourseId(int courseId) {
		
        Session session = factory.getCurrentSession();

		return session.createQuery(
	            "select co from RDCourseOffering co " +
	            " left join fetch co.mentor m " +
	            " left join fetch co.instructor i " +
	            " where co.course.courseId=:cid and co.isActive=true " +
	            " order by co.startDate asc", RDCourseOffering.class)
	            .setParameter("cid", courseId)
	            .getResultList();
	}

	@Transactional(readOnly = true)
	public List<RDCourseOfferingDTO> getDTOsByCourse(int courseId) {
		 Session session = factory.getCurrentSession();

	    List<RDCourseOffering> offerings = session.createQuery(
	        "select co from RDCourseOffering co " +
	        " left join fetch co.mentor m " +
	        " left join fetch co.instructor i " +
	        " where co.course.courseId = :courseId and co.isActive = true " +
	        " order by co.startDate asc", 
	        RDCourseOffering.class)
	        .setParameter("courseId", courseId)
	        .getResultList();

	    List<RDCourseOfferingDTO> dtoList = new ArrayList<>();
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

	    for (RDCourseOffering co : offerings) {
	        RDCourseOfferingDTO dto = new RDCourseOfferingDTO();
	        dto.setCourseOfferingId(co.getCourseOfferingId());
	        dto.setCourseOfferingName(co.getCourseOfferingName());
	        dto.setStart(co.getStartDate() != null ? sdf.format(co.getStartDate()) : "N/A");
	        dto.setEnd(co.getEndDate() != null ? sdf.format(co.getEndDate()) : "N/A");
	        dto.setFeeAmount(co.getFeeAmount());

	        // ✅ Mentor fallback to Instructor
	        String mentorName = null;
	        if (co.getMentor() != null && co.getMentor().getFullName() != null) {
	            mentorName = co.getMentor().getFullName();
	        } else if (co.getInstructor() != null && co.getInstructor().getFullName() != null) {
	            mentorName = co.getInstructor().getFullName();
	        } else {
	            mentorName = "Mentor Not Assigned";
	        }
	        dto.setMentorName(mentorName);

	        // ✅ Add time range
	        if (co.getSessionStartTime() != null && co.getSessionEndTime() != null) {
	            dto.setTimeRange(co.getSessionStartTime() + " - " + co.getSessionEndTime());
	        } else {
	            dto.setTimeRange("TBA");
	        }

	        dtoList.add(dto);
	    }
	    return dtoList;
	}

}
