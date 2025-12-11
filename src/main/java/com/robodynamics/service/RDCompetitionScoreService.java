package com.robodynamics.service;

import java.util.List;
import java.util.Map;

import com.robodynamics.model.RDCompetitionScore;

public interface RDCompetitionScoreService {

    void save(RDCompetitionScore score);

    List<RDCompetitionScore> findByRound(int roundId);

    RDCompetitionScore findForStudent(int roundId, int studentUserId);
    
    int countPendingScores();

	Map<Integer, RDCompetitionScore> findScoresForRound(int roundId);


}
