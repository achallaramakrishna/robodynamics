package com.robodynamics.controller;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpSession;

import com.robodynamics.model.RDSessionAssignmentUpload;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.dao.RDSessionAssignmentUploadDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/student/session-assignment")
public class RDSessionAssignmentUploadController {

	 @Autowired
	 private RDSessionAssignmentUploadDao uploadDao;

    @Autowired
    private RDCourseSessionDetailService sessionDetailService;

    /**
     * Upload assignment file for a session detail
     */
    @PostMapping("/upload")
    public String uploadAssignment(@RequestParam("sessionDetailId") int sessionDetailId,
                                   @RequestParam("assignmentFile") MultipartFile file,
                                   @RequestParam("courseId") int courseId,
                                   @RequestParam("enrollmentId") int enrollmentId,
                                   HttpSession session,
                                   RedirectAttributes redirectAttributes) {
        RDUser rdUser = null;
    	try {
        	
            // Get logged-in user from session
        	if (session.getAttribute("rdUser") != null) {
        		rdUser = (RDUser) session.getAttribute("rdUser");
        	}
            
            RDCourseSessionDetail sessionDetail = sessionDetailService.getRDCourseSessionDetail(sessionDetailId);

            // Upload file
            String uploadDir = "/opt/robodynamics/uploads/" + rdUser.getUserID() + "/";
            new File(uploadDir).mkdirs();

            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            file.transferTo(filePath.toFile());

            // Save upload metadata
            RDSessionAssignmentUpload upload = new RDSessionAssignmentUpload();
            upload.setStudent(rdUser);
            upload.setSessionDetail(sessionDetail);
            upload.setFileName(fileName);
            upload.setFilePath(filePath.toString());
            upload.setUploadTime(LocalDateTime.now());

            uploadDao.saveUpload(upload);

            redirectAttributes.addFlashAttribute("message", "Assignment uploaded successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("message", "Failed to upload assignment.");
        }

    	// Redirect back to the full dashboard with context
        return "redirect:/course/monitor?courseId=" + courseId + "&enrollmentId=" + enrollmentId;
    }

    /**
     * List previous uploads by logged-in student for the session
     */
    @GetMapping("/uploads/{sessionDetailId}")
    public String listUploads(@PathVariable("sessionDetailId") int sessionDetailId,
                              HttpSession session,
                              Model model) {
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            return "redirect:/login";
        }

        RDCourseSessionDetail sessionDetail = sessionDetailService.getRDCourseSessionDetail(sessionDetailId);
        List<RDSessionAssignmentUpload> uploads = uploadDao.getUploadsByStudentAndSessionDetail(rdUser, sessionDetail);

        model.addAttribute("uploads", uploads);
        model.addAttribute("sessionDetail", sessionDetail);
        return "student/uploads"; // JSP that lists previous uploads
    }
}
