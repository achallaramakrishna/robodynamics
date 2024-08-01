package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;

public interface RDClassAttendanceDao {

	public void saveRDClassAttendance(RDClassAttendance classAttendance);

	public RDClassAttendance getRDClassAttendance(int attendanceId);

	public List<RDClassAttendance> getRDClassAttendances();

	public void deleteRDClassAttendance(int id);

	List<RDClassAttendance> findByClassAttendance(RDClassSession classSession);

	List<RDClassAttendance> getAttendanceByStudent(RDUser student);
	
	List<RDClassAttendance> getAttendanceByStudentByEnrollment(RDStudentEnrollment studentEnrollment);

	List<RDClassAttendance> findByClassSession(RDClassSession classSession);

	RDClassAttendance findByClassSessionAndStudent(RDClassSession classSession, RDUser student);

}
