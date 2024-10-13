package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizOption;

public interface RDQuizOptionDao {
	 void saveAll(List<RDQuizOption> options);
	 void deleteByQuestionId(int questionId);
}
