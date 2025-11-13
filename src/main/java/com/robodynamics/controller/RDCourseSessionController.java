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

import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/courseSession")
public class RDCourseSessionController {

    @Autowired
    private RDCourseService courseService;  // Service to manage courses

    @Autowired
    private RDCourseSessionService courseSessionService;  // Service to manage course sessions

    /**
     * List all units and their child sessions for a selected course.
     */
    @GetMapping("/list")
    public String listCourseSessions(@RequestParam(required = false) Integer courseId, Model model) {
        List<RDCourseSession> sessions = null;

        // Fetch all courses for the course selection dropdown
        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);

        if (courseId != null && courseId > 0) {
            // Fetch units and their child sessions
        	sessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        }

        if (sessions == null || sessions.isEmpty()) {
            model.addAttribute("message", "No course units available for the selected course.");
        } else {
            model.addAttribute("sessions", sessions);
        }

        model.addAttribute("selectedCourseId", courseId != null ? courseId : 0);
        return "coursesessions/listCourseSessions";
    }

    /**
     * Show form to add a new unit.
     */
    @GetMapping("/addUnit")
    public String showAddUnitForm(@RequestParam("courseId") int courseId, Model model) {
        RDCourseSession unit = new RDCourseSession();
        RDCourse course = courseService.getRDCourse(courseId);
        unit.setCourse(course);
        unit.setSessionType("unit");  // Mark as unit
        model.addAttribute("courseSession", unit);
        model.addAttribute("courseId", courseId);
        return "coursesessions/unitForm";
    }

    /**
     * Show form to add a new session.
     */
    @GetMapping("/addSession")
    public String showAddSessionForm(@RequestParam("courseId") int courseId, Model model) {
        RDCourseSession session = new RDCourseSession();
        RDCourse course = courseService.getRDCourse(courseId);
        session.setCourse(course);
        session.setSessionType("session");  // Mark as session

        // Get units to populate the parent unit dropdown
        List<RDCourseSession> units = courseSessionService.getUnitsByCourseId(courseId);
        model.addAttribute("units", units);

        model.addAttribute("courseSession", session);
        model.addAttribute("courseId", courseId);
        return "coursesessions/sessionForm";
    }

    /**
     * Show form to edit an existing unit.
     */
    @GetMapping("/editUnit")
    public String showEditUnitForm(@RequestParam("courseSessionId") int courseSessionId, Model model) {
        RDCourseSession unit = courseSessionService.getCourseSession(courseSessionId);
        if (unit == null) {
            model.addAttribute("error", "Unit not found.");
            return "redirect:/courseSession/list";
        }
        model.addAttribute("courseSession", unit);
        model.addAttribute("courseId", unit.getCourse().getCourseId());
        return "coursesessions/unitForm";
    }

    /**
     * Show form to edit an existing session.
     */
    @GetMapping("/editSession")
    public String showEditSessionForm(@RequestParam("courseSessionId") int courseSessionId, Model model) {
        RDCourseSession session = courseSessionService.getCourseSession(courseSessionId);
        if (session == null) {
            model.addAttribute("error", "Session not found.");
            return "redirect:/courseSession/list";
        }

        // Get units to populate the parent unit dropdown
        List<RDCourseSession> units = courseSessionService.getUnitsByCourseId(session.getCourse().getCourseId());
        model.addAttribute("units", units);

        model.addAttribute("courseSession", session);
        model.addAttribute("courseId", session.getCourse().getCourseId());
        return "coursesessions/sessionForm";
    }

    /**
     * Save a new or edited unit.
     */
    @PostMapping("/saveUnit")
    public String saveUnit(@ModelAttribute("courseSession") RDCourseSession unit, RedirectAttributes redirectAttributes) {
        try {
            // Set creation date if it's a new unit
            if (unit.getCourseSessionId() == 0) {
                unit.setCreationDate(new Date());
            }
            unit.setParentSession(null);  // Units have no parent session
            unit.setSessionType("unit");  // Ensure sessionType is 'unit'

            // Save the unit
            courseSessionService.saveCourseSession(unit);
            redirectAttributes.addFlashAttribute("message", "Unit saved successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error saving the unit: " + e.getMessage());
            return "redirect:/courseSession/list?courseId=" + unit.getCourse().getCourseId();
        }
        return "redirect:/courseSession/list?courseId=" + unit.getCourse().getCourseId();
    }

    /**
     * Save a new or edited session.
     */
    @PostMapping("/saveSession")
    public String saveSession(@ModelAttribute("courseSession") RDCourseSession session, RedirectAttributes redirectAttributes) {
        try {
            // Set creation date if it's a new session
            if (session.getCourseSessionId() == 0) {
                session.setCreationDate(new Date());
            }
            session.setSessionType("session");  // Ensure sessionType is 'session'

            // Fetch and set the parent unit
            RDCourseSession parentUnit = courseSessionService.getCourseSession(session.getParentSession().getCourseSessionId());
            session.setParentSession(parentUnit);

            // Save the session
            courseSessionService.saveCourseSession(session);
            redirectAttributes.addFlashAttribute("message", "Session saved successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error saving the session: " + e.getMessage());
            return "redirect:/courseSession/list?courseId=" + session.getCourse().getCourseId();
        }
        return "redirect:/courseSession/list?courseId=" + session.getCourse().getCourseId();
    }

    /**
     * Handle JSON file upload to process units and sessions.
     */
    @PostMapping("/uploadJson")
    public String handleJsonUpload(@RequestParam("file") MultipartFile file, 
                                  @RequestParam("courseId") Integer courseId, 
                                  RedirectAttributes redirectAttributes) {
        // Validate if the file is empty
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/courseSession/list?courseId=" + courseId;
        }
        try {
            // Validate if courseId is present
            if (courseId == null || courseId <= 0) {
                redirectAttributes.addFlashAttribute("error", "Invalid course ID. Please select a valid course.");
                return "redirect:/courseSession/list";
            }

            // Process the JSON file for the specified course
            courseSessionService.processJson(file, courseId);
            redirectAttributes.addFlashAttribute("message", "JSON file uploaded and processed successfully for course ID: " + courseId);
        } catch (Exception e) {
            // Handle any error during the processing
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
        }
        // Redirect back to the listCourseSessions page
        return "redirect:/courseSession/list?courseId=" + courseId;
    }

    /**
     * Delete a unit or session by its ID.
     */
    @GetMapping("/delete")
    public String deleteCourseSession(@RequestParam("courseSessionId") int courseSessionId, RedirectAttributes redirectAttributes) {
        try {
            RDCourseSession courseSession = courseSessionService.getCourseSession(courseSessionId);
            if (courseSession != null) {
                int courseId = courseSession.getCourse().getCourseId();
                courseSessionService.deleteCourseSession(courseSessionId);
                redirectAttributes.addFlashAttribute("successMessage", "Course session deleted successfully.");
                return "redirect:/courseSession/list?courseId=" + courseId;
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Course session not found.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting the course session: " + e.getMessage());
        }
        return "redirect:/courseSession/list";
    }
}
