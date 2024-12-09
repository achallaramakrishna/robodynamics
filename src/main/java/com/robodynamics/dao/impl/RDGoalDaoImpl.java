package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDGoalDao;
import com.robodynamics.model.RDGoal;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDGoalDaoImpl implements RDGoalDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public RDGoal save(RDGoal goal) {
        Session session = getSession();
        session.save(goal);
        session.flush(); // Ensures the ID is generated immediately
        return goal; // Return the persisted goal with the generated ID
    }


    @Override
    public RDGoal findById(int id) {
        return getSession().get(RDGoal.class, id);
    }

    @Override
    public List<RDGoal> findByLearningPathId(int learningPathId) {
        return getSession()
                .createQuery("FROM RDGoal WHERE learningPathId = :learningPathId", RDGoal.class)
                .setParameter("learningPathId", learningPathId)
                .list();
    }

    @Override
    public List<RDGoal> findAll() {
        return getSession().createQuery("FROM RDGoal", RDGoal.class).list();
    }

    @Override
    public void update(RDGoal goal) {
        getSession().update(goal);
    }

    @Override
    public void deleteById(int id) {
        RDGoal goal = findById(id);
        if (goal != null) {
            getSession().delete(goal);
        }
    }
}
