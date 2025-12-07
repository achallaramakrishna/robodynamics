package com.robodynamics.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDCompetitionDao;
import com.robodynamics.dao.RDCompetitionRegistrationDao;
import com.robodynamics.dao.RDCompetitionResultDao;
import com.robodynamics.dao.RDCompetitionRoundDao;
import com.robodynamics.model.RDCompetition;
import com.robodynamics.model.RDCompetitionRegistration;
import com.robodynamics.model.RDCompetitionResult;
import com.robodynamics.model.RDCompetitionRound;
import com.robodynamics.service.RDCompetitionService;

@Service
@Transactional
public class RDCompetitionServiceImpl implements RDCompetitionService {

    private final RDCompetitionDao competitionDao;
    
    @Autowired
    private RDCompetitionRoundDao roundDao;

    @Autowired
    private RDCompetitionRegistrationDao registrationDao;

    @Autowired
    private RDCompetitionResultDao resultDao;

    public RDCompetitionServiceImpl(RDCompetitionDao competitionDao) {
        this.competitionDao = competitionDao;
    }

    @Override
    public void save(RDCompetition competition) {
        competitionDao.save(competition);
    }

    @Override
    public void update(RDCompetition competition) {
        competitionDao.update(competition);
    }

    @Override
    public RDCompetition findById(int id) {
        return competitionDao.findById(id);
    }

    @Override
    public List<RDCompetition> findAll() {
        return competitionDao.findAll();
    }

    @Override
    public void delete(int id) {
        competitionDao.delete(id);
    }

    @Override
    public int countUpcomingCompetitions() {
        return competitionDao.countUpcomingCompetitions();
    }

    @Override
    public int countCompetitionsWithResults() {
        return competitionDao.countCompetitionsWithResults();
    }

    @Override
    public List<RDCompetitionRound> findRoundsByCompetition(int competitionId) {
        return roundDao.findByCompetition(competitionId);
    }

    @Override
    public List<RDCompetitionRegistration> findRegistrations(int competitionId) {
        return registrationDao.findByCompetition(competitionId);
    }

    @Override
    public List<RDCompetitionResult> findResults(int competitionId) {
        return resultDao.findByCompetition(competitionId);
    }



}
