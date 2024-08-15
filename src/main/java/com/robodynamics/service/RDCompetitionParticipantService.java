package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCompetitionParticipant;

public interface RDCompetitionParticipantService {
	
	public void saveRDCompetitionParticipant(RDCompetitionParticipant competitionParticipant);

	public List < RDCompetitionParticipant > getRDCompetitionParticipants(int competitionId);

}
