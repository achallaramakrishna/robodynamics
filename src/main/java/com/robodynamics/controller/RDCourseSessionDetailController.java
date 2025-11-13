package com.robodynamics.controller;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDSlide;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserPoints;
import com.robodynamics.service.Judge0Service;
import com.robodynamics.service.RDAssignmentService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDQuizQuestionService;
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



    @Autowired
    private Judge0Service judge0Service;

    @Autowired
    private RDSlideService slideService;

    @Autowired
    private RDQuizQuestionService quizQuestionService;

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
    
    @Value("${rd.session.materials.base:/opt/robodynamics/session_materials}")
    private String materialsBase;
   
   /** Filesystem folder: /opt/robodynamics/session_materials/{courseId}/ */
   private Path courseFolder(int courseId) {
       return Paths.get(materialsBase, String.valueOf(courseId));
   }

   /** Public URL: /session_materials/{courseId}/{filename}  (served via ResourceHandler) */
   private String publicUrl(int courseId, String filename) {
       return "/session_materials/" + courseId + "/" + filename;
   }
    
   @PostMapping("/uploadFile")
   public String uploadSessionDetailFile(@RequestParam("courseSessionDetailId") int detailId,
                                         @RequestParam("courseId") int courseId,
                                         @RequestParam("file") MultipartFile file,
                                         RedirectAttributes ra) {
       if (file == null || file.isEmpty()) {
           ra.addFlashAttribute("error", "Please choose a file to upload.");
           return "redirect:/sessiondetail/list?courseId=" + courseId;
       }

       RDCourseSessionDetail detail = courseSessionDetailService.getRDCourseSessionDetail(detailId);
       if (detail == null) {
           ra.addFlashAttribute("error", "Invalid session detail.");
           return "redirect:/sessiondetail/list?courseId=" + courseId;
       }

       try {
           // 1) ensure folder exists
           Path folder = courseFolder(courseId);
           Files.createDirectories(folder);

           // 2) sanitize name, prefix with detailId to reduce collisions
           String original = StringUtils.cleanPath(file.getOriginalFilename());
           if (original.isEmpty()) {
               ra.addFlashAttribute("error", "Invalid file name.");
               return "redirect:/sessiondetail/list?courseId=" + courseId;
           }

           String safeName = detailId + "_" + original;
           Path target = folder.resolve(safeName);

           // if exists, append timestamp
           if (Files.exists(target)) {
               String ext = "";
               int dot = safeName.lastIndexOf('.');
               if (dot >= 0) ext = safeName.substring(dot);
               String base = (dot >= 0) ? safeName.substring(0, dot) : safeName;
               safeName = base + "_" + System.currentTimeMillis() + ext;
               target = folder.resolve(safeName);
           }

           // 3) persist bytes
           file.transferTo(target.toFile());

           // 4) save public URL into DB so UI can link it
           detail.setFile(publicUrl(courseId, safeName));
           courseSessionDetailService.saveRDCourseSessionDetail(detail);

           ra.addFlashAttribute("message", "File uploaded successfully.");
       } catch (Exception e) {
           e.printStackTrace();
           ra.addFlashAttribute("error", "Upload failed: " + e.getMessage());
       }

       return "redirect:/sessiondetail/list?courseId=" + courseId;
   }
   
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
        List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseId(courseId);

        // Tiny DTO avoids Jackson recursion + keeps payload small
        record SessionLite(int sessionId, String sessionTitle) {}

        List<SessionLite> dto = sessions.stream()
            .map(s -> new SessionLite(
                // IMPORTANT: map your actual PK field here.
                // If your entity uses `getCourseSessionId()`, still send it as `sessionId` to match the JS.
                s.getCourseSessionId(),
                s.getSessionTitle()
            ))
            .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", dto);
        return response;
    }
    

    @GetMapping("/add")
    public String showAddForm(@RequestParam("courseId") int courseId,
            @RequestParam(value = "courseSessionId", required = false) Integer courseSessionId,
                              Model model) {
    	
    	 // populate course list for the dropdown
        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);
        
        RDCourseSessionDetail detail  = new RDCourseSessionDetail();
        // **critical**: ids used by JSP + JS
        model.addAttribute("selectedCourseId", courseId);
        model.addAttribute("selectedCourseSessionId", courseSessionId != null ? courseSessionId : 0);
        model.addAttribute("courseSessionDetail", detail);
        
     // (nice to have) also share the selected course for showing its name/banner
        try {
            RDCourse selectedCourse = courseService.getRDCourse(courseId); // add this in your service if not present
            model.addAttribute("selectedCourse", selectedCourse);
        } catch (Exception ignore) {}

        return "coursesessiondetails/addEditCourseSessionDetail";
    }

    @GetMapping("/edit")
    public String showEditForm(@RequestParam("courseSessionDetailId") int courseSessionDetailId,
                               Model model) {
        RDCourseSessionDetail detail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
        if (detail == null) {
            model.addAttribute("error", "Course session detail not found.");
            return "redirect:/sessiondetail/list";
        }

        model.addAttribute("courseSessionDetail", detail);
        model.addAttribute("courses", courseService.getRDCourses());

        // **critical**: derive preselected ids from the entity
        Integer selectedCourseId = (detail.getCourse() != null) ? detail.getCourse().getCourseId() : 0;
        Integer selectedCourseSessionId = (detail.getCourseSession() != null) ? detail.getCourseSession().getCourseSessionId() : 0;

        model.addAttribute("selectedCourseId", selectedCourseId);
        model.addAttribute("selectedCourseSessionId", selectedCourseSessionId);

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
	        ObjectMapper objectMapper = new ObjectMapper();
	        objectMapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

	        try (InputStream in = file.getInputStream()) {
	            return objectMapper.readValue(in, new com.fasterxml.jackson.core.type.TypeReference<List<CourseSessionDetailJson>>() {});
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
                redirectAttributes.addFlashAttribute("successMessage", "Course session detail deleted successfully.");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Course session detail not found.");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error deleting the course session detail.");
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
        System.out.println("Slide id - " + slide.getSlideId());
        // Fetch "fill-in-the-blank" questions by slide ID
        List<RDQuizQuestion> fillInBlankQuestions = quizQuestionService.getQuestionsBySlideId(slide.getSlideId(), "fill_in_the_blank");
        System.out.println("Fill in blank Questions - " + fillInBlankQuestions);
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

    private String cleanAnswer(String answer) {
        if (answer == null) {
            return "";  // Handle null cases gracefully
        }

        // Split the answer by any combination of commas and spaces using regex, then trim and filter
        List<String> cleanedParts = Arrays.stream(answer.split("[,\\s]+"))  // Split by commas or spaces (one or more)
                                          .map(String::trim)  // Trim each part of the answer
                                          .filter(part -> !part.isEmpty())  // Remove empty parts
                                          .collect(Collectors.toList());
        
        // Sort the cleaned parts to handle unordered answers (e.g., "3 45" vs "45,3")
        Collections.sort(cleanedParts);
        
        // Join the sorted values back into a single string
        return String.join(",", cleanedParts);
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
        List<RDQuizQuestion> fillInBlankQuestions = quizQuestionService.getQuestionsBySlideId(slideId, "fill_in_the_blank");
        Map<Integer, Boolean> correctness = new HashMap<>();
        Map<Integer, String> submittedAnswers = new HashMap<>();
        int totalPoints = 0; // Total points earned
        int possiblePoints = 0; // Maximum points for the slide

		boolean allCorrect = true;  // Variable to track if all answers are correct
        
        // Loop through questions to check correctness and calculate points
        for (RDQuizQuestion question : fillInBlankQuestions) {
            String submittedAnswer = allParams.get("answers[" + question.getQuestionId() + "]");
            submittedAnswers.put(question.getQuestionId(), submittedAnswer);
            
            // Clean up both the correct answer and the submitted answer
            String cleanedCorrectAnswer = cleanAnswer(question.getCorrectAnswer());
            String cleanedSubmittedAnswer = cleanAnswer(submittedAnswer);
            
            // Compare the cleaned answers
            boolean isCorrect = cleanedCorrectAnswer.equalsIgnoreCase(cleanedSubmittedAnswer);
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
    private int calculatePoints(List<RDQuizQuestion> fillInBlankQuestions) {
        int totalPoints = 0;
        for (RDQuizQuestion question : fillInBlankQuestions) {
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
