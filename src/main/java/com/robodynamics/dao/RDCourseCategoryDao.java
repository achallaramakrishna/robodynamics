package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDUser;

public interface RDCourseCategoryDao {
	public void saveRDCourseCategory(RDCourseCategory rdCourseCategory);

	public RDCourseCategory getRDCourseCategory(int courseCategoryId);
	
	public List < RDCourseCategory > getRDCourseCategories();
	
    public void deleteRDCourseCategory(int id);

}
