package com.robodynamics.dao.impl;

import java.util.List;

import javax.transaction.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCompetitionScoreDao;
import com.robodynamics.model.RDCompetitionScore;

@Repository
@Transactional
public class RDCompetitionScoreDaoImpl implements RDCompetitionScoreDao {

    private final SessionFactory sessionFactory;

    public RDCompetitionScoreDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() { return sessionFactory.getCurrentSession(); }

    @Override
    public void save(RDCompetitionScore score) {
        s().saveOrUpdate(score);
    }

    @Override
    public List<RDCompetitionScore> findByRound(int roundId) {
        return s().createQuery(
            "from RDCompetitionScore sc where sc.round.roundId = :rid",
            RDCompetitionScore.class)
            .setParameter("rid", roundId)
            .list();
    }

    @Override
    public RDCompetitionScore findForStudent(int roundId, int studentUserId) {
        return s().createQuery(
            "from RDCompetitionScore sc where sc.round.roundId = :rid and sc.student.userID = :sid",
            RDCompetitionScore.class)
            .setParameter("rid", roundId)
            .setParameter("sid", studentUserId)
            .uniqueResult();
    }

    @Override
    public int countPendingScores() {

        String hql = """
            select count(*)
            from RDCompetitionRegistration reg
            join RDCompetitionRound r on r.competition.competitionId = reg.competition.competitionId
            left join RDCompetitionScore sc 
                on sc.round.roundId = r.roundId 
               and sc.student.userID = reg.student.userID
            where sc.scoreId is null
        """;

        Long count = (Long) s().createQuery(hql).uniqueResult();
        return count != null ? count.intValue() : 0;
    }

}
