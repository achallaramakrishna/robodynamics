package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDCompetition;
import com.robodynamics.model.RDCompetitionRegistration;
import com.robodynamics.model.RDCompetitionResult;
import com.robodynamics.model.RDCompetitionRound;

public interface RDCompetitionService {

    void save(RDCompetition competition);
    void update(RDCompetition competition);

    RDCompetition findById(int id);

    List<RDCompetition> findAll();

    void delete(int id);
    
    int countUpcomingCompetitions();

    int countCompetitionsWithResults();
    List<RDCompetitionRound> findRoundsByCompetition(int competitionId);
    List<RDCompetitionRegistration> findRegistrations(int competitionId);
    List<RDCompetitionResult> findResults(int competitionId);

}
