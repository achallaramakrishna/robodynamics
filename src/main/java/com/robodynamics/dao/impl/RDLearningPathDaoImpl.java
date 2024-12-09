package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDLearningPathDao;
import com.robodynamics.model.RDLearningPath;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDExam;

@Repository
public class RDLearningPathDaoImpl implements RDLearningPathDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDLearningPath learningPath) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(learningPath);
    }

    @Override
    public RDLearningPath findByUserExamAndYear(RDUser user, RDExam exam, int examYear) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM RDLearningPath lp WHERE lp.user = :user AND lp.exam = :exam AND lp.exam.examYear = :examYear";
        Query<RDLearningPath> query = session.createQuery(hql, RDLearningPath.class);
        query.setParameter("user", user);
        query.setParameter("exam", exam);
        query.setParameter("examYear", examYear);
        return query.uniqueResult();
    }

	@Override
	public RDLearningPath findById(int id) {
        return sessionFactory.getCurrentSession().get(RDLearningPath.class, id);

	}

	@Override
	public List<RDLearningPath> findByUser(RDUser user) {
		return sessionFactory.getCurrentSession()
                .createQuery("FROM RDLearningPath lp WHERE lp.user = :user", RDLearningPath.class)
                .setParameter("user", user)
                .getResultList();	}

	@Override
	public List<RDLearningPath> findPathsByParent(int userID) {
	    Session session = sessionFactory.getCurrentSession();
	    try {
	        // HQL Query to fetch learning paths created by a specific parent
	        String hql = """
	            SELECT lp
	            FROM RDLearningPath lp
	            WHERE lp.user.userID = :userId
	        """;
	        Query<RDLearningPath> query = session.createQuery(hql, RDLearningPath.class);
	        query.setParameter("userId", userID);

	        return query.getResultList();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return List.of(); // Return an empty list if there's an error
	    }
	}
}
