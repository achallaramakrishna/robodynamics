package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.robodynamics.dao.RDQuizTestDao;
import com.robodynamics.model.RDQuizTest;
import com.robodynamics.service.RDQuizTestService;

@Service
public class RDQuizTestServiceImpl implements RDQuizTestService {
	
	@Autowired
	private RDQuizTestDao rdQuizTestDao;

	@Override
	@Transactional
	public RDQuizTest saveRDQuizTest(RDQuizTest rdQuizTest) {
		
		return rdQuizTestDao.saveRDQuizTest(rdQuizTest);

	}

	@Override
	@Transactional
	public RDQuizTest getRDQuizTest(int quizTestId) {
		
		return rdQuizTestDao.getRDQuizTest(quizTestId);
	}

	@Override
	@Transactional
	public List<RDQuizTest> getRDQuizTests() {
		
		return rdQuizTestDao.getRDQuizTests();
	}

	@Override
	@Transactional
	public void deleteRDQuizTest(int id) {
		
		rdQuizTestDao.deleteRDQuizTest(id);

	}

}
