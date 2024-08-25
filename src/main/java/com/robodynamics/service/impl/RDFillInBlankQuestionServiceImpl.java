
package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFillInBlankQuestionDao;
import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.service.RDFillInBlankQuestionService;

@Service
public class RDFillInBlankQuestionServiceImpl implements RDFillInBlankQuestionService {

	@Autowired
	RDFillInBlankQuestionDao rdFillInBlankQuestionDao;
	
	
	@Override
	@Transactional
	public void saveRDFillInBlankQuestion(RDFillInBlankQuestion question) {
		rdFillInBlankQuestionDao.saveRDFillInBlankQuestion(question);

	}

	@Override
	@Transactional
	public List<RDFillInBlankQuestion> getQuestionsBySlideId(int slideId) {
		return rdFillInBlankQuestionDao.getQuestionsBySlideId(slideId);
	}

}
