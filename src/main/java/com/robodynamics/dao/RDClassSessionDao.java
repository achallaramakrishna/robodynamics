package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;

public interface RDClassSessionDao {

	public void saveRDClassSession(RDClassSession classSession);

	public RDClassSession getRDClassSession(int classSessionId);

	public List<RDClassSession> getRDClassSessions();

	public void deleteRDClassSession(int id);

	List<RDClassSession> findByCourseOffering(RDCourseOffering courseOffering);

}
