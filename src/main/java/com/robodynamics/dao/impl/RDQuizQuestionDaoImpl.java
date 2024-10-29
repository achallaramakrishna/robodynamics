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
		  // Build the HQL query to fetch questions by their IDs along with their options
	    Session session = factory.getCurrentSession();

	    // Use IN clause to fetch all questions that match the provided list of IDs
	    String hql = "SELECT DISTINCT q FROM RDQuizQuestion q LEFT JOIN FETCH q.options WHERE q.questionId IN (:questionIds)";
	    
	    // Create the query
	    Query<RDQuizQuestion> query = session.createQuery(hql, RDQuizQuestion.class);
	    
	    // Set the list of IDs as the parameter for the query
	    query.setParameterList("questionIds", questionIds);
	    
	    // Execute the query and return the result list
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

	@Override
	public List<RDQuizQuestion> findAll() {
		Session session = factory.getCurrentSession();
        Query<RDQuizQuestion> query = session.createQuery("from RDQuizQuestion", RDQuizQuestion.class);
        return query.getResultList();
	}

	@Override
	public List<RDQuizQuestion> findPaginated(int page, int size) {
		 Session session = factory.getCurrentSession();
	        
	        // Create the HQL query to fetch paginated data
	        Query<RDQuizQuestion> query = session.createQuery("from RDQuizQuestion", RDQuizQuestion.class);
	        
	        // Set pagination parameters
	        query.setFirstResult(page * size); // Calculate the starting index
	        query.setMaxResults(size); // Set the maximum number of results
	        
	        return query.getResultList();
	}

	@Override
	public long countQuestions() {
		  Session session = factory.getCurrentSession();
	        
	        // Create the HQL query to count the total number of records
	        Query<Long> countQuery = session.createQuery("select count(q) from RDQuizQuestion q", Long.class);
	        
	        // Get the unique count result
	        return countQuery.uniqueResult();
	}

	@Override
	public List<RDQuizQuestion> getQuestionsBySlideId(int slideId, String questionType) {
		Session session = factory.getCurrentSession();
        String hql = "FROM RDQuizQuestion q WHERE q.slide.slideId = :slideId AND q.questionType = :questionType";
        Query<RDQuizQuestion> query = session.createQuery(hql, RDQuizQuestion.class);
        query.setParameter("slideId", slideId);
        query.setParameter("questionType", questionType);
        return query.getResultList();
	}
    
}
