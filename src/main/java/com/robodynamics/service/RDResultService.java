package com.robodynamics.service;

import com.robodynamics.model.RDResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RDResultService {

	public void saveRDResult(RDResult rdResult);

	public RDResult getRDResult(int resultId);
	
	public List < RDResult > getRDResults();
	
    public void deleteRDResult(int id);
}
