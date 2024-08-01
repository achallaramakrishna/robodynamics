package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;

public interface RDClassSessionService {
	
	public void saveRDClassSession(RDClassSession classSession);

	public RDClassSession getRDClassSession(int classSessionId);

	public List<RDClassSession> getRDClassSessions();

	public void deleteRDClassSession(int id);

	List<RDClassSession> getClassSessionsByCourseOffering(RDCourseOffering courseOffering);


}

