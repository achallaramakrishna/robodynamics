package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDCourseForm;
import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDCourseResource;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDClassSessionService;
import com.robodynamics.service.RDCourseCategoryService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;


@Controller
@RequestMapping("/courseTracking")
public class RDCourseTrackingController {
    @Autowired
    private RDClassSessionService classSessionService;
    
    @Autowired
    private RDCourseOfferingService courseOfferingService;
    
    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;
    
    @Autowired
    private RDUserService userService;


    @Autowired
    private RDStudentEnrollmentService enrollmentService;
    
    @Autowired
    private RDClassAttendanceService attendanceService;

    
    @RequestMapping(value = "/courseSessions", method = RequestMethod.GET)
    public String getClassSessions(@RequestParam("courseOfferingId") int courseOfferingId, Model model) {
    	
        RDCourseOffering courseOffering = courseOfferingService.getRDCourseOffering(courseOfferingId);
        
        List<RDClassSession> classSessions = classSessionService.getClassSessionsByCourseOffering(courseOffering);
        model.addAttribute("classSessions", classSessions);
        return "courseSessions"; // JSP or HTML view
    }

    @RequestMapping(value = "/attendance", method = RequestMethod.GET)
    public String getAttendance(@RequestParam("classSessionId") int classSessionId, Model model) {
    	RDClassSession classSession = classSessionService.getRDClassSession(classSessionId);
        List<RDClassAttendance> attendanceList = attendanceService.getAttendanceByClassSession(classSession);
        model.addAttribute("attendanceList", attendanceList);
        return "attendance"; // JSP or HTML view
    }

    @RequestMapping(value = "/studentAttendance", method = RequestMethod.GET)
    public String getStudentAttendance(@RequestParam("studentId") int studentId, Model model) {
        RDUser student = userService.getRDUser(studentId);
        List<RDClassAttendance> attendanceList = attendanceService.getAttendanceByStudent(student);
        model.addAttribute("attendanceList", attendanceList);
        return "studentAttendance"; // JSP or HTML view
    }
    
    @RequestMapping(value = "/viewAttendance", method = RequestMethod.GET)
    public String getStudentAttendanceByEnrollment(@RequestParam("enrollmentId") int enrollmentId, Model model) {
    	
    	RDStudentEnrollment studentEnrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);
    	
        RDUser student = userService.getRDUser(studentEnrollment.getEnrollmentId());
        List<RDClassAttendance> attendanceList = attendanceService.getAttendanceByStudentByEnrollment(studentEnrollment);
        model.addAttribute("attendanceList", attendanceList);
        return "studentAttendance"; // JSP or HTML view
    }
    
    @PostMapping("/markAttendance")
    public ModelAndView  markAttendance(@RequestParam("courseSessionDetailId") Integer courseSessionDetailId,
    		@RequestParam("enrollmentId") Integer enrollmentId,
    		Model model,HttpSession session) {
    	RDUser student = null;
		if (session.getAttribute("rdUser") != null) {
			student = (RDUser) session.getAttribute("rdUser");
		}
		System.out.println("Course Session Detail ID - " + courseSessionDetailId);
		System.out.println("Enrollment ID - " + enrollmentId);
		RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
		
		RDStudentEnrollment studentEnrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);
		
		
		RDClassAttendance classAttendance = new RDClassAttendance();
		classAttendance.setCourseSessionDetail(courseSessionDetail);
		classAttendance.setUser(student);
		classAttendance.setStudentEnrollment(studentEnrollment);
		classAttendance.setAttendance_status(RDClassAttendance.statusType.Present.getValue());
		// Set the attendance date
        Date now = new Date();
        classAttendance.setAttendanceDate(now);
        

        // Set the attendance time
        classAttendance.setAttendanceTime(LocalDateTime.now());
		
        classAttendance.setCreatedAt(LocalDateTime.now());
        
        attendanceService.saveRDClassAttendance(classAttendance);
    	// Logic to handle attendance marking
        // Use the courseSessionDetailId parameter as needed

        ModelAndView modelAndView = new ModelAndView("redirect:/enrollment/listbystudent");
		return modelAndView;
    }
    
    
}
