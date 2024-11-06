package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.dto.RDCourseBasicDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.wrapper.ProjectGroup;

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

	@Override
	@Transactional
	public List<RDCourseSession> findSessionsByCourseId(int courseId) {
		return rdCourseDao.findSessionsByCourseId(courseId);
	}

	@Override
	@Transactional
	public List<RDCourseBasicDTO> getBasicCourseDetails() {
		return rdCourseDao.getBasicCourseDetails();
	}
	
	@Override
	@Transactional
	public List<RDCourseBasicDTO> getPopularCourses() {
		return rdCourseDao.getPopularCourses();
	}

	@Override
	@Transactional
	public List<ProjectGroup<RDCourse>> getCoursesGroupedByCategory() {
		return rdCourseDao.getCoursesGroupedByCategory();
	}

	@Override
	@Transactional
	public List<ProjectGroup<RDCourse>> getCoursesGroupedByGradeRange() {
		return rdCourseDao.getCoursesGroupedByGradeRange();
	}

	@Override
	@Transactional
	public List<RDCourse> getFeaturedCourses() {
		return rdCourseDao.getFeaturedCourses();
	}
	
    @Override
    @Transactional
    public List<RDCourse> searchCourses(String query) {
        return rdCourseDao.searchCourses(query);
    }


}
