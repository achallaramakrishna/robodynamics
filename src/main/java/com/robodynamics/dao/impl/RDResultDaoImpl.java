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

import com.robodynamics.dao.RDResultDao;
import com.robodynamics.model.RDQuizResult;

@Repository
@Transactional
public class RDResultDaoImpl implements RDResultDao {
	
	@Autowired
	private SessionFactory factory;


	@Override
	public void saveRDResult(RDQuizResult rdResult) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdResult);

	}

	@Override
	public RDQuizResult getRDResult(int resultId) {
		Session session = factory.getCurrentSession();
		RDQuizResult rdResult = session.get(RDQuizResult.class, resultId);
        return rdResult;
	}

	@Override
	public List<RDQuizResult> getRDResults() {
	       Session session = factory.getCurrentSession();
	        CriteriaBuilder cb = session.getCriteriaBuilder();
	        CriteriaQuery < RDQuizResult > cq = cb.createQuery(RDQuizResult.class);
	        Root < RDQuizResult > root = cq.from(RDQuizResult.class);
	        cq.select(root);
	        Query query = session.createQuery(cq);
	        return query.getResultList();
	}

	@Override
	public void deleteRDResult(int id) {
	       Session session = factory.getCurrentSession();
	       RDQuizResult rdResult = session.byId(RDQuizResult.class).load(id);
	       session.delete(rdResult);

	}

}
