package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCourseSession;

public interface RDCourseSessionService {

	public void saveRDCourseSession(RDCourseSession rdCourseSession);

	public RDCourseSession getRDCourseSession(int courseSessionId);
	
	public List < RDCourseSession > getRDCourseSessions(int courseId);
	
    public void deleteRDCourseSession(int id);
}