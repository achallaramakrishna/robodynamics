
package com.robodynamics.service.impl;

import java.util.List;

import com.robodynamics.dao.RDSubmissionDao;
import com.robodynamics.model.RDSubmission;
import com.robodynamics.service.RDSubmissionService;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class RDSubmissionServiceImpl implements RDSubmissionService {

	@Autowired
	private RDSubmissionDao rdSubmissionDao;

	@Override
	@Transactional
	public List<RDSubmission> findByCompetitionId(int competitionId) {
		
		return rdSubmissionDao.findByCompetitionId(competitionId);
	}

	@Override
	@Transactional
	public List<RDSubmission> findByUserId(int userId) {
		
		return rdSubmissionDao.findByUserId(userId);
	}

	@Override
	@Transactional
	public void saveRDSubmission(RDSubmission submission) {
		rdSubmissionDao.saveRDSubmission(submission);
		
	}

}
