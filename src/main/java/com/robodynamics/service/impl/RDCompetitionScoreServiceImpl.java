package com.robodynamics.service.impl;

import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDCompetitionScoreDao;
import com.robodynamics.model.RDCompetitionScore;
import com.robodynamics.service.RDCompetitionScoreService;

@Service
@Transactional
public class RDCompetitionScoreServiceImpl implements RDCompetitionScoreService {

    private final RDCompetitionScoreDao scoreDao;

    public RDCompetitionScoreServiceImpl(RDCompetitionScoreDao scoreDao) {
        this.scoreDao = scoreDao;
    }

    @Override
    public void save(RDCompetitionScore score) {
        scoreDao.save(score);
    }

    @Override
    public List<RDCompetitionScore> findByRound(int roundId) {
        return scoreDao.findByRound(roundId);
    }

    @Override
    public RDCompetitionScore findForStudent(int roundId, int studentUserId) {
        return scoreDao.findForStudent(roundId, studentUserId);
    }

	@Override
	public int countPendingScores() {
		return scoreDao.countPendingScores();
	}

	@Override
	public Map<Integer, RDCompetitionScore> findScoresForRound(int roundId) {
		
		return scoreDao.findScoresForRound(roundId);
	}

	
}
