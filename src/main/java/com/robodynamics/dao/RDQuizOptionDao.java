package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;

public interface RDQuizOptionDao {

	void saveOrUpdate(RDQuizOption option);

	void saveAll(List<RDQuizOption> options);

	void deleteByQuestionId(int questionId);
	
	 // Find question by its ID
    RDQuizOption findById(int optionId);

}
