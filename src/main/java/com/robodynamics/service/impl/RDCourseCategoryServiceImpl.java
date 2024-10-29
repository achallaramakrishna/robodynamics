package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseCategoryDao;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.service.RDCourseCategoryService;

@Service
public class RDCourseCategoryServiceImpl implements RDCourseCategoryService {

	
	@Autowired
	private RDCourseCategoryDao rdCourseCategoryDao;

	@Override
	@Transactional	
	public void saveRDCourseCategory(RDCourseCategory rdCourseCategory) {
		rdCourseCategoryDao.saveRDCourseCategory(rdCourseCategory);

	}

	@Override
	@Transactional
	public RDCourseCategory getRDCourseCategory(int courseCategoryId) {
		return rdCourseCategoryDao.getRDCourseCategory(courseCategoryId);
	}

	@Override
	@Transactional
	public List<RDCourseCategory> getRDCourseCategories() {
		return rdCourseCategoryDao.getRDCourseCategories();
	}

	@Override
	@Transactional
	public void deleteRDCourseCategory(int id) {
		rdCourseCategoryDao.deleteRDCourseCategory(id);
	}

	@Override
	public RDCourseCategory getRDCourseCategoryById(int categoryId) {
		// Implement the logic to fetch the category by ID
	    return rdCourseCategoryDao.getRDCourseCategory(categoryId);
	}

}
