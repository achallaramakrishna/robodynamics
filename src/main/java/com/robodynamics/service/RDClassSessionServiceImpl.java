package com.robodynamics.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDClassSessionDao;
import com.robodynamics.dao.RDCourseCategoryDao;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;

@Service
public class RDClassSessionServiceImpl implements RDClassSessionService {

	@Autowired
	private RDClassSessionDao rdClassSessionDao;
	
	@Override
	@Transactional
	public void saveRDClassSession(RDClassSession classSession) {
		rdClassSessionDao.saveRDClassSession(classSession);

	}

	@Override
	@Transactional
	public RDClassSession getRDClassSession(int classSessionId) {

		return rdClassSessionDao.getRDClassSession(classSessionId);
	}

	@Override
	@Transactional
	public List<RDClassSession> getRDClassSessions() {

		return rdClassSessionDao.getRDClassSessions();
	}

	@Override
	@Transactional
	public void deleteRDClassSession(int id) {
		
		rdClassSessionDao.deleteRDClassSession(id);

	}

	@Override
	@Transactional
	public List<RDClassSession> getClassSessionsByCourseOffering(RDCourseOffering courseOffering) {
		
		return rdClassSessionDao.findByCourseOffering(courseOffering);
	}

}
