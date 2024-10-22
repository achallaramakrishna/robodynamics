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
	@Transactional
	public void saveRDCourseSessionDetail(RDCourseSessionDetail rdCourseSessionDetail) {
	    Session session = factory.getCurrentSession();
	    try {
	        session.saveOrUpdate(rdCourseSessionDetail);
	    } catch (Exception e) {
	        System.out.println("Error occurred while saving session detail: " + e.getMessage());
	        e.printStackTrace();
	        throw e; // Re-throw the exception to ensure rollback happens if there is an issue
	    }
	}


	@Override
	@Transactional
	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId) {
		 Session session = factory.getCurrentSession();
		 RDCourseSessionDetail courseSessionDetail = session.get(RDCourseSessionDetail.class, courseSessionDetailId);
	     return courseSessionDetail;
	}

	@Override
	@Transactional
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
	@Transactional
	public void deleteRDCourseSessionDetail(int id) {
		Session session = factory.getCurrentSession();
		RDCourseSessionDetail courseSessionDetail = session.byId(RDCourseSessionDetail.class).load(id);
        session.delete(courseSessionDetail);

	}

	@Override
	@Transactional
	public List<RDCourseSessionDetail> findSessionDetailsBySessionId(int sessionId) {
		Session session = factory.getCurrentSession();
        Query<RDCourseSessionDetail> query = session.createQuery("FROM RDCourseSessionDetail WHERE courseSession.courseSessionId = :sessionId", RDCourseSessionDetail.class);
        query.setParameter("sessionId", sessionId);
        return query.getResultList();

	}

	@Override
	@Transactional
	public void saveAll(List<RDCourseSessionDetail> courseSessionDetailss) {
        Session session = factory.getCurrentSession();
        for (RDCourseSessionDetail sessionDetail : courseSessionDetailss) {
            session.saveOrUpdate(sessionDetail);  // Save or update each session detail in the list
        }
	}

	@Override
	@Transactional
	public RDCourseSessionDetail getRDCourseSessionDetailByIdAndDetailId(int courseSessionId,
			int sessionDetailId) {
		 Session session = factory.getCurrentSession();
		    String hql = "FROM RDCourseSessionDetail csd WHERE csd.courseSession.courseSessionId = :courseSessionId AND csd.sessionDetailId = :sessionDetailId";
		    Query<RDCourseSessionDetail> query = session.createQuery(hql, RDCourseSessionDetail.class);
		    query.setParameter("courseSessionId", courseSessionId);
		    query.setParameter("sessionDetailId", courseSessionId);

		    return query.uniqueResult();
	}

}
