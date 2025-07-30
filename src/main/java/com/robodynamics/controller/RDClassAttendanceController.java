package com.robodynamics.controller;

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
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.time.LocalDate;

@Controller
@RequestMapping("/attendance")
public class RDClassAttendanceController {

    @Autowired
    private RDClassAttendanceService attendanceService;

    @Autowired
    private RDClassSessionService classSessionService;

    @Autowired
    private RDCourseOfferingService courseOfferingService;
    
    @Autowired
    private RDStudentEnrollmentService enrollmentService;

    @Autowired
    private RDUserService userService;

    @PostMapping("/mark")
    public String markAttendance(@RequestParam("offeringId") int offeringId,
                                 @RequestParam("studentId") int studentId,
                                 @RequestParam("status") int status) {
    	
        Date today = java.sql.Date.valueOf(LocalDate.now());
       
        int enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(studentId, offeringId);
        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);

        RDClassSession session = classSessionService.findSessionByOfferingAndDate(offeringId, today);

        if (session == null) {
            session = new RDClassSession();
            session.setCourseOffering(courseOfferingService.getRDCourseOffering(offeringId));
            session.setSessionTitle("Auto-generated Session");
            session.setSessionDate(today);
            classSessionService.saveRDClassSession(session);
        }

        attendanceService.markAttendance(offeringId,session.getClassSessionId(), studentId, status,enrollment);

        return "redirect:/dashboard";
    }


    @GetMapping("/status")
    @ResponseBody
    public String getStatus(@RequestParam("sessionId") int sessionId,
                            @RequestParam("studentId") int studentId) {
        return attendanceService.getAttendanceStatusForStudent(sessionId, studentId);
    }
}
