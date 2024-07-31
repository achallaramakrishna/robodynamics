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

import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDQuizQuestion;

@Repository
@Transactional
public class RDQuizQuestionDaoImpl implements RDQuizQuestionDao {

	@Autowired
	private SessionFactory factory;
	
	@Override
	public void saveRDQuizQuestion(RDQuizQuestion rdQuizQuestion) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdQuizQuestion);

	}

	@Override
	public RDQuizQuestion getRDQuizQuestion(int quizQuestionId) {
		Session session = factory.getCurrentSession();
		RDQuizQuestion rdQuizQuestion = session.get(RDQuizQuestion.class, quizQuestionId);
        return rdQuizQuestion;
	}

	@Override
	public List<RDQuizQuestion> getRDQuizQuestions() {
	       Session session = factory.getCurrentSession();
	        CriteriaBuilder cb = session.getCriteriaBuilder();
	        CriteriaQuery < RDQuizQuestion > cq = cb.createQuery(RDQuizQuestion.class);
	        Root < RDQuizQuestion > root = cq.from(RDQuizQuestion.class);
	        cq.select(root);
	        Query query = session.createQuery(cq);
	        return query.getResultList();
	}

	@Override
	public void deleteRDQuizQuestion(int id) {
        Session session = factory.getCurrentSession();
        RDQuizQuestion rdQuizQuestion = session.byId(RDQuizQuestion.class).load(id);
        session.delete(rdQuizQuestion);
	
	}

	@Override
	public List<RDQuizQuestion> getRDQuizQuestions(int quizId) {
		
		Session session = factory.getCurrentSession();
		Query query = session.createQuery("from RDQuizQuestion where quiz_id=:quiz_id");
		query.setInteger("quiz_id", quizId);
		List<RDQuizQuestion> quizQuestions = query.list();
		System.out.println(quizQuestions);
		return quizQuestions;
	}

	

}
