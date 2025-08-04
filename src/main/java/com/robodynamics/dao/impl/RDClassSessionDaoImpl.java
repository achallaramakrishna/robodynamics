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
	public RDClassSession saveRDClassSession(RDClassSession classSession) {
		Session session = factory.getCurrentSession();
        session.saveOrUpdate(classSession); // ✅ Will insert or update automatically
        return classSession;
		
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
	public RDClassSession findByOfferingAndDate(int offeringId, LocalDate sessionDate) {
	    String hql = "FROM RDClassSession cs " +
	                 "WHERE cs.courseOffering.courseOfferingId = :offeringId " +
	                 "AND cs.sessionDate = :sessionDate";
	    return factory.getCurrentSession()
	        .createQuery(hql, RDClassSession.class)
	        .setParameter("offeringId", offeringId)
	        .setParameter("sessionDate", sessionDate)
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
