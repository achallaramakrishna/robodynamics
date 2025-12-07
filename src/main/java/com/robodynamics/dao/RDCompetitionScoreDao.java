package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDCompetitionScore;

public interface RDCompetitionScoreDao {

    void save(RDCompetitionScore score);

    List<RDCompetitionScore> findByRound(int roundId);

    RDCompetitionScore findForStudent(int roundId, int studentUserId);

	int countPendingScores();
}
