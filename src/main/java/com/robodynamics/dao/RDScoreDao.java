package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDScore;

public interface RDScoreDao {
	
	List<RDScore> findBySubmissionId(int submissionId);
    List<RDScore> findByJudgeUserId(int judgeUserId);

}
