package com.robodynamics.dao;

import com.robodynamics.model.RDClassAttendance;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface RDClassAttendanceDao {

    void saveAttendance(RDClassAttendance attendance);

    RDClassAttendance findBySessionStudentAndDate(int sessionId, int studentId, Date date);

    List<RDClassAttendance> findBySession(int sessionId);

    List<RDClassAttendance> findByStudent(int studentId);

	String getAttendanceStatus(int userID, int offeringId, LocalDate today);
	
	RDClassAttendance getAttendanceById(int id);

	boolean existsByOfferingAndUserAndDate(int courseOfferingId, int userID, LocalDate today);

	Object saveOrUpdateAttendance(int offeringId, int userId, Integer sessionId, int classSessionId,
			String attendanceStatus, LocalDate today);

	RDClassAttendance findByOfferingStudentAndDate(int offeringId, int studentId, LocalDate date);

	List<RDClassAttendance> getAttendanceByEnrollment(int enrollmentId);

	Map<Integer, Integer> findStatusForSessionByEnrollment(Integer classSessionId);

}
