package com.robodynamics.controller;

import java.io.File;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.model.RDAssignment;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDQuestion;
import com.robodynamics.model.RDSlide;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserPoints;
import com.robodynamics.service.Judge0Service;
import com.robodynamics.service.RDAssignmentService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDQuestionService;
import com.robodynamics.service.RDSlideService;
import com.robodynamics.service.RDStudentContentProgressService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserPointsService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.wrapper.CourseSessionDetailJson;

@Controller
@RequestMapping("/sessiondetail")
public class RDCourseSessionDetailController {
	
    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;  // Service to manage course session details

   // private static final String UPLOAD_DIR = "c:\\coursedata\\";


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
    
    @GetMapping("/list")
    public String listCourseSessionDetails(@RequestParam(required = false) Integer courseId, Model model) {
        List<RDCourseSessionDetail> courseSessionDetails = null;

        // Step 1: Fetch all courses for the course selection dropdown
        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);

        // Step 2: If courseId is present, fetch all course sessions and their session details
        if (courseId != null && courseId > 0) {
             // Step 3: Fetch all session details for all course sessions related to the course
            courseSessionDetails = courseSessionDetailService.getRDCourseSessionDetails(courseId);
            System.out.println("helllo.................");
            for(RDCourseSessionDetail detail : courseSessionDetails) {
            	System.out.println(detail.getSessionDetailId() + "\t" + detail.getCourseSession().getSessionId() + "\t" + detail.getCourse().getCourseId());
            }
        }

        // Step 4: Handle case when no session details are found
        if (courseSessionDetails == null || courseSessionDetails.isEmpty()) {
            model.addAttribute("message", "No course session details available for the selected course.");
        } else {
            model.addAttribute("courseSessionDetails", courseSessionDetails);
        }

        // Step 5: Add the selected courseId to the model for UI use
        model.addAttribute("selectedCourseId", courseId != null ? courseId : 0);

        return "coursesessiondetails/listCourseSessionDetails";
    }

    
    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", courseSessions);
        return response;
    }
    

    @GetMapping("/add")
    public String showAddForm(@RequestParam("courseId") int courseId,
                              @RequestParam("courseSessionId") int courseSessionId,
                              Model model) {
        RDCourseSessionDetail courseSessionDetail = new RDCourseSessionDetail();
        model.addAttribute("courseId", courseId);
        model.addAttribute("courseSessionId", courseSessionId);
        model.addAttribute("courseSessionDetail", courseSessionDetail);
        return "coursesessiondetails/addEditCourseSessionDetail";
    }

    @GetMapping("/edit")
    public String showEditForm(@RequestParam("courseSessionDetailId") int courseSessionDetailId, Model model) {
        RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
        if (courseSessionDetail == null) {
            model.addAttribute("error", "Course session detail not found.");
            return "redirect:/sessiondetail/list";
        }

        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);
        model.addAttribute("courseSessionDetail", courseSessionDetail);
        return "coursesessiondetails/addEditCourseSessionDetail";
    }

    @PostMapping("/save")
    public String saveCourseSessionDetail(@ModelAttribute("courseSessionDetail") RDCourseSessionDetail courseSessionDetail,
                                          RedirectAttributes redirectAttributes) {
        try {
            // Set creation date if it’s a new session detail
            if (courseSessionDetail.getCourseSessionDetailId() == 0) {
                courseSessionDetail.setCreationDate(new Date());
            }

            // Save the course session detail
            courseSessionDetailService.saveRDCourseSessionDetail(courseSessionDetail);
            redirectAttributes.addFlashAttribute("message", "Course session detail saved successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error saving the course session detail.");
            return "redirect:/sessiondetail/list?courseId=" + courseSessionDetail.getCourse().getCourseId() +
                    "&courseSessionId=" + courseSessionDetail.getCourseSession().getCourseSessionId();
        }
        return "redirect:/sessiondetail/list?courseId=" + courseSessionDetail.getCourse().getCourseId() +
                "&courseSessionId=" + courseSessionDetail.getCourseSession().getCourseSessionId();
    }

	    @PostMapping("/uploadJson")
	    public String handleJsonUpload(@RequestParam("file") MultipartFile file,
	                                   @RequestParam("courseId") Integer courseId,
	                                   RedirectAttributes redirectAttributes) {
	        // Validate if the file is empty
	        if (file.isEmpty()) {
	            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
	            return "redirect:/sessiondetail/list?courseId=" + courseId;
	        }
	    	
	
	        try {
	            // Validate if courseId is present
	            if (courseId == null || courseId <= 0) {
	                redirectAttributes.addFlashAttribute("error", "Invalid course ID.");
	                return "redirect:/sessiondetail/list";
	            }
		    	
				/*
				 * // Save the file locally String fileName = file.getOriginalFilename(); String
				 * filePath = UPLOAD_DIR + fileName; File destinationFile = new File(filePath);
				 * file.transferTo(destinationFile);
				 */
	
	            // Parse the JSON file
	            List<CourseSessionDetailJson> sessionDetails = parseJsonForSessionDetails(file);
		    	
	            System.out.println(sessionDetails);
	            System.out.println("Course Id - " + courseId);
	            // Process each session detail using session_id to map to the correct course_session
	            for (CourseSessionDetailJson detail : sessionDetails) {
	            	System.out.println("Detail session id - " + detail.getSessionId());
	                RDCourseSession courseSession = courseSessionService.getCourseSessionBySessionIdAndCourseId(detail.getSessionId(), courseId.intValue());
	                System.out.println("course session session id = " + courseSession.getCourseSessionId());
	                // Process session details and assign the correct course_session_id from the retrieved courseSession
	                courseSessionDetailService.processSessionDetail(detail, courseSession.getCourseSessionId(),courseId);
	            }

	            redirectAttributes.addFlashAttribute("message", "JSON file uploaded and processed successfully.");
	        } catch (Exception e) {
	            e.printStackTrace();
	            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
	        }

	        // Redirect back to the listCourseSessionDetails page
	        return "redirect:/sessiondetail/list?courseId=" + courseId;
	    }
	
	

    public List<CourseSessionDetailJson> parseJsonForSessionDetails(MultipartFile file) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper(); // Jackson object mapper

        // Read the JSON file and map it to a list of CourseSessionDetailJson objects
        try (InputStream inputStream = file.getInputStream()) {
            return objectMapper.readValue(inputStream, new TypeReference<List<CourseSessionDetailJson>>() {});
        } catch (Exception e) {
            throw new Exception("Failed to parse JSON file: " + e.getMessage(), e);
        }
    }
 

    
    @GetMapping("/delete")
    public String deleteCourseSessionDetail(@RequestParam("courseSessionDetailId") int courseSessionDetailId,
                                            RedirectAttributes redirectAttributes) {
        try {
            RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
            if (courseSessionDetail != null) {
                courseSessionDetailService.deleteRDCourseSessionDetail(courseSessionDetailId);
                redirectAttributes.addFlashAttribute("message", "Course session detail deleted successfully.");
            } else {
                redirectAttributes.addFlashAttribute("error", "Course session detail not found.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting the course session detail.");
        }
        return "redirect:/sessiondetail/list";
    }
    

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
        System.out.println("checkSlidesOrAssignments...");
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
    	
        System.out.println("showSlide...");

        
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
