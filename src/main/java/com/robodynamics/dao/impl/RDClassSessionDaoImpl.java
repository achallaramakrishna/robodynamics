package com.robodynamics.dao.impl;

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

@Repository
@Transactional
public class RDClassSessionDaoImpl implements RDClassSessionDao {

	@Autowired
	private SessionFactory factory;

	
	
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

}
