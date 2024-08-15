package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCompetitionJudge;

public interface RDCompetitionJudgeService {

	List<RDCompetitionJudge> getCompetitionJudges(int competitionId);
}
