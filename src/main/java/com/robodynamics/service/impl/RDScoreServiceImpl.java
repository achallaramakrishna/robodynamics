package com.robodynamics.service.impl;

import java.util.List;

import com.robodynamics.dao.RDScoreDao;
import com.robodynamics.model.RDScore;
import com.robodynamics.service.RDScoreService;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;



@Service
public class RDScoreServiceImpl implements RDScoreService {

	@Autowired
	private RDScoreDao rdScoreDao;
	
	@Override
	@Transactional
	public List<RDScore> findBySubmissionId(int submissionId) {
		
		return rdScoreDao.findBySubmissionId(submissionId);
	}

	@Override
	@Transactional
	public List<RDScore> findByJudgeUserId(int judgeUserId) {
		return rdScoreDao.findByJudgeUserId(judgeUserId);
	}

}
