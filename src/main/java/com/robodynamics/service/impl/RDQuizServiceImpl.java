package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizDao;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.service.RDQuizService;



@Service
public class RDQuizServiceImpl implements RDQuizService {
	
	@Autowired
	private RDQuizDao rdQuizDao;

	@Override
	@Transactional
	public void saveRDQuiz(RDQuiz rdQuiz) {
		rdQuizDao.saveRDQuiz(rdQuiz);
	}

	@Override
	@Transactional
	public RDQuiz getRDQuiz(int quizId) {
		return rdQuizDao.getRDQuiz(quizId);
	}

	@Override
	@Transactional
	public List<RDQuiz> getRDQuizes() {
		return rdQuizDao.getRDQuizes();
	}

	@Override
	@Transactional
	public void deleteRDQuiz(int id) {
		rdQuizDao.deleteRDQuiz(id);
		
	}
   
}
