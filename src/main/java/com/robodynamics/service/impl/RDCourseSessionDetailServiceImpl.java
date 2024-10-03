package com.robodynamics.service.impl;

import java.util.List;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.service.RDCourseSessionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.dao.RDCourseSessionDao;
import com.robodynamics.dao.RDCourseSessionDetailDao;
import com.robodynamics.model.RDCourse;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;

@Service
public class RDCourseSessionDetailServiceImpl implements RDCourseSessionDetailService {

	@Autowired
	private RDCourseSessionDetailDao rdCourseSessionDetailDao;
	
	@Override
	@Transactional
	public void saveRDCourseSessionDetail(RDCourseSessionDetail rdCourseSessionDetail) {
		rdCourseSessionDetailDao.saveRDCourseSession(rdCourseSessionDetail);

	}

	@Override
	@Transactional
	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId) {
		
		return rdCourseSessionDetailDao.getRDCourseSessionDetail(courseSessionDetailId);
	}

	@Override
	@Transactional
	public List<RDCourseSessionDetail> getRDCourseSessionDetails(int courseId) {
		
		return rdCourseSessionDetailDao.getRDCourseSessionDetails(courseId);
	}

	@Override
	@Transactional
	public void deleteRDCourseSessionDetail(int id) {
		rdCourseSessionDetailDao.deleteRDCourseSessionDetail(id);
	}

	@Override
	public List<RDCourseSessionDetail> findSessionDetailsBySessionId(int sessionId) {
        return rdCourseSessionDetailDao.findSessionDetailsBySessionId(sessionId);

	}

}
