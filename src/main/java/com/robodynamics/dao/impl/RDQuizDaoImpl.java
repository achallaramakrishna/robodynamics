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

import com.robodynamics.dao.RDQuizDao;
import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDQuiz;


@Repository
@Transactional
public class RDQuizDaoImpl implements RDQuizDao {
	
	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDQuiz(RDQuiz rdQuiz) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdQuiz);

	}

	@Override
	public RDQuiz getRDQuiz(int quizId) {
		Session session = factory.getCurrentSession();
		RDQuiz rdQuiz = session.get(RDQuiz.class, quizId);
        return rdQuiz;
	}

	@Override
	public List<RDQuiz> getRDQuizzes() {
		Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDQuiz > cq = cb.createQuery(RDQuiz.class);
        Root < RDQuiz > root = cq.from(RDQuiz.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}

	@Override
	public void deleteRDQuiz(int id) {
		
		Session session = factory.getCurrentSession();
		RDQuiz rdQuiz = session.byId(RDQuiz.class).load(id);
        session.delete(rdQuiz);

	}

}
