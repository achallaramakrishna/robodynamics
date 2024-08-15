package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCompetition;

public interface RDCompetitionService {

	public void saveRDCompetition(RDCompetition rdCompetition);

	public RDCompetition getRDCompetition(int competitionId);
	
	public List < RDCompetition > getRDCompetitions();
	
    public void deleteRDCompetition(int id);
}
