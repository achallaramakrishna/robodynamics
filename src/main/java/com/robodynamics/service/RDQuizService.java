package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDQuiz;

public interface RDQuizService {
	
	public void saveRDQuiz(RDQuiz rdQuiz);

	public RDQuiz getRDQuiz(int quizId);
	
	public List < RDQuiz > getRDQuizzes();
	
    public void deleteRDQuiz(int id);

}
