package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionResultDao;
import com.robodynamics.model.RDCompetitionResult;

@Repository
@Transactional
public class RDCompetitionResultDaoImpl implements RDCompetitionResultDao {

    private final SessionFactory sessionFactory;

    public RDCompetitionResultDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCompetitionResult result) {
        s().saveOrUpdate(result);
    }

    @Override
    public List<RDCompetitionResult> findByCompetition(int competitionId) {
        String hql = "FROM RDCompetitionResult r WHERE r.competition.competitionId = :cid ORDER BY r.rank ASC";
        return s()
            .createQuery(hql, RDCompetitionResult.class)
            .setParameter("cid", competitionId)
            .list();
    }

    @Override
    public RDCompetitionResult findByStudent(int competitionId, int studentUserId) {
        String hql = """
            FROM RDCompetitionResult r
            WHERE r.competition.competitionId = :cid
              AND r.student.userId = :sid
        """;

        List<RDCompetitionResult> list = s()
            .createQuery(hql, RDCompetitionResult.class)
            .setParameter("cid", competitionId)
            .setParameter("sid", studentUserId)
            .list();

        return list.isEmpty() ? null : list.get(0);
    }
}
