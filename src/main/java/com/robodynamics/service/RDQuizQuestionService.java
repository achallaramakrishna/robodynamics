package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDQuizQuestion;


public interface RDQuizQuestionService {
	
	public void saveRDQuizQuestion(RDQuizQuestion rdQuizQuestion);

	public RDQuizQuestion getRDQuizQuestion(int quizQuestionId);
	
	public List < RDQuizQuestion > getRDQuizQuestions();
	
	public List < RDQuizQuestion > getRDQuizQuestions(int quizId);

	
    public void deleteRDQuizQuestion(int id);

}
