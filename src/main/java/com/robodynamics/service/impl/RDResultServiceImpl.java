package com.robodynamics.service.impl;

import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.dao.RDResultDao;
import com.robodynamics.model.RDQuizResult;
import com.robodynamics.service.RDResultService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDResultServiceImpl implements RDResultService {

	@Autowired
	private RDResultDao rdResultDao;

	@Override
	@Transactional
	public void saveRDResult(RDQuizResult rdResult) {
		rdResultDao.saveRDResult(rdResult);
		
	}

	@Override
	@Transactional
	public RDQuizResult getRDResult(int resultId) {
		return rdResultDao.getRDResult(resultId);
	}

	@Override
	@Transactional
	public List<RDQuizResult> getRDResults() {
		return rdResultDao.getRDResults();
	}

	@Override
	@Transactional
	public void deleteRDResult(int id) {
		rdResultDao.deleteRDResult(id);
		
	}

	@Override
	@Transactional
	public void getNextTestCountForUser(int quizId, int userId) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void updatePreviousTestResults(int quizId, int userId) {
		rdResultDao.updatePreviousTestResults(quizId, userId);
		
	}
	
	@Override
	@Transactional
	public List<RDQuizResult> getUserResultsForQuiz(int quizId, int userId, int status) {
		return rdResultDao.getUserResultsForQuiz(quizId, userId, status);
		
	}



}
