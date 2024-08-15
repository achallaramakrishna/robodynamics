package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionDao;
import com.robodynamics.model.RDCompetition;
import com.robodynamics.service.RDCompetitionService;

@Service
public class RDCompetitionServiceImpl implements RDCompetitionService {
	
	@Autowired
	private RDCompetitionDao rdCompetitionDao;

	@Override
	@Transactional
	public void saveRDCompetition(RDCompetition rdCompetition) {
		rdCompetitionDao.saveRDCompetition(rdCompetition);

	}

	@Override
	@Transactional
	public RDCompetition getRDCompetition(int competitionId) {
		
		return rdCompetitionDao.getRDCompetition(competitionId);
	}

	@Override
	@Transactional
	public List<RDCompetition> getRDCompetitions() {
		
		return rdCompetitionDao.getRDCompetitions();
	}

	@Override
	@Transactional
	public void deleteRDCompetition(int id) {
		
		rdCompetitionDao.deleteRDCompetition(id);

	}

}
