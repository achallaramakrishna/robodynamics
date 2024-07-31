package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.service.RDQuizQuestionService;



@Service
public class RDQuizQuestionServiceImpl implements RDQuizQuestionService {
	
	@Autowired
	private RDQuizQuestionDao rdQuizQuestionDao;

	@Override
	@Transactional
	public void saveRDQuizQuestion(RDQuizQuestion rdQuizQuestion) {
		rdQuizQuestionDao.saveRDQuizQuestion(rdQuizQuestion);
	}

	@Override
	@Transactional
	public RDQuizQuestion getRDQuizQuestion(int quizQuestionId) {
		return rdQuizQuestionDao.getRDQuizQuestion(quizQuestionId);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> getRDQuizQuestions() {
		return rdQuizQuestionDao.getRDQuizQuestions();
	}

	@Override
	@Transactional
	public void deleteRDQuizQuestion(int id) {
		rdQuizQuestionDao.deleteRDQuizQuestion(id);
		
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> getRDQuizQuestions(int quizId) {
		
		return rdQuizQuestionDao.getRDQuizQuestions(quizId);
	}
   
}
