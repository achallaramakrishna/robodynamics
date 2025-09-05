package com.robodynamics.dao.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.robodynamics.dao.RDCourseSessionDao;
import com.robodynamics.dao.RDCourseSessionDetailDao;
import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;
import com.robodynamics.model.RDQuizQuestion.TierLevel;

@Repository
@Transactional
public class RDQuizQuestionDaoImpl implements RDQuizQuestionDao {

    @Autowired
    private SessionFactory factory;
    
    @Autowired
    private RDCourseSessionDao courseSessionDao;
    
    @Autowired
    private RDCourseSessionDetailDao courseSessionDetailDao;

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

	@Override
    @SuppressWarnings("unchecked")
    public List<RDQuizQuestion> findByTierLevel(TierLevel tierLevel) {
        return factory.getCurrentSession()
                .createQuery("FROM RDQuizQuestion WHERE tierLevel = :tierLevel")
                .setParameter("tierLevel", tierLevel)
                .list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDQuizQuestion> findByTierLevelAndDifficulty(TierLevel tierLevel, String difficultyLevel) {
        return factory.getCurrentSession()
                .createQuery("FROM RDQuizQuestion WHERE tierLevel = :tierLevel AND difficultyLevel = :difficultyLevel")
                .setParameter("tierLevel", tierLevel)
                .setParameter("difficultyLevel", difficultyLevel)
                .list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDQuizQuestion> findByTierLevelOrderedByTierOrder(TierLevel tierLevel) {
        return factory.getCurrentSession()
                .createQuery("FROM RDQuizQuestion WHERE tierLevel = :tierLevel ORDER BY tierOrder ASC")
                .setParameter("tierLevel", tierLevel)
                .list();
    }

	@Override
	public List<RDQuizQuestion> findQuestionsByQuizId(int quizId) {
		 // Get the current Hibernate session
        Session session = factory.getCurrentSession();

        // Create the HQL query to fetch quiz questions for the given quizId
        String hql = "FROM RDQuizQuestion q WHERE q.quiz.quizId = :quizId";

        Query<RDQuizQuestion> query = session.createQuery(hql, RDQuizQuestion.class);
        query.setParameter("quizId", quizId);

        // Execute the query and return the results
        return query.getResultList();
	}

	@Override
	public List<RDQuizQuestion> findQuestionsByCriteria(
	        Integer courseId, 
	        List<Integer> courseSessionIds, 
	        List<String> questionTypes, 
	        List<String> difficultyLevels, 
	        int limit) {

	    Session session = factory.getCurrentSession();

	    System.out.println("Course id - " + courseId);
	    System.out.println("courseSessionIds - " + courseSessionIds);
	    System.out.println("questionTypes - " + questionTypes);
	    System.out.println("difficultyLevels - " + difficultyLevels);
	    System.out.println("limit - " + limit);

	    String sql = "SELECT q.question_id, q.additional_info, q.correct_answer, \r\n"
	            + "       q.difficulty_level, q.explanation, q.max_marks, \r\n"
	            + "       q.points, q.question_text, q.question_type, \r\n"
	            + "       q.tier_level, q.tier_order\r\n"
	            + "FROM rd_quiz_questions q\r\n"
	            + "WHERE q.course_session_id IN (:courseSessionIds)\r\n"
	            + "  AND q.question_type IN (:questionTypes)\r\n"
	            + "  AND q.difficulty_level IN (:difficultyLevels)\r\n"
	            + "ORDER BY q.points DESC\r\n"
	            + "LIMIT :limit";

	    Query query = session.createNativeQuery(sql);

	    // Set parameters
	    query.setParameterList("courseSessionIds", courseSessionIds);
	    query.setParameterList("questionTypes", questionTypes);
	    query.setParameterList("difficultyLevels", difficultyLevels);
	    query.setParameter("limit", limit);

	    // Execute query and map results
	    List<Object[]> rawResults = query.getResultList();
	    List<RDQuizQuestion> questions = new ArrayList<>();

	    for (Object[] row : rawResults) {
	        RDQuizQuestion question = new RDQuizQuestion();

	        // Map each column to the corresponding field in RDQuizQuestion
	        question.setQuestionId((Integer) row[0]);
	        question.setAdditionalInfo((String) row[1]);
	        question.setCorrectAnswer((String) row[2]);

	        // Convert and set difficultyLevel (enum)
	        if (row[3] != null) {
	            String difficultyLevelString = row[3].toString();
	            question.setDifficultyLevel(RDQuizQuestion.DifficultyLevel.valueOf(difficultyLevelString));
	        }

	        question.setExplanation((String) row[4]);
	        question.setMaxMarks((Integer) row[5]);
	        question.setPoints((Integer) row[6]);
	        question.setQuestionText((String) row[7]);
	        question.setQuestionType((String) row[8]);

	        // Convert and set tierLevel (enum)
	        if (row[9] != null) {
	            String tierLevelString = row[9].toString();
	            question.setTierLevel(RDQuizQuestion.TierLevel.valueOf(tierLevelString));
	        }

	        question.setTierOrder((Integer) row[10]);

	        questions.add(question);
	    }

	    return questions;
	}

	    @Override
	    public List<RDQuizQuestion> findByFilters(Integer courseId,
	                                              Integer sessionId,
	                                              Integer sessionDetailId,
	                                              Integer quizId,
	                                              int limit,
	                                              int offset) {

	        // Build dynamic HQL with minimal joins depending on filters
	        StringBuilder hql = new StringBuilder();
	        Map<String, Object> params = new HashMap<>();

	        if (quizId != null) {
	            // via mapping table RDQuizQuestionMap (assumes entity name RDQuizQuestionMap with fields: quiz, question)
	            hql.append("select distinct q from RDQuizQuestion q ")
	               .append(" join RDQuizQuestionMap m on m.question.questionId = q.questionId ")
	               .append(" where m.quiz.quizId = :quizId ");
	            params.put("quizId", quizId);

	            // You can still narrow further by session/sessionDetail/course if you want:
	            if (sessionDetailId != null) {
	                hql.append(" and q.courseSessionDetail.courseSessionDetailId = :sdid ");
	                params.put("sdid", sessionDetailId);
	            } else if (sessionId != null) {
	                hql.append(" and q.courseSession.courseSessionId = :sid ");
	                params.put("sid", sessionId);
	            } else if (courseId != null) {
	                hql.append(" and q.courseSession.course.courseId = :cid ");
	                params.put("cid", courseId);
	            }
	        } else if (sessionDetailId != null) {
	            hql.append("select q from RDQuizQuestion q ")
	               .append(" where q.courseSessionDetail.courseSessionDetailId = :sdid ");
	            params.put("sdid", sessionDetailId);
	        } else if (sessionId != null) {
	            hql.append("select q from RDQuizQuestion q ")
	               .append(" where q.courseSession.courseSessionId = :sid ");
	            params.put("sid", sessionId);
	        } else if (courseId != null) {
	            // need a join to access course.id safely if your mapping is q.courseSession.course
	            hql.append("select q from RDQuizQuestion q ")
	               .append(" join q.courseSession cs ")
	               .append(" join cs.course c ")
	               .append(" where c.courseId = :cid ");
	            params.put("cid", courseId);
	        } else {
	            // no filters → return something sensible (or empty)
	            hql.append("select q from RDQuizQuestion q ");
	        }

	        hql.append(" order by q.questionId desc ");
		    Session session = factory.getCurrentSession();
		    
	        Query<RDQuizQuestion> query = session.createQuery(hql.toString(), RDQuizQuestion.class);
	        params.forEach(query::setParameter);

	        if (limit > 0) {
	            query.setFirstResult(Math.max(0, offset));
	            query.setMaxResults(limit);
	        }

	        // EAGER 'options' is already configured in your entity;
	        // if LAZY, fetch join: "select distinct q from RDQuizQuestion q left join fetch q.options ..."
	        return query.list();
	    }

	    @Override
	    public long countByFilters(Integer courseId,
	                               Integer sessionId,
	                               Integer sessionDetailId,
	                               Integer quizId) {

	        StringBuilder hql = new StringBuilder();
	        Map<String, Object> params = new HashMap<>();

	        if (quizId != null) {
	            hql.append("select count(distinct q.questionId) from RDQuizQuestion q ")
	               .append(" join RDQuizQuestionMap m on m.question.questionId = q.questionId ")
	               .append(" where m.quiz.quizId = :quizId ");
	            params.put("quizId", quizId);

	            if (sessionDetailId != null) {
	                hql.append(" and q.courseSessionDetail.courseSessionDetailId = :sdid ");
	                params.put("sdid", sessionDetailId);
	            } else if (sessionId != null) {
	                hql.append(" and q.courseSession.courseSessionId = :sid ");
	                params.put("sid", sessionId);
	            } else if (courseId != null) {
	                hql.append(" and q.courseSession.course.courseId = :cid ");
	                params.put("cid", courseId);
	            }
	        } else if (sessionDetailId != null) {
	            hql.append("select count(q.questionId) from RDQuizQuestion q ")
	               .append(" where q.courseSessionDetail.courseSessionDetailId = :sdid ");
	            params.put("sdid", sessionDetailId);
	        } else if (sessionId != null) {
	            hql.append("select count(q.questionId) from RDQuizQuestion q ")
	               .append(" where q.courseSession.courseSessionId = :sid ");
	            params.put("sid", sessionId);
	        } else if (courseId != null) {
	            hql.append("select count(q.questionId) from RDQuizQuestion q ")
	               .append(" join q.courseSession cs ")
	               .append(" join cs.course c ")
	               .append(" where c.courseId = :cid ");
	            params.put("cid", courseId);
	        } else {
	            hql.append("select count(q.questionId) from RDQuizQuestion q ");
	        }
		    Session session = factory.getCurrentSession();

	        Query<Long> query = session.createQuery(hql.toString(), Long.class);
	        params.forEach(query::setParameter);
	        return query.uniqueResult();
	    }

		@Override
		public List<RDQuizQuestion> findByFilters(Integer courseId, Integer sessionId, Integer sessionDetailId,
				Integer quizId) {
		    return findByFilters(courseId, sessionId, sessionDetailId, quizId, 0, 0);
		}

	
    
}
