package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionParticipantDao;
import com.robodynamics.model.RDCompetitionParticipant;
import com.robodynamics.service.RDCompetitionParticipantService;

@Service
public class RDCompetitionParticipantServiceImpl implements RDCompetitionParticipantService {

	@Autowired
	private RDCompetitionParticipantDao rdCompetitionParticipantDao;

	@Override
	@Transactional
	public void saveRDCompetitionParticipant(RDCompetitionParticipant competitionParticipant) {
		
		rdCompetitionParticipantDao.saveRDCompetitionParticipant(competitionParticipant);
	}

	@Override
	@Transactional
	public List<RDCompetitionParticipant> getRDCompetitionParticipants(int competitionId) {

		return rdCompetitionParticipantDao.getRDCompetitionParticipants(competitionId);
	}
	
	
	
}
