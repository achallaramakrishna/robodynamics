package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDSubmission;

public interface RDSubmissionService {
	
	List<RDSubmission> findByCompetitionId(int competitionId);
    List<RDSubmission> findByUserId(int userId);
    
    public void saveRDSubmission(RDSubmission submission);

}
