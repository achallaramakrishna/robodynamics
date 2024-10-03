package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;

public interface RDCourseDao {
	public void saveRDCourse(RDCourse rdCourse);

	public RDCourse getRDCourse(int courseId);
	
	public List < RDCourse > getRDCourses();
	
    public void deleteRDCourse(int id);

	public List <RDCourseSession> findSessionsByCourseId(int courseId);

}
