package com.robodynamics.service;

import com.robodynamics.model.RDQuizResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RDResultService {

	public void saveRDResult(RDQuizResult rdResult);

	public RDQuizResult getRDResult(int resultId);
	
	public List < RDQuizResult > getRDResults();
	
    public void deleteRDResult(int id);
}
