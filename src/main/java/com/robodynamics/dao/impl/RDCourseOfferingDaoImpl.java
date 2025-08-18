package com.robodynamics.dao.impl;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dto.RDCourseOfferingSummaryDTO;

import javax.persistence.NoResultException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;

@Repository
@Transactional
public class RDCourseOfferingDaoImpl implements RDCourseOfferingDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDCourseOffering(RDCourseOffering rdCourseOffering) {

		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCourseOffering);

	}

	@Override
	public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId) {
		Session session = factory.getCurrentSession();
		RDCourseOffering rdCourseOffering = session.get(RDCourseOffering.class, rdCourseOfferingId);
		return rdCourseOffering;
	}

	@Override
	public List<RDCourseOffering> getRDCourseOfferings() {
	    Session session = factory.getCurrentSession();
	    CriteriaBuilder cb = session.getCriteriaBuilder();
	    CriteriaQuery<RDCourseOffering> cq = cb.createQuery(RDCourseOffering.class);
	    Root<RDCourseOffering> root = cq.from(RDCourseOffering.class);

	    // Select all RDCourseOffering entries
	    cq.select(root);

	    // Execute query
	    Query<RDCourseOffering> query = session.createQuery(cq);
	    return query.getResultList();
	}



	@Override
	public void deleteRDCourseOffering(int id) {
		Session session = factory.getCurrentSession();
		RDCourseOffering rdCourseOffering = session.byId(RDCourseOffering.class).load(id);
		session.delete(rdCourseOffering);

	}

	@Override
	public List<RDCourseOffering> getRDCourseOfferingsList(int userId) {
		Session session = factory.getCurrentSession();

		try {
			Query<RDCourseOffering> query = session.createQuery("from RDCourseOffering where user.userID =:userId",
					RDCourseOffering.class);
			query.setParameter("userId", userId);
			List<RDCourseOffering> rdCourseOfferingsList = query.getResultList();
			return rdCourseOfferingsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}

	}

	@Override
	public RDCourseOffering getOnlineCourseOffering(int courseId) {
	    // Get the current Hibernate session
	    Session session = factory.getCurrentSession();
	    System.out.println("Course ID: " + courseId);

	    // HQL query to fetch course offerings based on course type
	    String hql = "FROM RDCourseOffering co WHERE co.course.courseId = :courseId";
	    
	    // Execute query
	    Query<RDCourseOffering> query = session.createQuery(hql, RDCourseOffering.class);
	    query.setParameter("courseId", courseId);

	    // Get the result list
	    List<RDCourseOffering> results = query.getResultList();

	    // If no result found, return null
	    if (results.isEmpty()) {
	        return null;
	    }

	    // Return the first result (assuming one match)
	    return results.get(0);
	}

	@Override
	public List<RDCourseOffering> getRDCourseOfferingsListByCourse(int courseId) {
		// Get the current Hibernate session
        Session session = factory.getCurrentSession();

        // Query to fetch the course offerings based on courseId
        Query<RDCourseOffering> query = session.createQuery("FROM RDCourseOffering WHERE course.courseId = :courseId", RDCourseOffering.class);
        query.setParameter("courseId", courseId);

        // Execute the query and return the result list
        return query.getResultList();
	}

	@Override
	public List<RDCourseOffering> getCourseOfferingsByDate(LocalDate date) {
	    String shortDay = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH); 
	    System.out.println("🔍 Day Filter: " + shortDay);

	    String hql = "FROM RDCourseOffering c " +
	                 "WHERE REPLACE(c.daysOfWeek, ' ', '') LIKE :dayOfWeek " +
	                 "AND c.startDate <= :today " +
	                 "AND c.endDate >= :today";

	    Query<RDCourseOffering> query = factory.getCurrentSession()
	        .createQuery(hql, RDCourseOffering.class);
	    query.setParameter("dayOfWeek", "%" + shortDay + "%");
	    query.setParameter("today", java.sql.Date.valueOf(date));

	    List<RDCourseOffering> results = query.getResultList();
	    System.out.println("✅ Found " + results.size() + " offerings for " + shortDay);

	    results.forEach(offering ->
	        System.out.println("📌 " + offering.getCourseOfferingName() +
	                           " | Days: " + offering.getDaysOfWeek())
	    );

	    return results;
	}


	@Override
	public List<RDCourseOffering> getFilteredOfferings(Long courseId, Long mentorId, String status) {
        Session session = factory.getCurrentSession();

        StringBuilder hql = new StringBuilder("FROM RDCourseOffering o WHERE 1=1");

        if (courseId != null) {
            hql.append(" AND o.course.courseId = :courseId");
        }
        if (mentorId != null) {
            hql.append(" AND o.instructor.userID = :mentorId");
        }
        if (status != null && !status.isEmpty()) {
            hql.append(" AND o.status = :status");
        }

        Query<RDCourseOffering> query = session.createQuery(hql.toString(), RDCourseOffering.class);

        if (courseId != null) {
            query.setParameter("courseId", courseId);
        }
        if (mentorId != null) {
            query.setParameter("mentorId", mentorId);
        }
        if (status != null && !status.isEmpty()) {
            query.setParameter("status", status);
        }

        return query.getResultList();
    }

	@Override
	public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId) {
	    Session session = factory.getCurrentSession();

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
	            "  left join o.instructor m " +        // <-- your mapped relation on RDCourseOffering
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

	        Query<RDCourseOfferingSummaryDTO> q =
	            session.createQuery(hql, RDCourseOfferingSummaryDTO.class);
	        q.setParameter("parentId", parentId);
	        return q.getResultList();
	}

	
	public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, Integer userId) {
	    String shortDay = selectedDate.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

	    String hql =
	        "FROM RDCourseOffering c " +
	        "LEFT JOIN FETCH c.course " +
	        "LEFT JOIN FETCH c.instructor m " +
	        "WHERE REPLACE(c.daysOfWeek, ' ', '') LIKE :dayOfWeek " +
	        "AND c.startDate <= :theDate " +
	        "AND c.endDate   >= :theDate " +
	        "AND m IS NOT NULL AND m.userID = :mentorId " +
	        "ORDER BY c.startDate DESC";
	    // ✅ Convert LocalDate -> java.sql.Date for a DATE column
        Date date = Date.from(selectedDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

	    return factory.getCurrentSession()
	        .createQuery(hql, RDCourseOffering.class)
	        .setParameter("dayOfWeek", "%" + shortDay + "%")
	        .setParameter("theDate", date)           
	        .setParameter("mentorId", userId)
	        .getResultList();
	}

	    
	    public List<RDCourseOffering> findOfferingsIntersecting(LocalDate since, LocalDate to) {
	        // Overlap window: offering.endDate >= since AND offering.startDate <= to
	        String hql = "from RDCourseOffering o " +
	                     "where o.endDate >= :since " +
	                     "  and o.startDate <= :to " +
	                     "order by o.startDate asc";
	    
	     // ✅ Convert LocalDate -> java.sql.Date for a DATE column
	        Date sinceDate = Date.from(since.atStartOfDay(ZoneId.systemDefault()).toInstant());
	        
	        Date toDate = Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant());
	        
	        Session session = factory.getCurrentSession();
	        Query<RDCourseOffering> q = session.createQuery(hql, RDCourseOffering.class);
	        q.setParameter("since", sinceDate);
	        q.setParameter("to", toDate);
	        return q.getResultList();
	    }

	    
	    
	    public List<RDCourseOffering> findOfferingsForMentorIntersecting(int mentorId, LocalDate since, LocalDate to) {
	        String hql = "from RDCourseOffering o " +
	                     "where o.instructor.userID = :mentorId " +
	                     "  and o.endDate >= :since " +
	                     "  and o.startDate <= :to " +
	                     "order by o.startDate asc";

	     // ✅ Convert LocalDate -> java.sql.Date for a DATE column
	        Date sinceDate = Date.from(since.atStartOfDay(ZoneId.systemDefault()).toInstant());
	        
	        Date toDate = Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant());
	        
	        
	        Session session = factory.getCurrentSession();
	        Query<RDCourseOffering> q = session.createQuery(hql, RDCourseOffering.class);
	        q.setParameter("mentorId", mentorId);
	        q.setParameter("since", sinceDate);
	        q.setParameter("to", toDate);
	        return q.getResultList();
	    }

		@Override
		public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate since, LocalDate to) {
			// Overlap window: offering.endDate >= since AND offering.startDate <= to
	        String hql = "from RDCourseOffering o " +
	                     "where o.endDate >= :since " +
	                     "  and o.startDate <= :to " +
	                     "order by o.startDate asc";
	        Session session = factory.getCurrentSession();
	        
	        Date sinceDate = Date.from(since.atStartOfDay(ZoneId.systemDefault()).toInstant());
	        
		       
	        Date toDate = Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant());
	        
		       
			Query<RDCourseOffering> q = session.createQuery(hql, RDCourseOffering.class);
	        q.setParameter("since", sinceDate);
	        q.setParameter("to", toDate);
	        return q.getResultList();
		}

		@Override
		public List<RDCourseOffering> findOfferingsForMentorIntersecting(Integer mentorId, LocalDate since,
				LocalDate to) {
			String hql = "from RDCourseOffering o " +
                    "where o.instructor.userID = :mentorId " +
                    "  and o.endDate >= :since " +
                    "  and o.startDate <= :to " +
                    "order by o.startDate asc";
       Session session = factory.getCurrentSession();
       
       Date sinceDate = Date.from(since.atStartOfDay(ZoneId.systemDefault()).toInstant());
       
       
       Date toDate = Date.from(to.atStartOfDay(ZoneId.systemDefault()).toInstant());
       
       
       Query<RDCourseOffering> q = session.createQuery(hql, RDCourseOffering.class);
       q.setParameter("mentorId", mentorId);
       q.setParameter("since", sinceDate);
       q.setParameter("to", toDate);
       return q.getResultList();
		}

		@Override
		public List<RDCourseOffering> findOfferingsForMentorIntersecting(LocalDate selectedDate, Integer userId) {
			 // Build the short day token (e.g., "Mon", "Tue")
		    String shortDay = selectedDate.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
		    System.out.println("🔍 Day Filter (mentor): " + shortDay + " | mentorUserId=" + userId);

		    // HQL:
		    // - Match the day within comma-separated daysOfWeek (spaces removed)
		    // - Active on the selected date
		    // - Belongs to the given mentor
		    String hql =
		        "FROM RDCourseOffering c " +
		        "LEFT JOIN FETCH c.course " +                // eager course (optional)
		        "LEFT JOIN FETCH c.instructor m " +             // eager mentor (optional)
		        "WHERE REPLACE(c.daysOfWeek, ' ', '') LIKE :dayOfWeek " +
		        "AND c.startDate <= :theDate " +
		        "AND c.endDate   >= :theDate " +
		        "AND m IS NOT NULL AND m.userID = :mentorId " +
		        "ORDER BY c.startDate DESC";

		    Date date = Date.from(selectedDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
	        
		       
		    Query<RDCourseOffering> query = factory.getCurrentSession()
		        .createQuery(hql, RDCourseOffering.class)
		        .setParameter("dayOfWeek", "%" + shortDay + "%")
		        .setParameter("theDate", java.sql.Date.valueOf(selectedDate))
		        .setParameter("mentorId", userId);

		    List<RDCourseOffering> results = query.getResultList();

		    System.out.println("✅ Found " + results.size() + " mentor offerings for " + shortDay);
		    results.forEach(o ->
		        System.out.println("📌 " + o.getCourseOfferingName() +
		                           " | Days: " + o.getDaysOfWeek())
		    );

		    return results;
		}

		
	




}