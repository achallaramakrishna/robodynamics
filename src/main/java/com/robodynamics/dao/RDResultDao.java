package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDResult;

public interface RDResultDao {
	
	public void saveRDResult(RDResult rdResult);

	public RDResult getRDResult(int resultId);
	
	public List < RDResult > getRDResults();
	
    public void deleteRDResult(int id);
}
