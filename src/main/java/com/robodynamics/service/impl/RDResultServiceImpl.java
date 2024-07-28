package com.robodynamics.service.impl;

import com.robodynamics.dao.RDQuizDao;
import com.robodynamics.dao.RDResultDao;
import com.robodynamics.model.RDResult;
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
	public void saveRDResult(RDResult rdResult) {
		rdResultDao.saveRDResult(rdResult);
		
	}

	@Override
	@Transactional
	public RDResult getRDResult(int resultId) {
		return rdResultDao.getRDResult(resultId);
	}

	@Override
	@Transactional
	public List<RDResult> getRDResults() {
		return rdResultDao.getRDResults();
	}

	@Override
	@Transactional
	public void deleteRDResult(int id) {
		rdResultDao.deleteRDResult(id);
		
	}



}
