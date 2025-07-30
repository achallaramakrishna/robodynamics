package com.robodynamics.dao.impl;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDClassSessionDao;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDCourseTracking;
import com.robodynamics.service.RDCourseOfferingService;

@Repository
@Transactional
public class RDClassSessionDaoImpl implements RDClassSessionDao {

	@Autowired
	private SessionFactory factory;
	
	@Autowired
	private RDCourseOfferingService rdCourseOfferingService;

	
	
	@Override
	public void saveRDClassSession(RDClassSession classSession) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(classSession);

		
	}



	@Override
	public RDClassSession getRDClassSession(int classSessionId) {
		Session session = factory.getCurrentSession();
		RDClassSession classSession = session.get(RDClassSession.class, classSessionId);
		return classSession;

	}



	@Override
	public List<RDClassSession> getRDClassSessions() {
		Session session = factory.getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<RDClassSession> cq = cb.createQuery(RDClassSession.class);
		Root<RDClassSession> root = cq.from(RDClassSession.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}



	@Override
	public void deleteRDClassSession(int id) {
		Session session = factory.getCurrentSession();
		RDClassSession classSession = session.byId(RDClassSession.class).load(id);
		session.delete(classSession);
		
	}



	@Override
	public List<RDClassSession> findByCourseOffering(RDCourseOffering courseOffering) {
		return (List<RDClassSession>) factory.getCurrentSession()
				.createQuery("from RDClassSession where courseOffering = :courseOffering")
				.setParameter("courseOffering", courseOffering).list();
	}



	@Override
	public RDClassSession getOrCreateTodaySession(int courseOfferingId) {
		  Date today = java.sql.Date.valueOf(LocalDate.now());

	        Session session = factory.getCurrentSession();
	        RDClassSession classSession = (RDClassSession) session.createQuery(
	            "FROM RDClassSession " +
	            "WHERE courseOffering.courseOfferingId = :offeringId " +
	            "AND sessionDate = :today")
	            .setParameter("offeringId", courseOfferingId)
	            .setParameter("today", today)
	            .uniqueResult();

	        if (classSession == null) {
	            classSession = new RDClassSession();
	            classSession.setCourseOffering(rdCourseOfferingService.getRDCourseOffering(courseOfferingId));
	            classSession.setSessionDate(today);
	            classSession.setSessionTitle("Auto-generated Session");
	            classSession.setSessionDescription("Created automatically for attendance");

	            session.save(classSession);
	        }

	        return classSession;
	    }



	@Override
	public RDClassSession findByOfferingAndDate(int offeringId, Date date) {
	    String hql = "FROM RDClassSession cs " +
	                 "WHERE cs.courseOffering.id = :offeringId " +
	                 "AND cs.sessionDate = :sessionDate";
	    return factory.getCurrentSession()
	        .createQuery(hql, RDClassSession.class)
	        .setParameter("offeringId", offeringId)
	        .setParameter("sessionDate", date)
	        .uniqueResult();
	}



	 // ✅ New Methods Implementation

    @Override
    public List<RDCourseTracking> getTrackingsByClassSession(int classSessionId) {
        String hql = "FROM RDCourseTracking t WHERE t.classSession.classSessionId = :classSessionId";
        return factory.getCurrentSession()
                .createQuery(hql, RDCourseTracking.class)
                .setParameter("classSessionId", classSessionId)
                .list();
    }

    @Override
    public List<RDClassSession> getClassSessionsWithTracking(int courseOfferingId) {
        String hql = "SELECT DISTINCT cs FROM RDClassSession cs " +
                     "JOIN cs.courseTrackings t " +
                     "WHERE cs.courseOffering.courseOfferingId = :courseOfferingId";
        return factory.getCurrentSession()
                .createQuery(hql, RDClassSession.class)
                .setParameter("courseOfferingId", courseOfferingId)
                .list();
    }

    @Override
    public List<RDClassSession> getClassSessionsWithoutTracking(int courseOfferingId) {
        String hql = "FROM RDClassSession cs " +
                     "WHERE cs.courseOffering.courseOfferingId = :courseOfferingId " +
                     "AND cs.classSessionId NOT IN (" +
                     "   SELECT DISTINCT t.classSession.classSessionId FROM RDCourseTracking t " +
                     "   WHERE t.classSession IS NOT NULL" +
                     ")";
        return factory.getCurrentSession()
                .createQuery(hql, RDClassSession.class)
                .setParameter("courseOfferingId", courseOfferingId)
                .list();
    }

}
