package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDFillInBlankQuestion;

public interface RDFillInBlankQuestionService {
	
	public void saveRDFillInBlankQuestion(RDFillInBlankQuestion question);
	
    public List<RDFillInBlankQuestion> getQuestionsBySlideId(int slideId);

}
