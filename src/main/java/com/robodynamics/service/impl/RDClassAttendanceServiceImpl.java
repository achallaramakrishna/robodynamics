package com.robodynamics.service.impl;

import com.robodynamics.dao.RDClassAttendanceDao;
import com.robodynamics.dao.RDStudentEnrollmentDao;
import com.robodynamics.dto.RDStudentAttendanceDTO;
import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDClassSessionService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class RDClassAttendanceServiceImpl implements RDClassAttendanceService {

    @Autowired
    private RDClassAttendanceDao attendanceDao;
    
    @Autowired
    private RDCourseOfferingService courseOfferingService;
    
    @Autowired
    private RDClassSessionService classSessionService;
    
    @Autowired
    private RDStudentEnrollmentDao enrollmentDao;
    
    
    @Autowired
    private RDUserService userService;

   
    @Override
    @Transactional
    public String getAttendanceStatusForStudent(int sessionId, int studentId) {
        Date today = Date.valueOf(LocalDate.now());
        RDClassAttendance attendance = attendanceDao.findBySessionStudentAndDate(sessionId, studentId, today);
        if (attendance == null) return "not_marked";
        return attendance.getAttendanceStatus() == 1 ? "present" : "absent";
    }

    @Override
    @Transactional
    public List<RDClassAttendance> getAttendanceForSession(int sessionId) {
        return attendanceDao.findBySession(sessionId);
    }

    @Override
    @Transactional
    public List<RDClassAttendance> getAttendanceForStudent(int studentId) {
        return attendanceDao.findByStudent(studentId);
    }

	@Override
	@Transactional
	public void markAttendance(int offeringId, int sessionId, int studentId, int status, RDStudentEnrollment enrollment) {
		RDClassAttendance existing = attendanceDao.findBySessionStudentAndDate(
	            sessionId,
	            studentId,
	            new java.sql.Date(System.currentTimeMillis())
	    );
		
		

	    if (existing != null) {
	        existing.setAttendanceStatus(status);
	        attendanceDao.saveAttendance(existing);
	    } else {
	        RDClassAttendance attendance = new RDClassAttendance();
	        attendance.setAttendanceStatus(status);
	        attendance.setAttendanceDate(java.sql.Date.valueOf(LocalDate.now()));
	        attendance.setEnrollment(enrollment);
	        attendance.setClassSession(classSessionService.getRDClassSession(sessionId));
	        attendance.setStudent(userService.getRDUser(studentId));

	        attendanceDao.saveAttendance(attendance);
	    }
		
	}

	@Override
	@Transactional
	public List<RDStudentAttendanceDTO> getStudentsWithAttendanceStatus(int offeringId, Date today) {
	    List<RDStudentAttendanceDTO> result = new ArrayList<>();
	    List<RDStudentEnrollment> enrollments = enrollmentDao.getEnrolledStudentsByOfferingId(offeringId);

	    // ✅ Check if class session already exists for today
	    RDClassSession classSession = classSessionService.getOrCreateTodaySession(offeringId);

	    for (RDStudentEnrollment enrollment : enrollments) {
	        RDStudentAttendanceDTO dto = new RDStudentAttendanceDTO();
	        dto.setUserID(enrollment.getStudent().getUserID());
	        dto.setFirstName(enrollment.getStudent().getFirstName());
	        dto.setEnrollmentId(enrollment.getEnrollmentId());

	        // ✅ Fetch attendance status
	        String status = attendanceDao.getAttendanceStatus(
	                enrollment.getStudent().getUserID(), 
	                offeringId, 
	                today
	        );
	        dto.setAttendanceStatus(status != null ? status : "Not Marked");

	        // ✅ Set class session ID
	        dto.setClassSessionId(classSession.getClassSessionId());

	        result.add(dto);
	    }
	    return result;
	}

}
