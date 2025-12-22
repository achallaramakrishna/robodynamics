package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;


import com.robodynamics.dao.RDSessionAssignmentUploadDao;
import com.robodynamics.dto.RDCourseOfferingDTO;
import com.robodynamics.dto.StudentLiteDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDSessionAssignmentUpload;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDCourseSessionDetailService;

@Controller
@RequestMapping("/mentor/uploads")
public class RDMentorAssignmentController {

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDCourseOfferingService offeringService;

    @Autowired
    private RDStudentEnrollmentService enrollmentService;

    @Autowired
    private RDSessionAssignmentUploadDao uploadDao;

    @Autowired
    private RDCourseSessionDetailService sessionDetailService;

    @GetMapping
    public String manageAssignments(
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer offeringId,
            @RequestParam(required = false) Integer studentId,
            Model model) {

        // Always load courses
        model.addAttribute("courses", courseService.getRDCourses());

        // Preserve selected values for UI
        model.addAttribute("selectedCourseId", courseId);
        model.addAttribute("selectedOfferingId", offeringId);
        model.addAttribute("selectedStudentId", studentId);

        // Load uploads ONLY when student is selected
        if (studentId != null) {
            RDUser student = new RDUser();
            student.setUserID(studentId);

            List<RDSessionAssignmentUpload> uploads =
                    uploadDao.getUploadsByStudent(student);

            model.addAttribute("uploadedAssignments", uploads);
        }

        return "mentor/manage_assignments";
    }


    @GetMapping(
    	    value = "/ajax/offerings",
    	    produces = "application/json"
    	)
    @ResponseBody
    public List<RDCourseOfferingDTO> getOfferingsByCourse(@RequestParam("courseId") int courseId) {

        List<RDCourseOffering> offerings = offeringService.getRDCourseOfferingsListByCourse(courseId);

        // Convert Entity -> DTO
        return offerings.stream()
                .map(o -> {
                    // 🧠 Mentor name (handle nulls gracefully)
                    String mentorName = (o.getMentor() != null)
                            ? o.getInstructor().getFirstName() + 
                              (o.getInstructor().getLastName() != null ? " " + o.getInstructor().getLastName() : "")
                            : "Unassigned";

                    // 🕒 Time range (formatted as HH:mm-HH:mm)
                    String timeRange = (o.getSessionStartTime() != null && o.getSessionEndTime() != null)
                            ? o.getSessionStartTime() + " - " + o.getSessionEndTime()
                            : null;

                    // 📅 Days (Mon,Wed,Fri)
                    String days = o.getDaysOfWeek() != null ? o.getDaysOfWeek() : "";

                    // 💰 Fee amount
                    Double fee = o.getFeeAmount() != null ? o.getFeeAmount() : 0.0;

                    // ✅ Build DTO
                    RDCourseOfferingDTO dto = new RDCourseOfferingDTO();
                    dto.setCourseOfferingId(o.getCourseOfferingId());
                    dto.setCourseOfferingName(o.getCourseOfferingName());
                    dto.setStart(o.getStartDate() != null ? o.getStartDate().toString() : null);
                    dto.setEnd(o.getEndDate() != null ? o.getEndDate().toString() : null);
                    dto.setMentorName(mentorName);
                    dto.setFeeAmount(fee);
                    dto.setTimeRange(timeRange);
                    dto.setDaysOfWeek(days);

                    return dto;
                })
                .toList();
    }


    @GetMapping(
    	    value = "/ajax/students",
    	    produces = "application/json"
    	)
    @ResponseBody
    public List<StudentLiteDTO> getStudentsByOffering(
            @RequestParam(value="offeringId", required=false) Integer offeringId) {
        if (offeringId == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, "Missing offeringId");
        }

        List<RDStudentEnrollment> list = enrollmentService.getEnrolledStudentsByOfferingId(offeringId);

        // Map to unique students (if multiple enrollments per student)
        return list.stream()
            .map(e -> e.getStudent())
            .filter(java.util.Objects::nonNull)
            .collect(java.util.stream.Collectors.toMap(
                RDUser::getUserID,
                s -> new StudentLiteDTO(s.getUserID(), s.getFirstName(), s.getLastName()),
                (a, b) -> a))  // merge
            .values()
            .stream()
            .toList();
    }

	/*
	 * @GetMapping(params = { "studentId", "courseId" }) public String
	 * showStudentUploads(@RequestParam int studentId,
	 * 
	 * @RequestParam int courseId, Model model) { RDUser student = new RDUser();
	 * student.setUserID(studentId); List<RDSessionAssignmentUpload> uploads =
	 * uploadDao.getUploadsByStudent(student);
	 * 
	 * model.addAttribute("uploads", uploads); model.addAttribute("studentId",
	 * studentId); model.addAttribute("courseId", courseId); return
	 * "mentor/view_uploads"; }
	 */
    
    @GetMapping("/preview")
    public void preview(@RequestParam("path") String path, HttpServletResponse response) throws IOException {
        // Block unsafe access attempts
        if (path.contains("..") || path.startsWith("/") || path.startsWith("\\")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid file path");
            return;
        }

        // All files under one root directory (e.g., /opt/robodynamics/)
        File file = new File("/opt/robodynamics/", path);
        System.out.println(path);
        if (!file.exists() || !file.isFile()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "File not found");
            return;
        }

        String mimeType = Files.probeContentType(file.toPath());
        if (mimeType == null) {
            mimeType = "application/pdf";
        }

        response.setContentType(mimeType);
        response.setHeader("Content-Disposition", "inline; filename=\"" + file.getName() + "\"");
        response.setContentLengthLong(file.length());

        try (InputStream in = new FileInputStream(file);
             OutputStream out = response.getOutputStream()) {
            byte[] buffer = new byte[4096];
            int len;
            while ((len = in.read(buffer)) != -1) {
                out.write(buffer, 0, len);
            }
        }
    }


    @Transactional
    @PostMapping("/upload/grade")
    public String gradeAssignment(@RequestParam("uploadId") int uploadId,
                                  @RequestParam("score") int score,
                                  @RequestParam(value = "feedback", required = false) String feedback,
                                  @RequestParam(value = "courseId",   required = false) Integer courseId,
                                  @RequestParam(value = "offeringId", required = false) Integer offeringId,
                                  @RequestParam(value = "studentId",  required = false) Integer studentId) {

        RDSessionAssignmentUpload upload = uploadDao.getUpload(uploadId);
        if (upload == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Upload not found");
        }

        upload.setScore(score);
        upload.setFeedback(feedback);
        uploadDao.update(upload);

        // Fallbacks if any ID wasn't posted for some reason
        if (courseId == null && upload.getSessionDetail() != null && upload.getSessionDetail().getCourse() != null) {
            courseId = upload.getSessionDetail().getCourse().getCourseId();
        }
        if (studentId == null && upload.getStudent() != null) {
            studentId = upload.getStudent().getUserID();
        }
        // offeringId may legitimately be null if not modeled — that's okay.

     // Redirect back to the same filtered page
        return "redirect:/mentor/uploads?courseId=" + courseId +
               "&offeringId=" + offeringId +
               "&studentId=" + studentId;
    }


}
