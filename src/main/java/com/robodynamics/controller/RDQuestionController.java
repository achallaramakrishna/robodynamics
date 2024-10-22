	package com.robodynamics.controller;
	
	import com.fasterxml.jackson.core.type.TypeReference;
	import com.fasterxml.jackson.databind.ObjectMapper;
	import com.robodynamics.model.RDCourse;
	import com.robodynamics.model.RDCourseSession;
	import com.robodynamics.model.RDCourseSessionDetail;
	import com.robodynamics.model.RDQuestion;
	import com.robodynamics.model.RDQuizOption;
	import com.robodynamics.model.RDSlide;
	import com.robodynamics.service.RDCourseService;
	import com.robodynamics.service.RDCourseSessionDetailService;
	import com.robodynamics.service.RDCourseSessionService;
	import com.robodynamics.service.RDQuestionService;
	import com.robodynamics.service.RDSlideService;
	
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.stereotype.Controller;
	import org.springframework.ui.Model;
	import org.springframework.web.bind.annotation.*;
	import org.springframework.web.multipart.MultipartFile;
	import org.springframework.web.servlet.mvc.support.RedirectAttributes;
	
	import java.util.ArrayList;
	import java.util.Collections;
	import java.util.HashMap;
	import java.util.List;
	import java.util.Map;
	import java.util.stream.Collectors;
	
	@Controller
	@RequestMapping("/questions")
	public class RDQuestionController {
	
	    @Autowired
	    private RDQuestionService questionService;
	    
		@Autowired
		private RDCourseService courseService;
		
	    @Autowired
	    private RDSlideService slideService;
	
	    @Autowired
	    private RDCourseSessionService courseSessionService;
	
	    @Autowired
	    private RDCourseSessionDetailService courseSessionDetailService;
	
	    @GetMapping("/question")
	    @ResponseBody
	    public RDQuestion getQuestion() {
	        return questionService.getRandomQuestion();
	    }
	    
	    @PostMapping("/verify-answer")
	    @ResponseBody
	    public Map<String, Object> verifyAnswer(@RequestBody Map<String, String> payload) {
	        String questionId = payload.get("questionId");
	        String userAnswer = payload.get("userAnswer");
	        
	        System.out.println("Question id - " + questionId + "\t" + userAnswer);
	        
	        RDQuestion question = questionService.findById(Integer.parseInt(questionId));
	     //   RDQuestion question = questionDAO.findById(Long.parseLong(questionId));
	        Map<String, Object> response = new HashMap<>();
	        
	        if (question.getCorrectAnswer().equalsIgnoreCase(userAnswer.trim())) {
	            response.put("result", "Correct");
	        } else {
	            response.put("result", "Incorrect");
	            response.put("correctAnswer", question.getCorrectAnswer());
	        }

	        return response;
	    }
	    
	    @GetMapping("/getCourseSessions")
	    @ResponseBody
	    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
	    	
	    	System.out.println("inside course sessions.. get method");
	        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
	        
	        Map<String, Object> response = new HashMap<>();
	        response.put("courseSessions", courseSessions);
	        return response;
	    }
	
	    @GetMapping("/getCourseSessionDetails")
	    @ResponseBody
	    public Map<String, Object> getCourseSessionDetails(@RequestParam("sessionId") int sessionId) {
	        List<RDCourseSessionDetail> sessionDetails = courseSessionDetailService.findSessionDetailsBySessionId(sessionId);
	        Map<String, Object> response = new HashMap<>();
	        response.put("sessionDetails", sessionDetails);
	        return response;
	    }
	
	    @GetMapping("/getSlidesBySessionDetail")
	    @ResponseBody
	    public Map<String, Object> getSlidesBySessionDetail(@RequestParam("sessionDetailId") int sessionDetailId) {
	        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);
	        Map<String, Object> response = new HashMap<>();
	        response.put("slides", slides);
	        return response;
	    }
	
	
	    @GetMapping("/list")
	    public String listQuestions(@RequestParam(required = false) Integer courseSessionDetailId, Model model) {
	        List<RDQuestion> questions = new ArrayList<>();
	        
	        List<RDCourse> courses = courseService.getRDCourses();
	        model.addAttribute("courses",courses);
	
	        // Fetch questions if a course session detail is selected
	        if (courseSessionDetailId != null && courseSessionDetailId > 0) {
	        	// Step 1: Fetch slides based on the course session detail
		        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(courseSessionDetailId);
	
		        if (slides == null || slides.isEmpty()) {
		        	 model.addAttribute("message", "No slides available for the selected course session detail.");
		        } else {
	     
			        for (RDSlide slide : slides) {
			            List<RDQuestion> slideQuestions = questionService.getQuestionsBySlideId(slide.getSlideId());
			            questions.addAll(slideQuestions); // Add all questions of the current slide to the list
			        }
		        }
	        }
	
	        if (questions == null || questions.isEmpty()) {
	            model.addAttribute("message", "No questions available for the selected course session detail.");
	        } else {
	            model.addAttribute("questions", questions);
	        }
	
	        return "questions/listQuestions";
	    }
	
	
		@GetMapping("/getQuestionsBySessionDetail")
		@ResponseBody
		public ResponseEntity<?> getQuestionsBySessionDetail(@RequestParam("sessionDetailId")  Integer courseSessionDetailId,
				Model model) {
	
			// Step 2: For each slide, fetch the associated questions
	        List<RDQuestion> questions = new ArrayList<>();
			try {
	
				List<RDCourse> courses = courseService.getRDCourses();
				model.addAttribute("courses", courses);
	
				// Step 1: Fetch slides based on the course session detail
		        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(courseSessionDetailId);
	
		        if (slides == null || slides.isEmpty()) {
		            return ResponseEntity.ok().body(Collections.singletonMap("message", "No slides available for the selected course session detail."));
		        }
	
		     
		        for (RDSlide slide : slides) {
		            List<RDQuestion> slideQuestions = questionService.getQuestionsBySlideId(slide.getSlideId());
		            questions.addAll(slideQuestions); // Add all questions of the current slide to the list
		        }
	
		        // Step 3: If no questions are found, return a message
		        if (questions.isEmpty()) {
		            return ResponseEntity.ok().body(Collections.singletonMap("message", "No questions available for the selected slides."));
		        }
	
		        // Step 4: Return the questions as a JSON response
		        return ResponseEntity.ok().body(Collections.singletonMap("questions", questions));
	
		    } catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                .body(Collections.singletonMap("error", "Failed to fetch questions. Error: " + e.getMessage()));
		    }
		}
	    
	    @GetMapping("/add")
	    public String showAddForm(@RequestParam("slideId") int slideId, Model model) {
	        RDQuestion question = new RDQuestion();
	        model.addAttribute("slideId", slideId);
	        model.addAttribute("question", question);
	        return "questions/addEditQuestion";
	    }

	    @GetMapping("/edit")
	    public String showEditForm(@RequestParam("questionId") int questionId, Model model) {
	        RDQuestion question = questionService.findById(questionId);
	        int slideId = question.getSlide().getSlideId();
	        model.addAttribute("slideId", slideId);
	        model.addAttribute("question", question);
	        return "questions/addEditQuestion";
	    }

	    @PostMapping("/save")
	    public String saveQuestion(@ModelAttribute("question") RDQuestion question, 
	                               @RequestParam("slideId") int slideId, 
	                               RedirectAttributes redirectAttributes) {
	        try {
	            RDSlide slide = slideService.getSlideById(slideId);
	            question.setSlide(slide);
	            questionService.saveOrUpdate(question);
	            redirectAttributes.addFlashAttribute("message", "Question saved successfully.");
	        } catch (Exception e) {
	            redirectAttributes.addFlashAttribute("error", "Error saving the question.");
	        }
	        return "redirect:/questions/list?slideId=" + slideId;
	    }
	
	    @GetMapping("/delete")
	    public String deleteQuestion(@RequestParam("questionId") int questionId, RedirectAttributes redirectAttributes) {
	        try {
	        	RDQuestion question = questionService.findById(questionId);
	            questionService.delete(question);
	            redirectAttributes.addFlashAttribute("message", "Question deleted successfully.");
	        } catch (Exception e) {
	            redirectAttributes.addFlashAttribute("error", "Error deleting the question.");
	        }
	        return "redirect:/questions/list";
	    }
	
	    // Method for processing uploaded JSON file for questions
	    @PostMapping("/uploadJson")
	    public String handleJsonUpload(@RequestParam("file") MultipartFile file,
	                                      @RequestParam("courseSessionDetailId") Integer courseSessionDetailId,
	                                      RedirectAttributes redirectAttributes) {
	        try {
	        	
	        	System.out.println("Questions - uploadJson 1...");
	            if (file.isEmpty()) {
	                redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
	                return "redirect:/questions/list";  // Redirect to the appropriate page
	            }
	        	System.out.println("Questions - uploadJson 2...");
	
	            // Process the JSON file with questions
	            questionService.processJson(file, courseSessionDetailId);
	
	            redirectAttributes.addFlashAttribute("message", "Questions uploaded and processed successfully.");
	        } catch (Exception e) {
	        	e.printStackTrace();
	            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
	        }
	
	        // Redirect to the questions list page after processing
	        return "redirect:/questions/list?sessionDetailId=" + courseSessionDetailId;
	    }
	}