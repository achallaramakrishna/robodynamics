package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDQuestionDao;
import com.robodynamics.model.RDQuestion;
import com.robodynamics.model.RDQuestion.DifficultyLevel;
import com.robodynamics.model.RDQuizOption;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import javax.persistence.TypedQuery;

@Repository
public class RDQuestionDaoImpl implements RDQuestionDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveOrUpdate(RDQuestion question) {
        sessionFactory.getCurrentSession().saveOrUpdate(question);
    }

    @Override
    public RDQuestion findById(int questionId) {
        return sessionFactory.getCurrentSession().get(RDQuestion.class, questionId);
    }

    @Override
    public void delete(RDQuestion question) {
        sessionFactory.getCurrentSession().delete(question);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDQuestion> findRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit) {
        return sessionFactory.getCurrentSession()
                .createQuery("FROM RDQuestion WHERE courseSessionDetail.course.courseId = :courseId AND difficultyLevel IN (:difficultyLevels) ORDER BY RAND()")
                .setParameter("courseId", courseId)
                .setParameterList("difficultyLevels", difficultyLevels)
                .setMaxResults(limit)
                .list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDQuestion> findRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit) {
        return sessionFactory.getCurrentSession()
                .createQuery("FROM RDQuestion WHERE courseSessionDetail.sessionId = :sessionId AND difficultyLevel IN (:difficultyLevels) ORDER BY RAND()")
                .setParameter("sessionId", sessionId)
                .setParameterList("difficultyLevels", difficultyLevels)
                .setMaxResults(limit)
                .list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDQuestion> findRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit) {
        return sessionFactory.getCurrentSession()
                .createQuery("FROM RDQuestion WHERE courseSessionDetail.sessionDetailId = :sessionDetailId AND difficultyLevel IN (:difficultyLevels) ORDER BY RAND()")
                .setParameter("sessionDetailId", sessionDetailId)
                .setParameterList("difficultyLevels", difficultyLevels)
                .setMaxResults(limit)
                .list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDQuestion> findQuestionsByIds(List<Integer> questionIds) {
        return sessionFactory.getCurrentSession()
                .createQuery("FROM RDQuestion WHERE questionId IN (:questionIds)")
                .setParameterList("questionIds", questionIds)
                .list();
    }
    
    @Override
    public List<RDQuestion> findQuestionsBySlideIdAndType(int slideId, String questionType) {
        // Hibernate query to filter questions by slide ID and question type
        String hql = "FROM RDQuestion q WHERE q.slide.slideId = :slideId AND q.questionType = :questionType";
        TypedQuery<RDQuestion> query = sessionFactory.getCurrentSession().createQuery(hql, RDQuestion.class);
        query.setParameter("slideId", slideId);
        query.setParameter("questionType", questionType);

        return query.getResultList();
    }

    @Override
    public void saveAll(List<RDQuestion> questions) {
        for (RDQuestion question : questions) {
        	saveOrUpdate(question);
        }
    }
    
    @Override
    public List<RDQuestion> findBySlideId(int slideId) {
        String hql = "FROM RDQuestion q LEFT JOIN FETCH q.options WHERE q.slide.slideId = :slideId ORDER BY q.questionNumber ASC";
        Query<RDQuestion> query = sessionFactory.getCurrentSession().createQuery(hql, RDQuestion.class);
        query.setParameter("slideId", slideId);
        return query.getResultList();
    }

	@Override
	public List<RDQuizOption> getOptionsForQuestion(int questionId) {
		 	Session session = sessionFactory.getCurrentSession();
	        String hql = "FROM RDQuizOption o WHERE o.question.questionId = :questionId";
	        Query<RDQuizOption> query = session.createQuery(hql);
	        query.setParameter("questionId", questionId);
	        return query.getResultList();
	}

	@Override
	public RDQuestion findBySlideIdAndQuestionNumber(int slideId, int questionNumber) {
	        String hql = "FROM RDQuestion WHERE slide.slideId = :slideId AND questionNumber = :questionNumber";
	        Query<RDQuestion> query = sessionFactory.getCurrentSession().createQuery(hql, RDQuestion.class);
	        query.setParameter("slideId", slideId);
	        query.setParameter("questionNumber", questionNumber);
	        return query.uniqueResult();
	}

	@Override
	public List<RDQuestion> getQuestionsByCourseSessionDetailId(int courseSessionDetailId) {
        Session session = sessionFactory.getCurrentSession();
        Query<RDQuestion> query = session.createQuery("from RDQuestion where courseSessionDetail.courseSessionDetailId=:sessionDetailId", RDQuestion.class);
        query.setParameter("sessionDetailId", courseSessionDetailId);
        return query.getResultList();
	}

}
