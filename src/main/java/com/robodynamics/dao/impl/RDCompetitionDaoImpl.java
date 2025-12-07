package com.robodynamics.dao.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCompetitionDao;
import com.robodynamics.model.RDCompetition;

@Repository
@Transactional
public class RDCompetitionDaoImpl implements RDCompetitionDao {

    private final SessionFactory sessionFactory;

    public RDCompetitionDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCompetition competition) {
        s().saveOrUpdate(competition);
    }

    @Override
    public void update(RDCompetition competition) {
        s().update(competition);
    }

    @Override
    public RDCompetition findById(int id) {
        return s().get(RDCompetition.class, id);
    }

    @Override
    public List<RDCompetition> findAll() {
        return s().createQuery("from RDCompetition", RDCompetition.class).list();
    }

    @Override
    public void delete(int id) {
        RDCompetition c = findById(id);
        if (c != null) {
            s().delete(c);
        }
    }

    @Override
    public int countUpcomingCompetitions() {
        String hql = "SELECT COUNT(c) FROM RDCompetition c WHERE c.date >= current_date";
        Long count = s().createQuery(hql, Long.class).uniqueResult();
        return count != null ? count.intValue() : 0;
    }

    @Override
    public int countCompetitionsWithResults() {
        String hql = "SELECT COUNT(DISTINCT r.competition.competitionId) FROM RDCompetitionResult r";
        Long count = s().createQuery(hql, Long.class).uniqueResult();
        return count != null ? count.intValue() : 0;
    }
}
