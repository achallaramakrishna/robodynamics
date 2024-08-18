package com.robodynamics.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import javax.persistence.NoResultException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.jdbc.Work;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDResultDao;
import com.robodynamics.model.RDQuizResult;
import com.robodynamics.model.RDUser;

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

	@Override
	public void getNextTestCountForUser(int quizId, int userId) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updatePreviousTestResults(int quizId, int userId) {
		Session session = factory.getCurrentSession();
	            // Start a transaction
				session.doWork(new Work() {

					public void execute(Connection connection) throws SQLException {
						String sql = "UPDATE rd_quiz_question_results rqqr " +
                                "SET rqqr.is_current_test = 1 " +
                                "WHERE rqqr.user_id = ? " +
                                "AND rqqr.quiz_question_id in (" +
                                "    SELECT rq.quiz_question_id " +
                                "    FROM rd_quiz_questions rq " +
                                "    WHERE rq.quiz_id = ? and rqqr.is_current_test = 0 " +
                                ")";				        
						try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
				            preparedStatement.setLong(1, userId);
				            preparedStatement.setLong(2, quizId);

				            int result = preparedStatement.executeUpdate();
				        }
					}
				});
				            // Commit the transaction
		
	}

	@Override
	public List<RDQuizResult> getUserResultsForQuiz(int quizId, int userId, int status) {
		// TODO Auto-generated method stub
				Session session = factory.getCurrentSession();
				try {
					Query<RDQuizResult> query = 
							session.createQuery("from RDQuizResult where user.userID =:userId and quizQuestion.quiz.quiz_id =:quizId and isCurrentTest = :status",
							RDQuizResult.class);
					query.setParameter("quizId", quizId);
					query.setParameter("userId", userId);
					query.setParameter("status", status);
					List<RDQuizResult> rdQuizResultList  = query.list();
					return rdQuizResultList;
				} catch (NoResultException e) {
					// TODO: handle exception
					return null;
				}
	}

}
