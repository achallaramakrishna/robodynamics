package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseSessionDetailDao;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;

@Repository
public class RDCourseSessionDetailDaoImpl implements RDCourseSessionDetailDao {

	@Autowired
	private SessionFactory factory;
	
	
	@Override
	public void saveRDCourseSessionDetail(RDCourseSessionDetail rdCourseSessionDetail) {
	    Session session = factory.getCurrentSession();
	    try {
	        session.saveOrUpdate(rdCourseSessionDetail);
	        session.flush(); // Force Hibernate to execute SQL immediately
	        System.out.println("Data has been flushed successfully.");
	    } catch (Exception e) {
	        System.out.println("Error occurred while saving session detail: " + e.getMessage());
	        e.printStackTrace();
	        throw e; // Re-throw the exception to ensure rollback happens if there is an issue
	    }
	}


	@Override
	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId) {
		 Session session = factory.getCurrentSession();
		 RDCourseSessionDetail courseSessionDetail = session.get(RDCourseSessionDetail.class, courseSessionDetailId);
	     return courseSessionDetail;
	}

	@Override
	public List<RDCourseSessionDetail> getRDCourseSessionDetails(int courseId) {
	    Session session = factory.getCurrentSession();
	    System.out.println("hello............................" + courseId);
	    // Native SQL query to get course session details where course_id matches
	    String sql = "SELECT * FROM rd_course_session_details WHERE course_id = :courseId";

	    Query<RDCourseSessionDetail> query = session.createNativeQuery(sql, RDCourseSessionDetail.class);
	    query.setParameter("courseId", courseId);

	    return query.getResultList();
	}

	@Override
	public void deleteRDCourseSessionDetail(int id) {
		Session session = factory.getCurrentSession();
		RDCourseSessionDetail courseSessionDetail = session.byId(RDCourseSessionDetail.class).load(id);
        session.delete(courseSessionDetail);

	}

	@Override
	public List<RDCourseSessionDetail> findSessionDetailsBySessionId(int sessionId) {
		Session session = factory.getCurrentSession();
        Query<RDCourseSessionDetail> query = session.createQuery("FROM RDCourseSessionDetail WHERE courseSession.courseSessionId = :sessionId", RDCourseSessionDetail.class);
        query.setParameter("sessionId", sessionId);
        return query.getResultList();

	}

	@Override
	public void saveAll(List<RDCourseSessionDetail> courseSessionDetailss) {
        Session session = factory.getCurrentSession();
        for (RDCourseSessionDetail sessionDetail : courseSessionDetailss) {
            session.saveOrUpdate(sessionDetail);  // Save or update each session detail in the list
        }
	}

	@Override
	public RDCourseSessionDetail getRDCourseSessionDetailBySessionIdAndDetailId(int sessionId,
			int sessionDetailId) {
		 Session session = factory.getCurrentSession();
		    String hql = "FROM RDCourseSessionDetail csd WHERE csd.courseSession.sessionId = :sessionId AND csd.sessionDetailId = :sessionDetailId";
		    Query<RDCourseSessionDetail> query = session.createQuery(hql, RDCourseSessionDetail.class);
		    query.setParameter("sessionId", sessionId);
		    query.setParameter("sessionDetailId", sessionDetailId);

		    return query.uniqueResult();
	}

	public void flushSession() {
        Session session = factory.getCurrentSession();
        session.flush(); // Forces Hibernate to push SQL to the database
	}


}
