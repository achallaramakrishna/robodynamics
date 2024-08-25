package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDFillInBlankQuestion;

public interface RDFillInBlankQuestionDao {
	
	public void saveRDFillInBlankQuestion(RDFillInBlankQuestion question);
	
    public List<RDFillInBlankQuestion> getQuestionsBySlideId(int slideId);

}
