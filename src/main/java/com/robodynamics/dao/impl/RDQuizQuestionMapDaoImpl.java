package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.NoResultException;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizQuestionMapDao;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestionMap;

@Repository
@Transactional
public class RDQuizQuestionMapDaoImpl implements RDQuizQuestionMapDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveQuizQuestionMap(RDQuizQuestionMap quizQuestionMap) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(quizQuestionMap);
    }

    @Override
    public List<RDQuizQuestionMap> getQuizQuestionMappingsByQuizId(int quizId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM RDQuizQuestionMap WHERE quiz.quizId = :quizId";
        return session.createQuery(hql, RDQuizQuestionMap.class)
                      .setParameter("quizId", quizId)
                      .getResultList();
    }

    @Override
    public void deleteQuizQuestionMap(int quizId, int questionId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "DELETE FROM RDQuizQuestionMap WHERE quiz.quizId = :quizId AND question.questionId = :questionId";
        session.createQuery(hql)
               .setParameter("quizId", quizId)
               .setParameter("questionId", questionId)
               .executeUpdate();
    }
    
    @Override
    public void addQuestionToQuiz(int quizId, int questionId) {
        Session session = sessionFactory.getCurrentSession();
        
     // Fetch the Quiz object from the database
        RDQuiz quiz = session.get(RDQuiz.class, quizId);
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz not found with ID: " + quizId);
        }

        // Fetch the QuizQuestion object from the database
        RDQuizQuestion question = session.get(RDQuizQuestion.class, questionId);
        if (question == null) {
            throw new IllegalArgumentException("Question not found with ID: " + questionId);
        }

        
        RDQuizQuestionMap quizQuestionMap = new RDQuizQuestionMap();
        quizQuestionMap.setQuiz(quiz);
        quizQuestionMap.setQuestion(question);
        session.save(quizQuestionMap);
    }

	@Override
	public List<Integer> findQuestionIdsByQuizId(int quizId) {
        Session session = sessionFactory.getCurrentSession();

        String hql = "SELECT qqm.question.questionId FROM RDQuizQuestionMap qqm WHERE qqm.quiz.quizId = :quizId";
        Query<Integer> query = session.createQuery(hql, Integer.class);
        query.setParameter("quizId", quizId);
        return query.getResultList();

	}
}
