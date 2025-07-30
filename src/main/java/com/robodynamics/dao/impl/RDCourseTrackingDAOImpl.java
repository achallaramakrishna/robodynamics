package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDCourseTrackingDAO;
import com.robodynamics.model.RDCourseTracking;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDCourseTrackingDAOImpl implements RDCourseTrackingDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void saveTracking(RDCourseTracking trackingEntry) {
        getCurrentSession().saveOrUpdate(trackingEntry);
    }

    @Override
    public RDCourseTracking getTrackingById(int trackingId) {
        return getCurrentSession().get(RDCourseTracking.class, trackingId);
    }

    @Override
    public List<RDCourseTracking> getTrackingByStudent(int studentId) {
        Query<RDCourseTracking> query = getCurrentSession().createQuery(
                "FROM RDCourseTracking WHERE user_id = :studentId", RDCourseTracking.class);
        query.setParameter("studentId", studentId);
        return query.getResultList();
    }

    @Override
    public List<RDCourseTracking> getTrackingByCourseSession(int courseSessionId) {
        Query<RDCourseTracking> query = getCurrentSession().createQuery(
                "FROM RDCourseTracking WHERE course_session_id = :courseSessionId", RDCourseTracking.class);
        query.setParameter("courseSessionId", courseSessionId);
        return query.getResultList();
    }

    @Override
    public List<RDCourseTracking> getAllTrackingEntries() {
        return getCurrentSession().createQuery("FROM RDCourseTracking", RDCourseTracking.class).getResultList();
    }

	@Override
	public List<RDCourseTracking> getTrackingByStudentAndOffering(int studentId, int courseOfferingId) {
		return sessionFactory.getCurrentSession()
                .createQuery("FROM RDCourseTracking t WHERE t.student.userID = :studentId AND t.courseOffering.courseOfferingId = :courseOfferingId")
                .setParameter("studentId", studentId)
                .setParameter("courseOfferingId", courseOfferingId)
                .list();
	}

	@Override
	public List<RDCourseTracking> getTrackingByEnrollmentId(int studentEnrollmentId) {
		String hql = "FROM RDCourseTracking t WHERE t.studentEnrollment.enrollmentId = :studentEnrollmentId";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDCourseTracking.class)
                .setParameter("studentEnrollmentId", studentEnrollmentId)
                .getResultList();
	}

	@Override
	public void update(RDCourseTracking tracking) {
		sessionFactory.getCurrentSession().update(tracking);
		
	}

	@Override
	public void delete(int trackingId) {
		 RDCourseTracking tracking = sessionFactory.getCurrentSession().get(RDCourseTracking.class, trackingId);
	        if (tracking != null) {
	            sessionFactory.getCurrentSession().delete(tracking);
	        }
		
	}

    // ✅ New method to fetch tracking by Class Session
    public List<RDCourseTracking> getTrackingByClassSession(int classSessionId) {
        String hql = "FROM RDCourseTracking t WHERE t.classSession.classSessionId = :classSessionId";
        Query<RDCourseTracking> query = getCurrentSession().createQuery(hql, RDCourseTracking.class);
        query.setParameter("classSessionId", classSessionId);
        return query.getResultList();
    }

    @Override
    public void save(RDCourseTracking tracking) {
        sessionFactory.getCurrentSession().saveOrUpdate(tracking);
    }

    @Override
    public List<RDCourseTracking> getTrackingsByStudent(int studentId) {
        String hql = "FROM RDCourseTracking t WHERE t.enrollment.student.userId = :studentId";
        Query<RDCourseTracking> query = sessionFactory.getCurrentSession()
                .createQuery(hql, RDCourseTracking.class);
        query.setParameter("studentId", studentId);
        return query.getResultList();
    }

    @Override
    public List<RDCourseTracking> getTrackingsByCourseSession(int courseSessionId) {
        String hql = "FROM RDCourseTracking t WHERE t.courseSession.courseSessionId = :sessionId";
        Query<RDCourseTracking> query = sessionFactory.getCurrentSession()
                .createQuery(hql, RDCourseTracking.class);
        query.setParameter("sessionId", courseSessionId);
        return query.getResultList();
    }

    @Override
    public List<RDCourseTracking> getTrackingsByClassSession(int classSessionId) {
        String hql = "FROM RDCourseTracking t WHERE t.classSession.classSessionId = :classSessionId";
        Query<RDCourseTracking> query = sessionFactory.getCurrentSession()
                .createQuery(hql, RDCourseTracking.class);
        query.setParameter("classSessionId", classSessionId);
        return query.getResultList();
    }

	
}
