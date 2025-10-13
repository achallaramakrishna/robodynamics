package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMentorRecommendationDAO;
import com.robodynamics.model.RDMentorRecommendation;
import org.hibernate.SessionFactory;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.hibernate.query.Query;

import java.util.List;

@Repository
public class RDMentorRecommendationDAOImpl implements RDMentorRecommendationDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDMentorRecommendation recommendation) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(recommendation);
    }

    @Override
    public List<RDMentorRecommendation> getRecommendationsByMentor(Integer mentorId) {
        Session session = sessionFactory.getCurrentSession();
        Query<RDMentorRecommendation> query = session.createQuery(
            "FROM RDMentorRecommendation r WHERE r.mentor.mentorId = :mentorId ORDER BY r.createdAt DESC",
            RDMentorRecommendation.class
        );
        query.setParameter("mentorId", mentorId);
        return query.list();
    }
}
