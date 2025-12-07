package com.robodynamics.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDCompetitionRoundDao;
import com.robodynamics.model.RDCompetitionRound;
import com.robodynamics.service.RDCompetitionRoundService;

@Service
@Transactional
public class RDCompetitionRoundServiceImpl implements RDCompetitionRoundService {

    private final RDCompetitionRoundDao roundDao;

    public RDCompetitionRoundServiceImpl(RDCompetitionRoundDao roundDao) {
        this.roundDao = roundDao;
    }

    @Override
    public void save(RDCompetitionRound round) {
        roundDao.save(round);
    }

    @Override
    public List<RDCompetitionRound> findByCompetition(int competitionId) {
        return roundDao.findByCompetition(competitionId);
    }

    @Override
    public RDCompetitionRound findById(int roundId) {
        return roundDao.findById(roundId);
    }
}
