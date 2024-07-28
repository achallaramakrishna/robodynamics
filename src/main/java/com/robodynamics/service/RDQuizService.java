package com.robodynamics.service;

import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDQuiz;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


public interface RDQuizService {
	
	public void saveRDQuiz(RDQuiz rdQuiz);

	public RDQuiz getRDQuiz(int quizId);
	
	public List < RDQuiz > getRDQuizes();
	
    public void deleteRDQuiz(int id);

}
