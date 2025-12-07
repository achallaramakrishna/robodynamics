package com.robodynamics.dao.impl;

import java.util.List;

import javax.transaction.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCompetitionRoundDao;
import com.robodynamics.model.RDCompetitionRound;

@Repository
@Transactional
public class RDCompetitionRoundDaoImpl implements RDCompetitionRoundDao {

    private final SessionFactory sessionFactory;

    public RDCompetitionRoundDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() { return sessionFactory.getCurrentSession(); }

    @Override
    public void save(RDCompetitionRound round) {
        s().saveOrUpdate(round);
    }

    @Override
    public List<RDCompetitionRound> findByCompetition(int competitionId) {
        return s().createQuery(
            "select r from RDCompetitionRound r " +
            "left join fetch r.judge " +
            "where r.competition.competitionId = :cid",
            RDCompetitionRound.class)
            .setParameter("cid", competitionId)
            .list();
    }

    @Override
    public RDCompetitionRound findById(int roundId) {
        return s().get(RDCompetitionRound.class, roundId);
    }
}
