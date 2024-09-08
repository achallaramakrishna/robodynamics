package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.NoResultException;
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
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDQuizQuestion;

@Repository
@Transactional
public class RDQuizQuestionDaoImpl implements RDQuizQuestionDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDQuizQuestion question) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(question);
    }

    @Override
    public RDQuizQuestion findById(int questionId) {
        Session session = factory.getCurrentSession();
        return session.get(RDQuizQuestion.class, questionId);
    }

    
    @Override
    public List<RDQuizQuestion> findByQuizId(int quizId) {
    	Session session = factory.getCurrentSession();
    	try {
			Query<RDQuizQuestion> query = session.createQuery("from RDQuizQuestion where quiz.quizId =:quizId",
					RDQuizQuestion.class);
			query.setParameter("quizId", quizId);
			List<RDQuizQuestion> quizQuestionsList  = query.getResultList();
			return quizQuestionsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
    	
    }

    @Override
    public void delete(RDQuizQuestion question) {
        Session session = factory.getCurrentSession();
        session.delete(question);
    }
}
