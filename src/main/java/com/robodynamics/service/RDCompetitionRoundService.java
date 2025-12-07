package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDCompetitionRound;

public interface RDCompetitionRoundService {

    void save(RDCompetitionRound round);

    List<RDCompetitionRound> findByCompetition(int competitionId);

    RDCompetitionRound findById(int roundId);
}
