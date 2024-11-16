package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Controller
@RequestMapping("/courseTracking")
public class RDCourseTrackingController {

    @Autowired
    private RDCourseTrackingService courseTrackingService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseOfferingService courseOfferingService;

    @Autowired
    private RDStudentEnrollmentService enrollmentService;

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDUserService userService;
    
    private final String uploadDir = "/uploads/course-tracking/";


    // Fetch course sessions by courseId
    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", courseSessions);
        return response;
    }

 // Fetch course offerings by courseId
    @GetMapping("/getCourseOfferings")
    @ResponseBody
    public Map<String, Object> getCourseOfferings(@RequestParam("courseId") int courseId) {
        List<RDCourseOffering> courseOfferings = courseOfferingService.getRDCourseOfferingsListByCourse(courseId);

        // Prepare a simplified list with only necessary fields
        List<Map<String, Object>> offeringList = new ArrayList<>();
        for (RDCourseOffering offering : courseOfferings) {
            Map<String, Object> offeringData = new HashMap<>();
            offeringData.put("courseOfferingId", offering.getCourseOfferingId());
            offeringData.put("courseOfferingName", offering.getCourseOfferingName()); // Assuming this field exists in RDCourseOffering
            offeringList.add(offeringData);
        }

        // Prepare the final response
        Map<String, Object> response = new HashMap<>();
        response.put("courseOfferings", offeringList);
        return response;
    }


    @GetMapping("/getStudentsEnrolled")
    @ResponseBody
    public Map<String, Object> getStudentsEnrolled(@RequestParam("courseOfferingId") int courseOfferingId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Fetch enrolled students
            List<RDStudentEnrollment> enrolledStudents = enrollmentService.getEnrolledStudentsByOfferingId(courseOfferingId);

            // Map response to include enrollmentId and student name
            List<Map<String, Object>> students = enrolledStudents.stream().map(enrollment -> {
                Map<String, Object> studentData = new HashMap<>();
                studentData.put("enrollmentId", enrollment.getEnrollmentId());
                studentData.put("studentName", enrollment.getStudent().getUserName());
                return studentData;
            }).toList();

            response.put("students", students);
        } catch (Exception e) {
            response.put("error", "Failed to fetch students for course offering ID: " + courseOfferingId);
        }
        return response;
    }

    
    /**
     * Fetch course tracking entries for a specific student enrollment ID.
     */
    @GetMapping("/getTrackingEntries")
    @ResponseBody
    public Map<String, Object> getTrackingEntries(@RequestParam("studentEnrollmentId") int studentEnrollmentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Fetch course tracking entries
            List<RDCourseTracking> trackingEntries = courseTrackingService.getTrackingEntriesByEnrollmentId(studentEnrollmentId);

            // Map response for JSON
            List<Map<String, Object>> entries = trackingEntries.stream().map(tracking -> {
                Map<String, Object> trackingData = new HashMap<>();
                trackingData.put("trackingId", tracking.getTrackingId());
                trackingData.put("courseSession", Map.of("sessionTitle", tracking.getCourseSession().getSessionTitle()));
                trackingData.put("feedback", tracking.getFeedback());
                trackingData.put("filePaths", tracking.getFilePaths());
                trackingData.put("createdAt", tracking.getCreatedAt().toString()); // Format as needed
                return trackingData;
            }).toList();

            response.put("courseTrackingEntries", entries);
        } catch (Exception e) {
            response.put("error", "Failed to fetch tracking entries for student enrollment ID: " + studentEnrollmentId);
        }
        return response;
    }


    
    
    // Display manage course tracking view
    @GetMapping("/manageCourseTracking")
    public String manageCourseTracking(Model model, HttpSession session) {

        model.addAttribute("courses", courseService.getRDCourses());
        return "coursetracking/manageCourseTracking";
    }

    // Display form for mentor/admin to add a new tracking entry
    @GetMapping("/add")
    public String showAddTrackingForm(@RequestParam("courseOfferingId") int courseOfferingId, Model model) {
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseOfferingId);
        List<RDUser> enrolledStudents = enrollmentService.getStudentsEnrolledInOffering(courseOfferingId);

        model.addAttribute("students", enrolledStudents);
        model.addAttribute("courseSessions", courseSessions);
        model.addAttribute("trackingEntry", new RDCourseTracking());
        return "addCourseTracking";
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveTracking(
            @RequestParam int studentEnrollmentId,
            @RequestParam int courseSessionId,
            @RequestParam String feedback,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate trackingDate,
            @RequestParam(required = false) MultipartFile[] files,
            HttpSession session) {

        try {
        	
        	RDUser rdUser = null;
        	
        	System.out.println("studentEnrollmentId - " + studentEnrollmentId);

            if (session.getAttribute("rdUser") != null) {
                rdUser = (RDUser) session.getAttribute("rdUser");
            }
        	courseTrackingService.saveTracking(studentEnrollmentId, courseSessionId, feedback, trackingDate, files,rdUser);
            return ResponseEntity.ok("Tracking entry saved successfully.");
        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save tracking entry.");
        }
    }
    
    


    // View a course tracking entry
    @GetMapping("/view")
    @ResponseBody
    public RDCourseTracking viewTrackingEntry(@RequestParam("trackingId") int trackingId) {
        return courseTrackingService.getTrackingById(trackingId);
    }

    // Edit a course tracking entry
    @PostMapping("/update")
    public ResponseEntity<String> updateTrackingEntry(
            @RequestParam int trackingId,
            @RequestParam int courseSessionId,
            @RequestParam String feedback,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate trackingDate,
            @RequestParam(required = false) MultipartFile[] files) {

        RDCourseTracking existingTracking = courseTrackingService.getTrackingById(trackingId);
        existingTracking.setCourseSession(courseSessionService.getCourseSession(courseSessionId));
        existingTracking.setFeedback(feedback);
        existingTracking.setTrackingDate(trackingDate != null ? trackingDate : existingTracking.getTrackingDate());

        String updatedFilePaths = courseTrackingService.saveUploadedFiles(files);
        if (updatedFilePaths != null) {
            existingTracking.setFilePaths(updatedFilePaths);
        }

        courseTrackingService.updateTracking(existingTracking);
        return ResponseEntity.ok("Course tracking entry updated successfully.");
    }

    // Delete a course tracking entry
    @GetMapping("/delete")
    public String deleteTrackingEntry(@RequestParam("trackingId") int trackingId, RedirectAttributes redirectAttributes) {
        courseTrackingService.deleteTracking(trackingId);
        redirectAttributes.addFlashAttribute("message", "Course tracking entry deleted successfully.");
        return "redirect:/courseTracking/manageCourseTracking";
    }

   

   
}
