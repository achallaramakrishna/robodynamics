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

import com.robodynamics.dao.RDQuizTestDao;
import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDQuizTest;

@Repository
@Transactional
public class RDQuizTestDaoImpl implements RDQuizTestDao {
	
	@Autowired
	private SessionFactory factory;

	@Override
	public RDQuizTest saveRDQuizTest(RDQuizTest rdQuizTest) {
		
		Session session = factory.getCurrentSession();
		return (RDQuizTest) session.merge(rdQuizTest);

	}

	@Override
	public RDQuizTest getRDQuizTest(int quizTestId) {
		Session session = factory.getCurrentSession();
		RDQuizTest rdQuizTest = session.get(RDQuizTest.class, quizTestId);
        return rdQuizTest;
	}

	@Override
	public List<RDQuizTest> getRDQuizTests() {
		Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDQuizTest > cq = cb.createQuery(RDQuizTest.class);
        Root < RDQuizTest > root = cq.from(RDQuizTest.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}

	@Override
	public void deleteRDQuizTest(int id) {
		Session session = factory.getCurrentSession();
		RDQuizTest rdQuizTest = session.byId(RDQuizTest.class).load(id);
        session.delete(rdQuizTest);

	}

}
