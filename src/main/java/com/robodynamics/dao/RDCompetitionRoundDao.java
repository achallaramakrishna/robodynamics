package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDCompetitionRound;

public interface RDCompetitionRoundDao {

    void save(RDCompetitionRound round);

    List<RDCompetitionRound> findByCompetition(int competitionId);

    RDCompetitionRound findById(int roundId);
}
