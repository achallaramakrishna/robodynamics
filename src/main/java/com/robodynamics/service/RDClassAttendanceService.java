package com.robodynamics.service;

import com.robodynamics.dto.RDStudentAttendanceDTO;
import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDStudentEnrollment;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

public interface RDClassAttendanceService {

    void markAttendance(int offeringId, int sessionId, int studentId, int status, RDStudentEnrollment enrollment);

    void saveAttendance(int offeringId, int userId, Integer sessionId, int classSessionId, String status, Date date, String notes);


    String getAttendanceStatusForStudent(int offeringId, int studentId, LocalDate date);

    List<RDClassAttendance> getAttendanceForSession(int sessionId);

    List<RDClassAttendance> getAttendanceForStudent(int studentId);
    
    List<RDStudentAttendanceDTO> getStudentsWithAttendanceStatus(int offeringId, LocalDate today);

	List<RDClassAttendance> getAttendanceByUser(int userId);

	RDClassAttendance getAttendanceById(int id);

	boolean isAttendanceMarked(int courseOfferingId, int userID, LocalDate today);

	void saveOrUpdateAttendance(int offeringId, int userId, Integer sessionId, int classSessionId,
			String attendanceStatus, LocalDate today);

	List<RDClassAttendance> getAttendanceByEnrollment(int enrollmentId);
}
