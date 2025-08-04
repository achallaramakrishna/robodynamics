package com.robodynamics.controller;

import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.time.LocalDate;
import java.util.Map;

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
    private RDCourseTrackingService courseTrackingService;

    @Autowired
    private RDUserService userService;

    @GetMapping("/status")
    @ResponseBody
    public String getStatus(@RequestParam("sessionId") int sessionId,
                            @RequestParam("studentId") int studentId) {
    	LocalDate today = LocalDate.now();

        return attendanceService.getAttendanceStatusForStudent(sessionId, studentId,today);
    }

    @PostMapping("/attendanceTracking/save")
    public String saveAttendanceAndTracking(
            @RequestParam("offeringId") int offeringId,
            HttpServletRequest request, HttpSession session,
            RedirectAttributes redirectAttributes) {

        System.out.println("✅ Save or update attendance and tracking... for offeringId: " + offeringId);
        
      

        LocalDate today = LocalDate.now();
        RDClassSession classSession = classSessionService.getOrCreateClassSession(offeringId, today);

        // ✅ Loop only attendance-related parameters
        request.getParameterMap().forEach((key, value) -> {
            if (key.startsWith("attendanceStatus_")) {
                try {
                	  RDUser mentor = null;
              		if (session.getAttribute("rdUser") != null) {
              			mentor = (RDUser) session.getAttribute("rdUser");
              		}
                    int userId = Integer.parseInt(key.replace("attendanceStatus_", ""));
                    String attendanceStatus = request.getParameter(key);

                    String sessionIdStr = request.getParameter("session_" + userId);
                    Integer sessionId = (sessionIdStr != null && !sessionIdStr.isEmpty())
                            ? Integer.parseInt(sessionIdStr) : null;

                    String feedback = request.getParameter("feedback_" + userId);

                    attendanceService.saveOrUpdateAttendance(
                            offeringId,
                            userId,
                            sessionId,
                            classSession.getClassSessionId(),
                            attendanceStatus,
                            today
                    );

                    int enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(offeringId, userId);
                    RDUser studentUser = userService.getRDUser(userId);

                    courseTrackingService.saveOrUpdateCourseTracking(
                            enrollmentId,
                            sessionId,
                            classSession.getClassSessionId(),
                            feedback,
                            today,
                            null,
                            studentUser,
                            mentor
                    );

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        redirectAttributes.addFlashAttribute("message", "Attendance and tracking saved/updated successfully!");
        return "redirect:/attendance-tracking";
    }

}
