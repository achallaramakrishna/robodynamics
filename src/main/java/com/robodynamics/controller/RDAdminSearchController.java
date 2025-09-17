package com.robodynamics.controller;

import com.robodynamics.dto.RDCourseOfferingDTO;
import com.robodynamics.dto.RDStudentInfoDTO;
import com.robodynamics.model.*;
import com.robodynamics.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/admin/search")
public class RDAdminSearchController {

    @Autowired private RDCourseService courseService;
    @Autowired private RDCourseOfferingService offeringService;
    @Autowired private RDUserService userService;
    @Autowired private RDStudentEnrollmentService enrollmentService;
    @Autowired private RDClassAttendanceService attendanceService;
    @Autowired private RDCourseTrackingService trackingService;

    /**
     * ✅ Load Search Page with ALL dropdown data
     */
    @GetMapping
    public String showSearchPage(Model model, HttpSession session) {
        // Courses
        List<RDCourse> courseList = courseService.getRDCourses();
        model.addAttribute("courseList", courseList);

        // Offerings (initial full list is fine; client will reload by course)
        List<RDCourseOffering> offeringList = offeringService.getRDCourseOfferings();
        model.addAttribute("offeringList", offeringList);

        // Students: start EMPTY so the dropdown gets filled via AJAX by course/offering
        model.addAttribute("studentList", new ArrayList<RDStudentInfoDTO>());

        return "admin/search";
    }

    /**
     * ✅ Filter results based on optional course, offering, and student params
     */
    @GetMapping("/filter")
    public String filterResults(
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer offeringId,
            @RequestParam(required = false) Integer enrollmentId,
            Model model) {

        List<RDStudentEnrollment> results;

        if (enrollmentId != null && enrollmentId > 0) {
            results = new ArrayList<>();
            RDStudentEnrollment e = enrollmentService.getRDStudentEnrollment(enrollmentId);
            if (e != null) results.add(e);

        } else if (offeringId != null && offeringId > 0) {
            results = enrollmentService.getEnrolledStudentsByOfferingId(offeringId);

        } else if (courseId != null && courseId > 0) {
            results = enrollmentService.getEnrollmentsByCourseId(courseId);

        } else {
            results = enrollmentService.getRDStudentEnrollments();
        }

        model.addAttribute("results", results);
        return "admin/fragments/search-results";
    }

    /**
     * ✅ Student details (for modal)
     */
    @GetMapping("/details")
    public String getStudentDetailsByEnrollment(
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);
        RDUser student = enrollment.getStudent();
        RDCourseOffering offering = enrollment.getCourseOffering();

        List<RDClassAttendance> attendanceList = attendanceService.getAttendanceByEnrollment(enrollmentId);
        List<RDCourseTracking> trackingList = trackingService.getTrackingByEnrollment(enrollmentId);

        model.addAttribute("student", student);
        model.addAttribute("offering", offering);
        model.addAttribute("attendanceList", attendanceList);
        model.addAttribute("trackingList", trackingList);

        return "admin/fragments/student-detail";
    }

    /**
     * ✅ Offeringss by course (JSON for the offerings dropdown)
     */
    @GetMapping(value = "/offerings", produces = "application/json")
    @ResponseBody
    public List<RDCourseOfferingDTO> getOfferingsByCourse(@RequestParam int courseId) {
        List<RDCourseOffering> list = offeringService.getRDCourseOfferingsListByCourse(courseId);
     // Convert entity -> DTO
        return list.stream()
                .map(o -> new RDCourseOfferingDTO(
                        o.getCourseOfferingId(),         // entity id
                        o.getCourseOfferingName(),          // or o.getCourseOfferingName()
                        o.getStartDate(),
                        o.getEndDate()
                ))
                .toList();
    }



    /**
     * ✅ Students by course/offering (JSON for the students dropdown)
     *    - If offeringId is present, filter by offering
     *    - Else if courseId is present, filter by course
     *    - Else return empty (so initial page doesn't show all students)
     */
    @GetMapping(value = "/students", produces = "application/json")
    @ResponseBody
    public List<RDStudentInfoDTO> getStudents(
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer offeringId) {

        List<RDStudentInfoDTO> dto = new ArrayList<>();
        List<RDStudentEnrollment> enrollments;

        if (offeringId != null && offeringId > 0) {
            enrollments = enrollmentService.getEnrolledStudentsByOfferingId(offeringId);
        } else if (courseId != null && courseId > 0) {
            enrollments = enrollmentService.getEnrollmentsByCourseId(courseId);
        } else {
            enrollments = new ArrayList<>(); // nothing selected yet -> empty
        }

        for (RDStudentEnrollment e : enrollments) {
            RDUser s = e.getStudent();
            dto.add(new RDStudentInfoDTO(e.getEnrollmentId(), s.getFirstName(), s.getLastName()));
        }
        return dto;
    }


    /**
     * ✅ ALL Summary (All courses → offerings → students)
     */
    @GetMapping("/all-summary")
    public String getAllSummary(Model model) {
        List<RDCourse> allCourses = courseService.getAllCoursesWithOfferingsAndEnrollments();
        model.addAttribute("allCourses", allCourses);
        return "admin/fragments/all-summary";
    }
}
