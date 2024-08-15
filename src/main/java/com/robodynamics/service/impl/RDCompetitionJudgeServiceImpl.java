package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionJudgeDao;
import com.robodynamics.model.RDCompetitionJudge;
import com.robodynamics.service.RDCompetitionJudgeService;

@Service
public class RDCompetitionJudgeServiceImpl implements RDCompetitionJudgeService {

	@Autowired
	private RDCompetitionJudgeDao rdCompetitionJudgeDao;

	@Override
	@Transactional
	public List<RDCompetitionJudge> getCompetitionJudges(int competitionId) {
		
		return rdCompetitionJudgeDao.getCompetitionJudges(competitionId);
	}

}
