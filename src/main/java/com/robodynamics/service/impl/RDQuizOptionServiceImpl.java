package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.robodynamics.dao.RDQuizOptionDao;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.service.RDQuizOptionService;

@Service
public class RDQuizOptionServiceImpl implements RDQuizOptionService {

	@Autowired
	private RDQuizOptionDao rdQuizOptionDao;
	
	@Override
	@Transactional
	public void save(RDQuizOption option) {
		System.out.println("saving in quiz_option");
		rdQuizOptionDao.saveOrUpdate(option);
	
	}

}
