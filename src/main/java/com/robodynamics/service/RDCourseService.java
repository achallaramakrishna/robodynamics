package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;

public interface RDCourseService {
	
	public void saveRDCourse(RDCourse rdCourse);

	public RDCourse getRDCourse(int courseId);
	
	public List < RDCourse > getRDCourses();
	
    public void deleteRDCourse(int id);

	public List<RDCourseSession> findSessionsByCourseId(int courseId);

}
