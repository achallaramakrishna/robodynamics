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
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;

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
    public void delete(RDQuizQuestion question) {
        Session session = factory.getCurrentSession();
        session.delete(question);
    }
    
	@Override
	public List<RDQuizQuestion> findQuestionsByIds(List<Integer> questionIds) {
        // Build the HQL query to fetch questions by their IDs
        Session session = factory.getCurrentSession();

        String hql = "FROM RDQuizQuestion WHERE id IN (:questionIds)";
        Query<RDQuizQuestion> query = session.createQuery(hql, RDQuizQuestion.class);
        query.setParameterList("questionIds", questionIds);  // Pass the list of question IDs
        
        return query.getResultList();
	}

	
	@Override
	public List<RDQuizQuestion> findRandomQuestionsByCourseAndDifficultyLevels(int courseId,
			List<DifficultyLevel> difficultyLevels, int limit) {
		
        Session session = factory.getCurrentSession();

	    Query<RDQuizQuestion> query = session.createQuery(
	            "SELECT q FROM RDQuizQuestion q " +
	            "JOIN q.courseSessionDetail csd " +
	            "JOIN csd.courseSession s " +
	            "JOIN s.course c " +
	            "WHERE c.courseId = :courseId " +
	            "AND q.difficultyLevel IN (:difficultyLevels) " +
	            "ORDER BY RAND()", RDQuizQuestion.class);

	        query.setParameter("courseId", courseId);
	        query.setParameterList("difficultyLevels", difficultyLevels);
	        query.setMaxResults(limit);

	        return query.getResultList();

	}

	@Override
	public List<RDQuizQuestion> findRandomQuestionsBySessionAndDifficultyLevels(int sessionId,
			List<DifficultyLevel> difficultyLevels, int limit) {
		
        Session session = factory.getCurrentSession();


	    Query<RDQuizQuestion> query = session.createQuery(
	        "SELECT q FROM RDQuizQuestion q " +
	        "JOIN q.courseSessionDetail csd " +
	        "JOIN csd.session s " +
	        "WHERE s.sessionId = :sessionId " +
	        "AND q.difficultyLevel IN (:difficultyLevels) " +
	        "ORDER BY RAND()", RDQuizQuestion.class);

	    query.setParameter("sessionId", sessionId);
	    query.setParameterList("difficultyLevels", difficultyLevels);
	    query.setMaxResults(limit);

	    return query.getResultList();
	}

	@Override
	public List<RDQuizQuestion> findRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId,
			List<DifficultyLevel> difficultyLevels, int limit) {
        Session session = factory.getCurrentSession();


	    Query<RDQuizQuestion> query = session.createQuery(
	        "SELECT q FROM RDQuizQuestion q " +
	        "JOIN q.courseSessionDetail csd " +
	        "WHERE csd.courseSessionDetailId = :sessionDetailId " +
	        "AND q.difficultyLevel IN (:difficultyLevels) " +
	        "ORDER BY RAND()", RDQuizQuestion.class);

	    query.setParameter("sessionDetailId", sessionDetailId);
	    query.setParameterList("difficultyLevels", difficultyLevels);
	    query.setMaxResults(limit);

	    return query.getResultList();
	}
    
}
