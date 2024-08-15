package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCompetitionParticipant;
import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;

public interface RDCompetitionParticipantDao {
	
	public void saveRDCompetitionParticipant(RDCompetitionParticipant competitionParticipant);

	public List < RDCompetitionParticipant > getRDCompetitionParticipants(int competitionId);
	
}
