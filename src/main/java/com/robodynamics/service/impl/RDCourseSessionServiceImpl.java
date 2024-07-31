package com.robodynamics.service.impl;

import java.util.List;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.service.RDCourseSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.dao.RDCourseSessionDao;
import com.robodynamics.model.RDCourse;
import com.robodynamics.service.RDCourseService;

@Service
public class RDCourseSessionServiceImpl implements RDCourseSessionService {

	@Autowired
	private RDCourseSessionDao rdCourseSessionDao;
	
	@Override
	@Transactional
	public void saveRDCourseSession(RDCourseSession rdCourseSession) {
		rdCourseSessionDao.saveRDCourseSession(rdCourseSession);

	}

	@Override
	@Transactional
	public RDCourseSession getRDCourseSession(int courseSessionId) {
		
		return rdCourseSessionDao.getRDCourseSession(courseSessionId);
	}

	@Override
	@Transactional
	public List<RDCourseSession> getRDCourseSessions(int courseId) {
		
		return rdCourseSessionDao.getRDCourseSessions(courseId);
	}

	@Override
	@Transactional
	public void deleteRDCourseSession(int id) {
		rdCourseSessionDao.deleteRDCourseSession(id);
	}

}
