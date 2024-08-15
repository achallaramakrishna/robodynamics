package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCompetitionJudge;

public interface RDCompetitionJudgeDao {
	
    List<RDCompetitionJudge> getCompetitionJudges(int competitionId);


}
