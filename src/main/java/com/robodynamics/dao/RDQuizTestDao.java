package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDQuizTest;

public interface RDQuizTestDao {
	
	public RDQuizTest saveRDQuizTest(RDQuizTest rdQuizTest);

	public RDQuizTest getRDQuizTest(int quizTestId);
	
	public List < RDQuizTest > getRDQuizTests();
	
    public void deleteRDQuizTest(int id);

}
