package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDScore;

public interface RDScoreService {
	
	List<RDScore> findBySubmissionId(int submissionId);
    List<RDScore> findByJudgeUserId(int judgeUserId);

}
