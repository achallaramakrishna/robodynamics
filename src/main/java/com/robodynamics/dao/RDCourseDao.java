package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.dto.RDCourseBasicDTO;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.wrapper.ProjectGroup;

public interface RDCourseDao {
	public void saveRDCourse(RDCourse rdCourse);

	public RDCourse getRDCourse(int courseId);
	
	public List < RDCourse > getRDCourses();
	
    public void deleteRDCourse(int id);

	public List <RDCourseSession> findSessionsByCourseId(int courseId);

	List<RDCourseBasicDTO> getBasicCourseDetails();

	public List<RDCourseBasicDTO> getPopularCourses();
	
	List<ProjectGroup<RDCourse>> getCoursesGroupedByCategory();
    
    List<ProjectGroup<RDCourse>> getCoursesGroupedByGradeRange();
    
    List<RDCourse> getFeaturedCourses();
    
    List<RDCourse> searchCourses(String query);
    
    List<RDCourse> findByTierLevel(String tierLevel); // Optional if courses are associated with a tier level

	public List<RDCourse> getAllCoursesWithOfferingsAndEnrollments();

	public List<RDCourse> getTrendingCourses();

	public List<RDCourse> getCoursesNeedingMentors();

	public List<RDCourse> findCoursesByCategoryId(int categoryId);



}
