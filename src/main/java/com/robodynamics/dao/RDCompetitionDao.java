package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCompetition;

public interface RDCompetitionDao {
	
	public void saveRDCompetition(RDCompetition rdCompetition);

	public RDCompetition getRDCompetition(int competitionId);
	
	public List < RDCompetition > getRDCompetitions();
	
    public void deleteRDCompetition(int id);

}
