package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDUserQuizResultDao;
import com.robodynamics.model.RDUserQuizResults;

@Repository
@Transactional
public class RDUserQuizResultDaoImpl implements RDUserQuizResultDao {

	@Autowired
	private SessionFactory factory;


    // Helper method to get the current Hibernate session
    private Session getSession() {
        return factory.getCurrentSession();
    }

    @Override
    public void saveOrUpdate(RDUserQuizResults quizResult) {
        Session session = getSession();
        if (quizResult.getId() > 0) {
            session.update(quizResult);  // Update the existing quiz result
        } else {
            session.save(quizResult);  // Save new quiz result
        }
    }

    @Override
    public RDUserQuizResults findById(int resultId) {
        Session session = getSession();
        return session.get(RDUserQuizResults.class, resultId);  // Fetch a single quiz result by ID
    }

    @Override
    public List<RDUserQuizResults>  findByUserIdAndQuizId(int userId, int quizId) {
        Session session = getSession();
        Query<RDUserQuizResults> query = session.createQuery(
            "FROM RDUserQuizResults WHERE user.id = :userId AND quiz.id = :quizId", 
            RDUserQuizResults.class
        );
        query.setParameter("userId", userId);
        query.setParameter("quizId", quizId);
        return query.getResultList();  // Return the unique quiz result for the user and quiz
    }

    @Override
    public List<RDUserQuizResults> findByUserId(int userId) {
        Session session = getSession();
        Query<RDUserQuizResults> query = session.createQuery(
            "FROM RDUserQuizResults WHERE user.id = :userId", 
            RDUserQuizResults.class
        );
        query.setParameter("userId", userId);
        return query.getResultList();  // Return all quiz results for a specific user
    }

    @Override
    public List<RDUserQuizResults> findAll() {
        Session session = getSession();
        Query<RDUserQuizResults> query = session.createQuery(
            "FROM RDUserQuizResults", 
            RDUserQuizResults.class
        );
        return query.getResultList();  // Return all quiz results
    }

    @Override
    public void delete(RDUserQuizResults quizResult) {
        Session session = getSession();
        if (quizResult != null) {
            session.delete(quizResult);  // Delete the quiz result
        }
    }

	@Override
	public List<RDUserQuizResults> findByQuizId(int quizId) {
		Session session = getSession();
        Query<RDUserQuizResults> query = session.createQuery(
            "FROM RDUserQuizResults WHERE quiz.id = :quizId", 
            RDUserQuizResults.class
        );
        query.setParameter("quizId", quizId);
        return query.getResultList();  // Return all quiz results for the given quizId

	}

	@Override
	public int countQuizzesTakenByUser(int userId) {
	       CriteriaBuilder cb = getSession().getCriteriaBuilder();
	        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
	        Root<RDUserQuizResults> root = cq.from(RDUserQuizResults.class);

	        cq.select(cb.count(root)).where(cb.equal(root.get("user").get("userID"), userId));
	        Query<Long> query = getSession().createQuery(cq);

	        return query.getSingleResult().intValue();

	}
}
