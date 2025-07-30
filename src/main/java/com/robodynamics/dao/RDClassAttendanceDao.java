package com.robodynamics.dao;

import com.robodynamics.model.RDClassAttendance;
import java.sql.Date;
import java.util.List;

public interface RDClassAttendanceDao {

    void saveAttendance(RDClassAttendance attendance);

    RDClassAttendance findBySessionStudentAndDate(int sessionId, int studentId, Date date);

    List<RDClassAttendance> findBySession(int sessionId);

    List<RDClassAttendance> findByStudent(int studentId);

	String getAttendanceStatus(int userID, int offeringId, Date today);
}
