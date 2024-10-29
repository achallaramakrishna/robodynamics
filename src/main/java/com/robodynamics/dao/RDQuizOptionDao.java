package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizOption;

public interface RDQuizOptionDao {

	void saveOrUpdate(RDQuizOption option);

	void saveAll(List<RDQuizOption> options);

	void deleteByQuestionId(int questionId);
}
