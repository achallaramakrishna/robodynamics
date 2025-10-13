package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMentorFeedbackDAO;
import com.robodynamics.model.RDMentorFeedback;
import org.hibernate.SessionFactory;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.hibernate.query.Query;

import java.util.List;

@Repository
public class RDMentorFeedbackDAOImpl implements RDMentorFeedbackDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDMentorFeedback feedback) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(feedback);
    }

    @Override
    public List<RDMentorFeedback> getFeedbacksByMentor(Integer mentorId) {
        Session session = sessionFactory.getCurrentSession();
        Query<RDMentorFeedback> query = session.createQuery(
            "FROM RDMentorFeedback f WHERE f.mentorId = :mentorId ORDER BY f.createdAt DESC",
            RDMentorFeedback.class
        );
        query.setParameter("mentorId", mentorId);
        return query.list();
    }

    @Override
    public Double getAverageRating(Integer mentorId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Double> query = session.createQuery(
            "SELECT avg(f.rating) FROM RDMentorFeedback f WHERE f.mentorId = :mentorId",
            Double.class
        );
        query.setParameter("mentorId", mentorId);
        return query.uniqueResult();
    }
}
