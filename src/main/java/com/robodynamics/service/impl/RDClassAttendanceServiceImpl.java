package com.robodynamics.service.impl;

import com.robodynamics.dao.RDClassAttendanceDao;
import com.robodynamics.dao.RDStudentEnrollmentDao;
import com.robodynamics.dto.RDStudentAttendanceDTO;
import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;
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
import java.time.LocalDateTime;
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
    private RDStudentEnrollmentService enrollmentService;
    
    
    @Autowired
    private RDUserService userService;

   


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
	public List<RDStudentAttendanceDTO> getStudentsWithAttendanceStatus(int offeringId, LocalDate today) {
	    List<RDStudentAttendanceDTO> result = new ArrayList<>();

	    // ✅ Fetch all enrollments for the offering
	    List<RDStudentEnrollment> enrollments = enrollmentService.getEnrolledStudentsByOfferingId(offeringId);

	    // ✅ Ensure today's class session exists (using LocalDate)
	    RDClassSession classSession = classSessionService.getOrCreateClassSession(offeringId, today);

	    for (RDStudentEnrollment enrollment : enrollments) {
	        RDStudentAttendanceDTO dto = new RDStudentAttendanceDTO();
	        dto.setUserID(enrollment.getStudent().getUserID());
	        dto.setFirstName(enrollment.getStudent().getFirstName());
	        dto.setEnrollmentId(enrollment.getEnrollmentId());

	        // ✅ Fetch attendance status using LocalDate
	        String status = attendanceDao.getAttendanceStatus(
	                enrollment.getStudent().getUserID(), 
	                offeringId, 
	                today // LocalDate
	        );
	        dto.setAttendanceStatus(status != null ? status : "Not Marked");

	        // ✅ Set class session ID
	        dto.setClassSessionId(classSession.getClassSessionId());

	        result.add(dto);
	    }
	    return result;
	}


	@Override
	public void saveAttendance(int offeringId, int userId, Integer sessionId, int classSessionId, String status, Date date, String notes) {
		 RDClassAttendance attendance = new RDClassAttendance();
		 
		 RDClassSession classSesion = classSessionService.getRDClassSession(sessionId);
		 RDUser user = userService.getRDUser(userId);
	        attendance.setClassSession(classSesion);
	        attendance.setStudent(user);
	        attendance.setAttendanceStatus("Present".equalsIgnoreCase(status) ? 1 : 0);
	        attendance.setAttendanceDate(date);
	        attendance.setNotes(notes);
	        // enrollmentId needs to be fetched from Enrollment service
	        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(getEnrollmentId(offeringId, userId));	      

	        attendance.setEnrollment(enrollment);
	        attendanceDao.saveAttendance(attendance);		
	}
	 /**
     * ✅ Fetches the enrollmentId for the given user and offering
     */
    private int getEnrollmentId(int offeringId, int userId) {
        // Uses enrollment service to find existing enrollment
        int enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(offeringId, userId);
        if (enrollmentId > 0) {
            return enrollmentId;
        }

       return 0;
    }

    public RDClassAttendance getAttendanceById(int id) {
        return attendanceDao.getAttendanceById(id);
    }

    @Override
    public List<RDClassAttendance> getAttendanceByUser(int userId) {
        return attendanceDao.findByStudent(userId);
    }

	@Override
	public boolean isAttendanceMarked(int courseOfferingId, int userID, LocalDate today) {
	    return attendanceDao.existsByOfferingAndUserAndDate(courseOfferingId, userID, today);
	}

	@Transactional
	public void saveOrUpdateAttendance(int offeringId, int userId, Integer sessionId, int classSessionId,
	                                   String attendanceStatus, LocalDate date) {

	    // Convert LocalDate to java.sql.Date
	    java.sql.Date sqlDate = java.sql.Date.valueOf(date);

	    RDClassAttendance existing = attendanceDao.findBySessionStudentAndDate(classSessionId, userId, sqlDate);
	    
	    int enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(offeringId, userId);
	    
	    // ✅ Convert "Present"/"Absent" to int using enum
	    int statusValue = attendanceStatus.equalsIgnoreCase("Present")
	            ? RDClassAttendance.StatusType.PRESENT.getValue()
	            : RDClassAttendance.StatusType.ABSENT.getValue();


	    if (existing != null) {
	        existing.setAttendanceStatus(statusValue);
	        existing.setAttendanceDate(sqlDate);
	        attendanceDao.saveAttendance(existing);
	        System.out.println("🔄 Attendance updated for userId: " + userId);
	    } else {
	        RDClassAttendance newAttendance = new RDClassAttendance();
	       
	        newAttendance.setStudent(userService.getRDUser(userId));
	        newAttendance.setClassSession(classSessionService.getRDClassSession(classSessionId));
	        
	        newAttendance.setEnrollment(enrollmentService.getRDStudentEnrollment(enrollmentId));

	        
	        newAttendance.setAttendanceStatus(statusValue);
	        newAttendance.setAttendanceDate(sqlDate);
	        newAttendance.setCreatedAt(LocalDateTime.now());
	        attendanceDao.saveAttendance(newAttendance);
	        System.out.println("✅ Attendance saved for userId: " + userId);
	    }
	}

	@Override
	public String getAttendanceStatusForStudent(int offeringId, int studentId, LocalDate date) {
		RDClassAttendance attendance = attendanceDao.findByOfferingStudentAndDate(offeringId, studentId, date);

	    if (attendance != null) {
	    	 int statusCode = attendance.getAttendanceStatus(); // returns int
	         return statusCode == 1 ? "Present" : "Absent"; // Convert to String
	    }
	    return null; // No attendance found
	}

	@Override
	public List<RDClassAttendance> getAttendanceByEnrollment(int enrollmentId) {
		
		return attendanceDao.getAttendanceByEnrollment(enrollmentId);
	}

}
