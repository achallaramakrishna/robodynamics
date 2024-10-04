package com.robodynamics.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDAssignment;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDSlideService;
import com.robodynamics.service.RDStudentContentProgressService;
import com.robodynamics.service.RDFillInBlankQuestionService;
import com.robodynamics.service.Judge0Service;
import com.robodynamics.service.RDAssignmentService;

@Controller
@RequestMapping("/sessiondetail")
public class RDCourseSessionDetailController {
    
    @Autowired
    private Judge0Service judge0Service;

    @Autowired
    private RDSlideService slideService;

    @Autowired
    private RDFillInBlankQuestionService questionService;

    @Autowired
    private RDAssignmentService assignmentService;
    
    @Autowired
    private RDStudentContentProgressService progressService;

 // Start either slide or assignment session based on the content available
    @GetMapping("/start/{sessionDetailId}")
    public String startSession(@PathVariable("sessionDetailId") int sessionDetailId,
                               @RequestParam("enrollmentId") int enrollmentId,
                               Model model) {

        // Check if session has slides or assignments and start accordingly
        return checkSlidesOrAssignments(sessionDetailId, enrollmentId, model);
    }

    // Check if slides or assignments exist and redirect accordingly
    private String checkSlidesOrAssignments(int sessionDetailId, int enrollmentId, Model model) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);

        if (slides != null && !slides.isEmpty()) {
            return showSlide(model, slides, 0, sessionDetailId, enrollmentId);
        }

        List<RDAssignment> assignments = assignmentService.getAssignmentsByCourseSessionDetailId(sessionDetailId);
        if (assignments != null && !assignments.isEmpty()) {
            return showAssignment(model, assignments, 0, sessionDetailId, enrollmentId);
        }

        // No slides or assignments found, show an error
        model.addAttribute("message", "No slides or assignments available for this session.");
        return "error";
    }

    // Slide-related methods
    @GetMapping("/slide/start/{sessionDetailId}")
    public String startSlideSession(@PathVariable("sessionDetailId") int sessionDetailId,
                                    @RequestParam("enrollmentId") int enrollmentId,
                                    Model model) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);
        if (slides != null && !slides.isEmpty()) {
            return showSlide(model, slides, 0, sessionDetailId, enrollmentId);
        }
        model.addAttribute("message", "No slides available for this session.");
        return "error";
    }

    @PostMapping("/navigateSlides")
    public String navigateSlides(@RequestParam("currentSlide") int currentSlide,
                                 @RequestParam("direction") String direction,
                                 @RequestParam("sessionDetailId") int sessionDetailId,
                                 @RequestParam("enrollmentId") int enrollmentId,
                                 Model model) {
        // Fetch slides for the session
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);

        if (slides == null || slides.isEmpty()) {
            // Handle the case where no slides are found
            model.addAttribute("errorMessage", "No slides found for this session.");
            return "errorPage";
        }

        // Validate direction and navigate through slides
        if ("next".equals(direction) && currentSlide < slides.size() - 1) {
            currentSlide++;
        } else if ("prev".equals(direction) && currentSlide > 0) {
            currentSlide--;
        }

        // Log the current slide for debugging purposes
        System.out.println("Navigated to Slide: " + currentSlide + ", EnrollmentId: " + enrollmentId);

        // Track progress safely
        try {
            double progressPercentage = ((double) (currentSlide + 1) / slides.size()) * 100;
            updateProgress(enrollmentId, sessionDetailId, "slide", progressPercentage);
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Failed to update progress. Error: " + e.getMessage());
            return "errorPage";
        }

        return showSlide(model, slides, currentSlide, sessionDetailId, enrollmentId);
    }

    private String showSlide(Model model, List<RDSlide> slides, int currentSlideIndex, int sessionDetailId, int enrollmentId) {
        // Ensure the index is within bounds
        if (currentSlideIndex >= slides.size()) {
            currentSlideIndex = slides.size() - 1;
        } else if (currentSlideIndex < 0) {
            currentSlideIndex = 0;
        }

        RDSlide slide = slides.get(currentSlideIndex);
        List<RDFillInBlankQuestion> fillInBlankQuestions = questionService.getQuestionsBySlideId(slide.getSlideId());

        model.addAttribute("slide", slide);
        model.addAttribute("fillInBlankQuestions", fillInBlankQuestions);
        model.addAttribute("currentSlide", currentSlideIndex);
        model.addAttribute("slideCount", slides.size());
        model.addAttribute("sessionDetailId", sessionDetailId);
        model.addAttribute("enrollmentId", enrollmentId);

        // Fetch progress or initialize it if not present
        try {
            model.addAttribute("progress", progressService.getProgressBySessionDetail(enrollmentId, sessionDetailId));
        } catch (Exception e) {
            model.addAttribute("progress", 0);  // Default to 0% if no progress is available
        }

        return "slideShow";  // Return the slide view
    }

    // Helper method to update student progress
    private void updateProgress(int enrollmentId, int sessionDetailId, String contentType, double progress) {
        try {
            progressService.updateStudentContentProgress(enrollmentId, sessionDetailId, contentType, progress);
        } catch (Exception e) {
            System.err.println("Failed to update progress: " + e.getMessage());
        }
    }

    // Assignment-related methods
    @GetMapping("/assignment/start/{sessionDetailId}")
    public String startAssignmentSession(@PathVariable("sessionDetailId") int sessionDetailId,
                                         @RequestParam("enrollmentId") int enrollmentId,
                                         Model model) {
        List<RDAssignment> assignments = assignmentService.getAssignmentsByCourseSessionDetailId(sessionDetailId);
        if (assignments != null && !assignments.isEmpty()) {
            return showAssignment(model, assignments, 0, sessionDetailId, enrollmentId);
        }
        model.addAttribute("message", "No assignments available for this session.");
        return "error";
    }

    @PostMapping("/navigateAssignments")
    public String navigateAssignments(@RequestParam("currentAssignment") int currentAssignment,
                                      @RequestParam("direction") String direction,
                                      @RequestParam("sessionDetailId") int sessionDetailId,
                                      @RequestParam("enrollmentId") int enrollmentId,
                                      Model model) {
        List<RDAssignment> assignments = assignmentService.getAssignmentsByCourseSessionDetailId(sessionDetailId);
        if ("next".equals(direction) && currentAssignment < assignments.size() - 1) {
            currentAssignment++;
        } else if ("prev".equals(direction) && currentAssignment > 0) {
            currentAssignment--;
        }

        // Track progress for assignments
        updateProgress(enrollmentId, sessionDetailId, "assignment", ((double) (currentAssignment + 1) / assignments.size()) * 100);

        return showAssignment(model, assignments, currentAssignment, sessionDetailId, enrollmentId);
    }

    private String showAssignment(Model model, List<RDAssignment> assignments, int currentAssignmentIndex, int sessionDetailId, int enrollmentId) {
        RDAssignment assignment = assignments.get(currentAssignmentIndex);

        model.addAttribute("assignment", assignment);
        model.addAttribute("currentAssignment", currentAssignmentIndex);
        model.addAttribute("assignmentCount", assignments.size());
        model.addAttribute("sessionDetailId", sessionDetailId);
        model.addAttribute("enrollmentId", enrollmentId);

        return "assignmentShow";  // JSP for assignments
    }

    @PostMapping("/executeCode")
    @ResponseBody
    public String executeCode(@RequestParam("code") String code, @RequestParam("languageId") String languageId) {
        // Call the Judge0 service to execute the code
        String output = judge0Service.executeCode(code, languageId);
        return output;  // Return the result back to the front-end
    }
}
