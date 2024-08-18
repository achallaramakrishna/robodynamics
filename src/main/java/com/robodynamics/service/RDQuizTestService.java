package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDQuizTest;

public interface RDQuizTestService {

	public RDQuizTest saveRDQuizTest(RDQuizTest rdQuizTest);

	public RDQuizTest getRDQuizTest(int quizTestId);
	
	public List < RDQuizTest > getRDQuizTests();
	
    public void deleteRDQuizTest(int id);
    

    

}
