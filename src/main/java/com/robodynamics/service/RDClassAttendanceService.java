package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;

public interface RDClassAttendanceService {

	public void saveRDClassAttendance(RDClassAttendance classAttendance);

	public RDClassAttendance getRDClassAttendance(int attendanceId);

	public List<RDClassAttendance> getRDClassAttendances();

	public void deleteRDClassAttendance(int id);

	List<RDClassAttendance> getAttendanceByClassSession(RDClassSession classSession);
	
	List<RDClassAttendance>  getAttendanceByStudent(RDUser student);
	
	List<RDClassAttendance> findByClassSession(RDClassSession classSession);

	RDClassAttendance getAttendanceByClassSessionAndStudent(RDClassSession classSession, RDUser student);
	
	List<RDClassAttendance> getAttendanceByStudentByEnrollment(RDStudentEnrollment studentEnrollment);



}
