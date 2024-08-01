package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDClassAttendanceDao;
import com.robodynamics.dao.RDClassSessionDao;
import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDClassAttendanceService;

@Service
public class RDClassAttendanceServiceImpl implements RDClassAttendanceService {

	@Autowired
	private RDClassAttendanceDao rdClassAttendanceDao;
	
	@Override
	@Transactional
	public void saveRDClassAttendance(RDClassAttendance classAttendance) {
		
		rdClassAttendanceDao.saveRDClassAttendance(classAttendance);
	}

	@Override
	@Transactional
	public RDClassAttendance getRDClassAttendance(int attendanceId) {

		return rdClassAttendanceDao.getRDClassAttendance(attendanceId);
	}

	@Override
	@Transactional
	public List<RDClassAttendance> getRDClassAttendances() {
		
		return rdClassAttendanceDao.getRDClassAttendances();
	}

	@Override
	@Transactional
	public void deleteRDClassAttendance(int id) {
		
		rdClassAttendanceDao.deleteRDClassAttendance(id);
	}

	@Override
	@Transactional
	public List<RDClassAttendance> getAttendanceByClassSession(RDClassSession classSession) {
		
		return rdClassAttendanceDao.findByClassAttendance(classSession);
	}

	@Override
	@Transactional
	public List<RDClassAttendance> getAttendanceByStudent(RDUser student) {
		return rdClassAttendanceDao.getAttendanceByStudent(student);
	}

	@Override
	@Transactional
	public List<RDClassAttendance> findByClassSession(RDClassSession classSession) {
		return rdClassAttendanceDao.findByClassSession(classSession);
	}

	@Override
	@Transactional
	public RDClassAttendance getAttendanceByClassSessionAndStudent(RDClassSession classSession, RDUser student) {
		return rdClassAttendanceDao.findByClassSessionAndStudent(classSession, student);
	}

	@Override
	@Transactional
	public List<RDClassAttendance> getAttendanceByStudentByEnrollment(RDStudentEnrollment studentEnrollment) {
		return rdClassAttendanceDao.getAttendanceByStudentByEnrollment(studentEnrollment);
	}

}
