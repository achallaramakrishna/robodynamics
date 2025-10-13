package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMentorPortfolioDAO;
import com.robodynamics.model.RDMentorPortfolio;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDMentorPortfolioDAOImpl implements RDMentorPortfolioDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDMentorPortfolio portfolio) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(portfolio);
    }

    @Override
    public List<RDMentorPortfolio> getPortfoliosByMentor(Integer mentorId) {
        Session session = sessionFactory.getCurrentSession();
        Query<RDMentorPortfolio> query = session.createQuery(
            "FROM RDMentorPortfolio p WHERE p.mentorId = :mentorId ORDER BY p.startDate DESC",
            RDMentorPortfolio.class
        );
        query.setParameter("mentorId", mentorId);
        return query.list();
    }

    @Override
    public void delete(Integer portfolioId) {
        Session session = sessionFactory.getCurrentSession();
        RDMentorPortfolio portfolio = session.get(RDMentorPortfolio.class, portfolioId);
        if (portfolio != null) {
            session.delete(portfolio);
        }
    }
}
