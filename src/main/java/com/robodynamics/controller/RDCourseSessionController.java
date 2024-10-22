package com.robodynamics.controller;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/courseSession")
public class RDCourseSessionController {

    @Autowired
    private RDCourseService courseService;  // Service to manage courses
    
    // private static final String UPLOAD_DIR = "c:\\coursedata\\";


    @Autowired
    private RDCourseSessionService courseSessionService;  // Service to manage course sessions

    @GetMapping("/list")
    public String listCourseSessions(@RequestParam(required = false) Integer courseId, Model model) {
        List<RDCourseSession> courseSessions = null;

        // Fetch all courses for the course selection dropdown
        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);

        if (courseId != null && courseId > 0) {
            courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        }

        if (courseSessions == null || courseSessions.isEmpty()) {
            model.addAttribute("message", "No course sessions available for the selected course.");
        } else {
            model.addAttribute("courseSessions", courseSessions);
        }

        model.addAttribute("selectedCourseId", courseId != null ? courseId : 0);
        return "coursesessions/listCourseSessions";
    }

    @GetMapping("/add")
    public String showAddForm(@RequestParam("courseId") int courseId, Model model) {
        RDCourseSession courseSession = new RDCourseSession();
        model.addAttribute("courseId", courseId);  // Pass the selected courseId
        model.addAttribute("courseSession", courseSession);
        return "coursesessions/addEditCourseSession";
    }

    
    @GetMapping("/edit")
    public String showEditForm(@RequestParam("courseSessionId") int courseSessionId, Model model) {
        RDCourseSession courseSession = courseSessionService.getCourseSession(courseSessionId);
        if (courseSession == null) {
            model.addAttribute("error", "Course session not found.");
            return "redirect:/courseSession/list";
        }

        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);
        model.addAttribute("courseSession", courseSession);
        return "coursesessions/addEditCourseSession";
    }

    @PostMapping("/save")
    public String saveCourseSession(@ModelAttribute("courseSession") RDCourseSession courseSession, RedirectAttributes redirectAttributes) {
        try {
            // Set creation date if it’s a new session
            if (courseSession.getCourseSessionId() == 0) {
                courseSession.setCreationDate(new Date());  // Set the current date as the creation date
            }
            
            // Save the course session
            courseSessionService.saveCourseSession(courseSession);
            redirectAttributes.addFlashAttribute("message", "Course session saved successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error saving the course session.");
            return "redirect:/courseSession/list?courseId=" + courseSession.getCourse().getCourseId();
        }
        return "redirect:/courseSession/list?courseId=" + courseSession.getCourse().getCourseId();
    }


    @PostMapping("/uploadJson")
    public String handleJsonUpload(@RequestParam("file") MultipartFile file, 
                                  @RequestParam("courseId") Integer courseId, 
                                  RedirectAttributes redirectAttributes) {
    	
    	System.out.println("step 11 ... ");
        // Validate if the file is empty
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/courseSession/list?courseId=" + courseId;
        }
        System.out.println("step 12 ... ");
        try {
            // Validate if courseId is present
            if (courseId == null || courseId <= 0) {
                redirectAttributes.addFlashAttribute("error", "Invalid course ID. Please select a valid course.");
                return "redirect:/courseSession/list";
            }
            System.out.println("step 13 ... ");
         // Save the file locally
         //   String fileName = file.getOriginalFilename();
         //   String filePath = UPLOAD_DIR + fileName;
         //   File destinationFile = new File(filePath);
         //   file.transferTo(destinationFile);
            // Process the JSON file for the specified course
            System.out.println("step 14 ... ");
            courseSessionService.processJson(file, courseId);
            System.out.println("step 15 ... ");
            redirectAttributes.addFlashAttribute("message", "JSON file uploaded and processed successfully for course ID: " + courseId);
        } catch (Exception e) {
            // Handle any error during the processing
        	e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
        }

        System.out.println("step 16 ... ");
        // Redirect back to the listCourseSessions page
        return "redirect:/courseSession/list?courseId=" + courseId;
    }


    @GetMapping("/delete")
    public String deleteCourseSession(@RequestParam("courseSessionId") int courseSessionId, RedirectAttributes redirectAttributes) {
        try {
            RDCourseSession courseSession = courseSessionService.getCourseSession(courseSessionId);
            if (courseSession != null) {
                courseSessionService.deleteCourseSession(courseSessionId);
                redirectAttributes.addFlashAttribute("message", "Course session deleted successfully.");
            } else {
                redirectAttributes.addFlashAttribute("error", "Course session not found.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting the course session.");
        }
        return "redirect:/courseSession/list";
    }
    
    
}
