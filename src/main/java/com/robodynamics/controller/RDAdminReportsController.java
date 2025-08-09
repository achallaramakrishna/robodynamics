package com.robodynamics.controller;

import com.robodynamics.dto.*; // Create DTOs for each report later
import com.robodynamics.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin/reports")
public class RDAdminReportsController {

    @Autowired private RDCourseService courseService;
    @Autowired private RDMentorService mentorService;
    @Autowired private RDAdminReportService reportService;

    @GetMapping
    public String showReportsDashboard(Model model) {
        model.addAttribute("courseList", courseService.getRDCourses());
        model.addAttribute("mentorList", mentorService.getAllMentors());
        return "admin/reports-dashboard";
    }

    @GetMapping("/course-offerings")
    @ResponseBody
    public List<RDCourseOfferingSummaryDTO> getCourseOfferingSummary(
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer mentorId) {
        return reportService.courseOfferingSummary(courseId, mentorId);
    }

    @GetMapping("/admin/reports/enrollments")
    @ResponseBody
    public List<RDEnrollmentReportDTO> getEnrollmentReport(
            @RequestParam(value = "offeringId", required = false) String offeringIdStr) {
    	System.out.println("hello...........1...........");
        Integer offeringId = (offeringIdStr == null || offeringIdStr.isBlank()) ? null : Integer.valueOf(offeringIdStr);
        return reportService.enrollmentReport(offeringId);
    }

    @GetMapping("/offerings-by-course")
    @ResponseBody
    public List<Map<String,Object>> getOfferingsByCourse(@RequestParam int courseId) {
        return reportService.offeringsByCourse(courseId);
    }
}
