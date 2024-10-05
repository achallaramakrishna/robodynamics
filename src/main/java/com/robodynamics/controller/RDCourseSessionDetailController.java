package com.robodynamics.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDAssignment;
import com.robodynamics.model.RDQuestion;
import com.robodynamics.model.RDSlide;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserPoints;
import com.robodynamics.service.Judge0Service;
import com.robodynamics.service.RDQuestionService;
import com.robodynamics.service.RDSlideService;
import com.robodynamics.service.RDStudentContentProgressService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserPointsService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.RDAssignmentService;

@Controller
@RequestMapping("/sessiondetail")
public class RDCourseSessionDetailController {

    @Autowired
    private Judge0Service judge0Service;

    @Autowired
    private RDSlideService slideService;

    @Autowired
    private RDQuestionService questionService;

    @Autowired
    private RDAssignmentService assignmentService;

    @Autowired
    private RDStudentContentProgressService progressService;

    @Autowired
    private RDUserPointsService userPointsService;

    @Autowired
    private RDUserService userService;

    @Autowired
    private RDStudentEnrollmentService enrollmentService;

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
            model.addAttribute("errorMessage", "No slides found for this session.");
            return "errorPage";
        }

        // Validate direction and navigate through slides
        if ("next".equals(direction) && currentSlide < slides.size() - 1) {
            currentSlide++;
        } else if ("prev".equals(direction) && currentSlide > 0) {
            currentSlide--;
        }

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

        // Fetch "fill-in-the-blank" questions by slide ID
        List<RDQuestion> fillInBlankQuestions = questionService.getQuestionsBySlideId(slide.getSlideId(), "fill_in_the_blank");

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

    @PostMapping("/submitAnswers")
    public String submitSlideAnswers(
        @RequestParam Map<String, String> allParams,
        @RequestParam("slideId") int slideId,
        @RequestParam("sessionDetailId") int sessionDetailId,
        @RequestParam("currentSlide") int currentSlide,
        @RequestParam("enrollmentId") int enrollmentId,
        Model model) {

        // Fetch "fill-in-the-blank" questions related to the current slide
        List<RDQuestion> fillInBlankQuestions = questionService.getQuestionsBySlideId(slideId, "fill_in_the_blank");
        Map<Integer, Boolean> correctness = new HashMap<>();
        Map<Integer, String> submittedAnswers = new HashMap<>();
        int totalPoints = 0; // Total points earned
        int possiblePoints = 0; // Maximum points for the slide

		boolean allCorrect = true;  // Variable to track if all answers are correct
        
        // Loop through questions to check correctness and calculate points
        for (RDQuestion question : fillInBlankQuestions) {
            String submittedAnswer = allParams.get("answers[" + question.getQuestionId() + "]");
            submittedAnswers.put(question.getQuestionId(), submittedAnswer);
            
            boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(submittedAnswer);
            correctness.put(question.getQuestionId(), isCorrect);

            // Calculate points if the answer is correct
            if (isCorrect) {
                totalPoints += question.getPoints();
            } else {
                allCorrect = false;  // Mark as false if any answer is incorrect
            }

            // Add up the possible points for all questions
            possiblePoints += question.getPoints();
        }

        // Add attributes to model for JSP
        model.addAttribute("slide", slideService.getSlideById(slideId));
        model.addAttribute("fillInBlankQuestions", fillInBlankQuestions);
        model.addAttribute("correctness", correctness);
        model.addAttribute("submittedAnswers", submittedAnswers);
        model.addAttribute("totalPoints", totalPoints); // Send total points to the view
        model.addAttribute("possiblePoints", possiblePoints); // Send possible points
        model.addAttribute("sessionDetailId", sessionDetailId);
        model.addAttribute("enrollmentId", enrollmentId);
        model.addAttribute("currentSlide", currentSlide);
        model.addAttribute("slideCount", slideService.getSlidesBySessionDetailId(sessionDetailId).size());
        model.addAttribute("progress", progressService.getProgressBySessionDetail(enrollmentId, sessionDetailId));

        // If all answers are correct, add points and set a flag to show the points modal
        if (allCorrect) {
            int points = calculatePoints(fillInBlankQuestions);  // You can assign points per question or slide.
            addUserPoints(enrollmentId, points);
            model.addAttribute("pointsEarned", points);  // Pass the points earned to the JSP
            model.addAttribute("allCorrect", true);      // Flag indicating that all answers were correct
        } else {
            model.addAttribute("allCorrect", false);     // Set flag as false if not all answers are correct
        }
        
        return "slideShow";  // Return the updated slide show view
    }

    // Method to calculate total points for correct answers
    private int calculatePoints(List<RDQuestion> fillInBlankQuestions) {
        int totalPoints = 0;
        for (RDQuestion question : fillInBlankQuestions) {
            totalPoints += question.getPoints();  // Assuming you have points for each question
        }
        return totalPoints;
    }

    // Method to add points to the user
    private void addUserPoints(int enrollmentId, int points) {
        int userId = enrollmentService.getUserIdFromEnrollment(enrollmentId);
        
        RDUser user = userService.getRDUser(userId);
        // Fetch existing points
        RDUserPoints userPoints = userPointsService.findByUserId(userId);
        
        if (userPoints == null) {
            // Create new entry if the user doesn't have any points yet
            userPoints = new RDUserPoints();
            userPoints.setUser(user);
            userPoints.setTotalPoints(points);
        } else {
            // Update existing points
            userPoints.setTotalPoints(userPoints.getTotalPoints() + points);
        }
        
        userPointsService.saveOrUpdate(userPoints);
    }

    @PostMapping("/executeCode")
    @ResponseBody
    public String executeCode(@RequestParam("code") String code, @RequestParam("languageId") String languageId) {
        // Call the Judge0 service to execute the code
        String output = judge0Service.executeCode(code, languageId);
        return output;  // Return the result back to the front-end
    }
}
