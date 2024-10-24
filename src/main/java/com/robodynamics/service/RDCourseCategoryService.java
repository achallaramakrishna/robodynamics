package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCourseCategory;

public interface RDCourseCategoryService {
	
	public void saveRDCourseCategory(RDCourseCategory rdCourseCategory);

	public RDCourseCategory getRDCourseCategory(int courseCategoryId);
	
	public List < RDCourseCategory > getRDCourseCategories();
	
    public void deleteRDCourseCategory(int id);
    
    public RDCourseCategory getRDCourseCategoryById(int categoryId);

}
