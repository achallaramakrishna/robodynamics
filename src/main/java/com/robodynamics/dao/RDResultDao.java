package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizResult;

public interface RDResultDao {
	
	public void saveRDResult(RDQuizResult rdResult);

	public RDQuizResult getRDResult(int resultId);
	
	public List < RDQuizResult > getRDResults();
	
    public void deleteRDResult(int id);
}
