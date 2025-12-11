package com.robodynamics.dao.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionDao;
import com.robodynamics.dao.RDCompetitionResultDao;
import com.robodynamics.model.RDCompetition;
import com.robodynamics.model.RDCompetitionResult;
import com.robodynamics.model.RDCompetitionScore;
import com.robodynamics.model.RDUser;

@Repository
@Transactional
public class RDCompetitionResultDaoImpl implements RDCompetitionResultDao {

    @Autowired private SessionFactory sessionFactory;

    @Autowired private RDCompetitionDao competitionDao;

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCompetitionResult result) {
        s().saveOrUpdate(result);
    }

    @Override
    public List<RDCompetitionResult> findByCompetition(int competitionId) {
        return sessionFactory.getCurrentSession()
                .createQuery(
                    "FROM RDCompetitionResult r " +
                    "JOIN FETCH r.student " +
                    "WHERE r.competition.competitionId = :cid " +
                    "ORDER BY r.resultRank",
                    RDCompetitionResult.class
                )
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

    @Override
    public void generateResults(int competitionId) {

        Session session = sessionFactory.getCurrentSession();

        // 1. Prevent duplicate generation
        Long count = session.createQuery(
                "SELECT COUNT(r) FROM RDCompetitionResult r WHERE r.competition.competitionId = :cid",
                Long.class)
                .setParameter("cid", competitionId)
                .uniqueResult();

        if (count != null && count > 0) {
            throw new IllegalStateException("Results already generated.");
        }

        // 2. Fetch all scores for competition
        List<RDCompetitionScore> scores = session.createQuery(
                "FROM RDCompetitionScore s WHERE s.round.competition.competitionId = :cid",
                RDCompetitionScore.class)
                .setParameter("cid", competitionId)
                .list();

        if (scores.isEmpty()) {
            throw new IllegalStateException("No scores available to generate results.");
        }

        // 3. Aggregate scores per student
        Map<RDUser, Double> totalScores = new HashMap<>();

        for (RDCompetitionScore s : scores) {
            totalScores.merge(
                    s.getStudent(),
                    s.getScore(),
                    Double::sum
            );
        }

        // 4. Sort by score DESC
        List<Map.Entry<RDUser, Double>> ranked =
                totalScores.entrySet()
                           .stream()
                           .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                           .toList();

        RDCompetition competition = competitionDao.findById(competitionId);

        // 5. Save results with rank
        int rank = 1;
        for (Map.Entry<RDUser, Double> entry : ranked) {
            RDCompetitionResult result = new RDCompetitionResult();
            result.setCompetition(competition);
            result.setStudent(entry.getKey());
            result.setTotalScore(entry.getValue());
            result.setResultRank(rank++);
            session.save(result);
        }
    }
}
