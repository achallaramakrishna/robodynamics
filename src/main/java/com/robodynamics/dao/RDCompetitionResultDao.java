package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDCompetitionResult;

public interface RDCompetitionResultDao {

    void save(RDCompetitionResult result);

    List<RDCompetitionResult> findByCompetition(int competitionId);

    RDCompetitionResult findByStudent(int competitionId, int studentUserId);

	void generateResults(int competitionId);
}
