package com.robodynamics.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDCompetitionResultDao;
import com.robodynamics.model.RDCompetitionResult;
import com.robodynamics.service.RDCompetitionResultService;

@Service
@Transactional
public class RDCompetitionResultServiceImpl implements RDCompetitionResultService {

    private final RDCompetitionResultDao resultDao;

    public RDCompetitionResultServiceImpl(RDCompetitionResultDao resultDao) {
        this.resultDao = resultDao;
    }

    @Override
    public void save(RDCompetitionResult result) {
        resultDao.save(result);
    }

    @Override
    public List<RDCompetitionResult> findByCompetition(int competitionId) {
        return resultDao.findByCompetition(competitionId);
    }

    @Override
    public RDCompetitionResult findByStudent(int competitionId, int studentUserId) {
        return resultDao.findByStudent(competitionId, studentUserId);
    }

	@Override
	public void generateResults(int competitionId) {
		
		resultDao.generateResults(competitionId);
	}
}
