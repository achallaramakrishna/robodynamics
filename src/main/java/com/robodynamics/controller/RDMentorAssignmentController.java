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
    public String showAssignmentManagementPage(Model model) {
        model.addAttribute("courses", courseService.getRDCourses());
        return "mentor/manage_assignments";
    }

    @GetMapping("/ajax/offerings")
    @ResponseBody
    public List<RDCourseOffering> getOfferingsByCourse(@RequestParam("courseId") int courseId) {
        return offeringService.getRDCourseOfferingsListByCourse(courseId);
    }

    @GetMapping("/ajax/students")
    @ResponseBody
    public List<RDStudentEnrollment> getStudentsByOffering(@RequestParam("offeringId") int offeringId) {
        return enrollmentService.getEnrolledStudentsByOfferingId(offeringId);
    }


    @GetMapping(params = { "studentId", "courseId" })
    public String showStudentUploads(@RequestParam int studentId,
                                     @RequestParam int courseId,
                                     Model model) {
        RDUser student = new RDUser();
        student.setUserID(studentId);
        List<RDSessionAssignmentUpload> uploads = uploadDao.getUploadsByStudent(student);

        model.addAttribute("uploads", uploads);
        model.addAttribute("studentId", studentId);
        model.addAttribute("courseId", courseId);
        return "mentor/view_uploads";
    }
    
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
                                  @RequestParam(value = "feedback", required = false) String feedback) {

        RDSessionAssignmentUpload upload = uploadDao.getUpload(uploadId);

        if (upload != null) {
            upload.setScore(score);
            upload.setFeedback(feedback);
            uploadDao.update(upload);  // Make sure your DAO supports update()
        }

        // Redirect back to the same page (optional: add courseId and studentId if you want to retain selection)
        return "redirect:/mentor/uploads?studentId=" + upload.getStudent().getUserID() +
               "&courseId=" + upload.getSessionDetail().getCourse().getCourseId();
    }

}
