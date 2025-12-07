package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDCompetition;

public interface RDCompetitionDao {

    void save(RDCompetition competition);

    void update(RDCompetition competition);

    RDCompetition findById(int id);

    List<RDCompetition> findAll();

    void delete(int id);

	int countUpcomingCompetitions();

	int countCompetitionsWithResults();
}
