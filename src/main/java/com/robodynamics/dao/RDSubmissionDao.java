package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDSubmission;

public interface RDSubmissionDao {
	
	public List<RDSubmission> findByCompetitionId(int competitionId);
    public List<RDSubmission> findByUserId(int userId);
    
    public void saveRDSubmission(RDSubmission submission);
}
