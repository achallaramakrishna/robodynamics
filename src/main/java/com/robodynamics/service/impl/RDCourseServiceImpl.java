package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.model.RDCourse;
import com.robodynamics.service.RDCourseService;

@Service
public class RDCourseServiceImpl implements RDCourseService {

	@Autowired
	private RDCourseDao rdCourseDao;

	@Override
	@Transactional
	public void saveRDCourse(RDCourse rdCourse) {
		rdCourseDao.saveRDCourse(rdCourse);
		
	}

	@Override
	@Transactional
	public RDCourse getRDCourse(int courseId) {
		return rdCourseDao.getRDCourse(courseId);
	}

	@Override
	@Transactional
	public List<RDCourse> getRDCourses() {
		return rdCourseDao.getRDCourses();
	}

	@Override
	@Transactional
	public void deleteRDCourse(int id) {
		rdCourseDao.deleteRDCourse(id);
		
	}

}
