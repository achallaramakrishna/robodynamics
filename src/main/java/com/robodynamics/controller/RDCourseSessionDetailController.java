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

    // Route to start either slide or assignment session based on the content available
    @GetMapping("/start/{sessionDetailId}")
    public String startSession(@PathVariable("sessionDetailId") int sessionDetailId, Model model) {
        // Check if session has slides or assignments and start accordingly
        return checkSlidesOrAssignments(sessionDetailId, model);
    }

    // Check if slides or assignments exist and redirect to the appropriate handler
    private String checkSlidesOrAssignments(int sessionDetailId, Model model) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);

        if (!slides.isEmpty()) {
            return showSlide(model, slides, 0, sessionDetailId);
        }

        List<RDAssignment> assignments = assignmentService.getAssignmentsByCourseSessionDetailId(sessionDetailId);
        if (!assignments.isEmpty()) {
            return showAssignment(model, assignments, 0, sessionDetailId);
        }

        // No slides or assignments found, show an error
        model.addAttribute("message", "No slides or assignments available for this session.");
        return "error";
    }

    // Slide-related methods
    @GetMapping("/slide/start/{sessionDetailId}")
    public String startSlideSession(@PathVariable("sessionDetailId") int sessionDetailId, Model model) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);
        if (!slides.isEmpty()) {
            return showSlide(model, slides, 0, sessionDetailId);
        }
        model.addAttribute("message", "No slides available for this session.");
        return "error";
    }

    @PostMapping("/navigateSlides")
    public String navigateSlides(@RequestParam("currentSlide") int currentSlide,
                                 @RequestParam("direction") String direction,
                                 @RequestParam("sessionDetailId") int sessionDetailId,
                                 Model model) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);
        if ("next".equals(direction) && currentSlide < slides.size() - 1) {
            currentSlide++;
        } else if ("prev".equals(direction) && currentSlide > 0) {
            currentSlide--;
        }

        return showSlide(model, slides, currentSlide, sessionDetailId);
    }

    private String showSlide(Model model, List<RDSlide> slides, int currentSlideIndex, int sessionDetailId) {
        RDSlide slide = slides.get(currentSlideIndex);
        List<RDFillInBlankQuestion> fillInBlankQuestions = questionService.getQuestionsBySlideId(slide.getSlideId());

        model.addAttribute("slide", slide);
        model.addAttribute("fillInBlankQuestions", fillInBlankQuestions);
        model.addAttribute("currentSlide", currentSlideIndex);
        model.addAttribute("slideCount", slides.size());
        model.addAttribute("sessionDetailId", sessionDetailId);

        return "slideShow";  // JSP for slides
    }

    @PostMapping("/submitSlideAnswers")
    public String submitSlideAnswers(@RequestParam Map<String, String> allParams,
                                     @RequestParam("slideId") int slideId,
                                     @RequestParam("sessionDetailId") int sessionDetailId,
                                     Model model) {
        List<RDFillInBlankQuestion> fillInBlankQuestions = questionService.getQuestionsBySlideId(slideId);
        Map<Integer, Boolean> correctness = new HashMap<>();
        Map<Integer, String> submittedAnswers = new HashMap<>();

        for (RDFillInBlankQuestion question : fillInBlankQuestions) {
            String submittedAnswer = allParams.get("answers[" + question.getQuestionId() + "]");
            submittedAnswers.put(question.getQuestionId(), submittedAnswer);
            correctness.put(question.getQuestionId(), question.getAnswer().equalsIgnoreCase(submittedAnswer));
        }

        RDSlide slide = slideService.getSlideById(slideId);

        model.addAttribute("slide", slide);
        model.addAttribute("fillInBlankQuestions", fillInBlankQuestions);
        model.addAttribute("correctness", correctness);
        model.addAttribute("submittedAnswers", submittedAnswers);
        model.addAttribute("sessionDetailId", sessionDetailId);
        model.addAttribute("currentSlide", Integer.parseInt(allParams.get("currentSlide")));
        model.addAttribute("slideCount", slideService.getSlidesBySessionDetailId(sessionDetailId).size());

        return "slideShow";
    }

    // Assignment-related methods
    @GetMapping("/assignment/start/{sessionDetailId}")
    public String startAssignmentSession(@PathVariable("sessionDetailId") int sessionDetailId, Model model) {
        List<RDAssignment> assignments = assignmentService.getAssignmentsByCourseSessionDetailId(sessionDetailId);
        if (!assignments.isEmpty()) {
            return showAssignment(model, assignments, 0, sessionDetailId);
        }
        model.addAttribute("message", "No assignments available for this session.");
        return "error";
    }

    @PostMapping("/navigateAssignments")
    public String navigateAssignments(@RequestParam("currentAssignment") int currentAssignment,
                                      @RequestParam("direction") String direction,
                                      @RequestParam("sessionDetailId") int sessionDetailId,
                                      Model model) {
        List<RDAssignment> assignments = assignmentService.getAssignmentsByCourseSessionDetailId(sessionDetailId);
        if ("next".equals(direction) && currentAssignment < assignments.size() - 1) {
            currentAssignment++;
        } else if ("prev".equals(direction) && currentAssignment > 0) {
            currentAssignment--;
        }

        return showAssignment(model, assignments, currentAssignment, sessionDetailId);
    }

    private String showAssignment(Model model, List<RDAssignment> assignments, int currentAssignmentIndex, int sessionDetailId) {
        RDAssignment assignment = assignments.get(currentAssignmentIndex);

        model.addAttribute("assignment", assignment);
        model.addAttribute("currentAssignment", currentAssignmentIndex);
        model.addAttribute("assignmentCount", assignments.size());
        model.addAttribute("sessionDetailId", sessionDetailId);

        return "assignmentShow";  // JSP for assignments
    }

    @PostMapping("/submitAssignment")
    @ResponseBody  // This ensures the method returns JSON data
    public Map<String, Object> submitAssignment(
            @RequestParam("code") String code,
            @RequestParam("assignmentId") int assignmentId,
            @RequestParam("sessionDetailId") int sessionDetailId,
            @RequestParam("languageId") int languageId) {

        Map<String, Object> response = new HashMap<>();  // Use a map to store the response data

        System.out.println("Start: Submitting code to Judge0 API");

        // Use the Judge0Service to execute the code
        String executionResult = judge0Service.executeCode(code, String.valueOf(languageId));

        String resultMessage;
        if (executionResult.contains("Accepted")) {
            resultMessage = "Accepted";
        } else {
            resultMessage = "Rejected - " + executionResult;
        }

        // Add execution result and message to the response map
        response.put("resultMessage", resultMessage);
        response.put("output", executionResult);

        System.out.println("End: Code submission complete");

        // Return the response as JSON
        return response;
    }

    
    @PostMapping("/executeCode")
    @ResponseBody
    public String executeCode(@RequestParam("code") String code, @RequestParam("languageId") String languageId) {
        // Call the Judge0 service to execute the code
        String output = judge0Service.executeCode(code, languageId);
        return output;  // Return the result back to the front-end
    }
}
