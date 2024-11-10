package com.robodynamics.service;

import java.util.List;

import com.robodynamics.dto.RDCourseBasicDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.wrapper.ProjectGroup;

public interface RDCourseService {
	
	public void saveRDCourse(RDCourse rdCourse);

	public RDCourse getRDCourse(int courseId);
	
	public List < RDCourse > getRDCourses();
	
    public void deleteRDCourse(int id);

	public List<RDCourseSession> findSessionsByCourseId(int courseId);
	
	List<RDCourseBasicDTO> getBasicCourseDetails();
	
	List<RDCourseBasicDTO> getPopularCourses();
	
    List<ProjectGroup<RDCourse>> getCoursesGroupedByCategory();
    
    List<ProjectGroup<RDCourse>> getCoursesGroupedByGradeRange();
    
    List<RDCourse> getFeaturedCourses();
    
    List<RDCourse> searchCourses(String query);
    
    List<RDCourse> getCoursesByTierLevel(String tierLevel); // Optional based on business need


    	

	

}
