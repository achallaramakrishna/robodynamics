package com.robodynamics.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.form.RDQuizDashboardForm;  // Import in your controller
import com.robodynamics.form.RDQuizForm;
import com.robodynamics.model.*;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;
import com.robodynamics.service.*;

@Controller
@RequestMapping("/quizzes")
public class RDQuizController {
	
	@Autowired
    private Judge0Service judge0Service;

    @Autowired
    private RDQuizQuestionMapService quizQuestionMapService;
	
	@Autowired
    private RDCourseService courseService;
	
	@Autowired
    private RDCourseSessionService courseSessionService;
	
	@Autowired
    private RDCourseSessionDetailService courseSessionDetailService;
    
	@Autowired
    private RDQuizService quizService;
    
    @Autowired
    private RDUserService userService;
    
    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @Autowired
    private RDUserQuizResultService quizResultService;

    @Autowired
    private RDUserPointsService userPointsService;

    @Autowired
    private RDUserQuestService userQuestService;

    @Autowired
    private RDQuestService questService;
    
    @Autowired
    private RDUserQuizAnswerService userQuizAnswerService; // Inject the RDUserQuizAnswerService

    
    
    
 // Endpoint to get sessions by course ID
    // Endpoint to get session details by session ID
    @GetMapping("/getSessionByCourse")
    @ResponseBody
     public List<RDCourseSession> getSessionsByCourse(@RequestParam Integer courseId) {
    	System.out.println("Course ID : " + courseId);
    	
    	
        return courseSessionService.getCourseSessionsByCourseId(courseId);  // Fetch sessions by course ID
    }

    // Endpoint to get session details by session ID
    @GetMapping("/getSessionDetailsBySession")
    @ResponseBody
    public List<RDCourseSessionDetail> getSessionDetailsBySession(@RequestParam Integer	 sessionId) {
        return courseSessionDetailService.findSessionDetailsBySessionId(sessionId);  // Fetch session details by session ID
    }

 // Show the form to create a quiz
    @GetMapping("/create")
    public String showCreateQuizForm(Model model) {
        // Create an empty quiz object for binding
    	List<RDCourse> courses = courseService.getRDCourses();
    	model.addAttribute("courses",courses);
        RDQuiz quiz = new RDQuiz();
        model.addAttribute("quiz", quiz);
        return "quizzes/quizForm";  // Use combined form JSP
    }


    @PostMapping("/saveQuiz")
    public String saveQuiz(@ModelAttribute("quiz") RDQuiz quiz, 
                           @RequestParam("courseId") Integer courseId,
                           @RequestParam("courseSessionId") Integer courseSessionId,
                           @RequestParam("courseSessionDetailId") Integer courseSessionDetailId,
                           Model model, HttpSession session) {
        // Retrieve the current user
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");

        if (currentUser == null) {
            model.addAttribute("error", "You must be logged in to create a quiz.");
            return "redirect:/login";
        }

        try {
            // Fetch the related entities based on selected IDs
            RDCourse course = courseService.getRDCourse(courseId);
            RDCourseSession courseSession = courseSessionService.getCourseSession(courseSessionId);
            RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);

            // Set the associations in the quiz entity
            quiz.setCourse(course);
            quiz.setCourseSession(courseSession);
            quiz.setCourseSessionDetail(courseSessionDetail);

            // Set creator and timestamps
            quiz.setCreatedByUser(currentUser);
           
            // Save the quiz
            quizService.saveOrUpdate(quiz);

            // Add success message
            model.addAttribute("message", "Quiz created successfully!");
        } catch (Exception e) {
            model.addAttribute("error", "Error while saving quiz: " + e.getMessage());
            return "quizzes/quizForm"; // Redirect back to the form on error
        }

        return "redirect:/quizzes/dashboard"; // Redirect to dashboard
    }

    @GetMapping("/edit/{quizId}")
	public String showEditQuizForm(@PathVariable("quizId") Integer quizId, Model model) {
	    // Fetch the quiz by ID
	    RDQuiz quiz = quizService.findById(quizId);
	    
	    // Check if the quiz exists
	    if (quiz == null) {
	        // If the quiz does not exist, redirect to an error page or show a message
	        return "redirect:/quizzes/dashboard";
	    }

	    // Add the quiz object to the model to pre-populate the form
	    model.addAttribute("quiz", quiz);
	    
	    // Return the quiz form view (ensure the path to your JSP is correct)
	    return "quizzes/quizForm";
	}

	@PostMapping("/update")
	public String updateQuiz(@ModelAttribute("quiz") RDQuiz quiz, Model model) {
	    // Update the quiz using the service layer
	    quizService.saveOrUpdate(quiz);

	    // Add a success message for feedback
	    model.addAttribute("message", "Quiz updated successfully!");

	    return "redirect:/quizzes/dashboard";  // Redirect back to the quiz dashboard
	}
	
	@GetMapping("/getQuestionOptions")
	@ResponseBody
	public Map<String, Object> getQuestionOptions(@RequestParam Integer questionId) {
	    // Fetch the question from the service
	    RDQuizQuestion question = quizQuestionService.findById(questionId);
	    
	    // Prepare the response
	    Map<String, Object> response = new HashMap<>();
	    if (question != null && question.getOptions() != null) {
	        List<Map<String, Object>> options = new ArrayList<>();
	        for (RDQuizOption option : question.getOptions()) {
	            Map<String, Object> optionData = new HashMap<>();
	            optionData.put("optionId", option.getOptionId());
	            optionData.put("optionText", option.getOptionText());
	            options.add(optionData);
	        }
	        response.put("options", options);
	    }
	    return response;
	}

	
	
	@GetMapping("/delete/{quizId}")
	public String deleteQuiz(@PathVariable("quizId") Integer quizId, Model model, HttpSession session) {
	    // Fetch the quiz to ensure it exists
	try {
		RDQuiz quiz = quizService.findById(quizId);
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
   
	    if (quiz == null) {
	        // If no quiz is found, you can add an error message to the model
	        model.addAttribute("message", "Quiz not found.");
	        return "redirect:/quizzes/dashboard";
	    }

        // Perform the delete operation
        quizService.delete(quiz);

        model.addAttribute("message", "Quiz deleted successfully.");
    } catch (Exception e) {
        // Check if the exception is related to foreign key constraints
        String errorMessage = "Unable to delete quiz. It is associated with existing user quiz results.";
        model.addAttribute("error", errorMessage);
        
        
        return "redirect:/quizzes/dashboard";
    }

    return "redirect:/quizzes/dashboard";
	}

    
	@GetMapping("/dashboard")
	public String showQuizDashboard(@RequestParam(value = "page", defaultValue = "0") int page,
	                                @RequestParam(value = "size", defaultValue = "10") int size,
	                                Model model) {
		
		List<RDCourse> courses = courseService.getRDCourses();
    	model.addAttribute("courses",courses);
    	
	    List<RDQuiz> quizzes = quizService.getPaginatedQuizzes(page, size);
	    long totalQuizzes = quizService.getTotalQuizzesCount();

	    int totalPages = (int) Math.ceil((double) totalQuizzes / size);

	    model.addAttribute("quizzes", quizzes);
	    model.addAttribute("currentPage", page);
	    model.addAttribute("totalPages", totalPages);
	    model.addAttribute("size", size);

	    return "quizzes/quizDashboard";
	}

    
    

	@GetMapping("/start/{quizId}")
	public String startQuiz(@PathVariable int quizId, 
	                        HttpSession session, HttpServletRequest request, 
	                        Model model, 
	                        @RequestParam(value = "currentPage", defaultValue = "0") int currentPage,
	                        @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
	                        @RequestParam(value = "mode", defaultValue = "practice") String mode,
	                        @RequestParam(value = "showHeaderFooter", required = false, defaultValue = "false") boolean showHeaderFooter) {
	    RDUser rdUser = (RDUser) session.getAttribute("rdUser");

	    if (rdUser == null) {
	        // Save intended URL for redirect after login
	        String redirectUrl = request.getRequestURI().substring(request.getContextPath().length());
	        session.setAttribute("redirectUrl", redirectUrl);

	        // Redirect to login page
	        return "redirect:/login";
	    }

	    RDQuiz quiz = quizService.findById(quizId);

	    // Fetch question IDs from the RDQuizQuestionMap
	    List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);
	    if (questionIds.isEmpty()) {
	        model.addAttribute("message", "No questions available for this quiz.");
	        return "quizzes/error";
	    }

	    // Fetch the questions based on the IDs from the mapping
	    List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);

	    // Pagination logic
	    int totalQuestions = quizQuestions.size();
	    int totalPages = (int) Math.ceil((double) totalQuestions / pageSize);
	    int startIndex = currentPage * pageSize;
	    int endIndex = Math.min(startIndex + pageSize, totalQuestions);

	    List<RDQuizQuestion> questionsToShow = quizQuestions.subList(startIndex, endIndex);

		/*
		 * // Initialize the timer for the first time Integer remainingTime = (Integer)
		 * session.getAttribute("remainingTime"); if (remainingTime == null) {
		 * remainingTime = 10 * 60; // 10 minutes in seconds
		 * session.setAttribute("remainingTime", remainingTime); }
		 */
	    model.addAttribute("quiz", quiz);
	    model.addAttribute("questions", questionsToShow); // Pass the current set of questions
	    model.addAttribute("currentPage", currentPage);
	    model.addAttribute("totalPages", totalPages);
	    model.addAttribute("pageSize", pageSize);
	    model.addAttribute("mode", mode);
	    model.addAttribute("showHeaderFooter", showHeaderFooter);
	 //   model.addAttribute("remainingTime", remainingTime); // Pass timer value to JSP


	    return "quizzes/take"; // Update the JSP to handle multiple questions
	}
  
	@PostMapping("/navigate")
	public String navigateQuiz(@RequestParam("quizId") int quizId,
	                           @RequestParam("currentPage") int currentPage,
	                           @RequestParam(value = "pageSize", defaultValue = "10") int pageSize, // Default to 10
	                           @RequestParam("action") String action,
	                           @RequestParam Map<String, String> answers, 
	                           @RequestParam(value = "mode", defaultValue = "practice") String mode,
	                 //          @RequestParam("remainingTime") int remainingTime, // Capture remaining time
	                           @RequestParam(value = "showHeaderFooter", defaultValue = "false") boolean showHeaderFooter,
	                           HttpSession session, Model model) {
		
		System.out.println("Page Size: " + pageSize);

	    // Fetch the user from the session
	    RDUser rdUser = (RDUser) session.getAttribute("rdUser");
	    if (rdUser == null) {
	        return "redirect:/login";
	    }

	    // Fetch the quiz and its questions
	    RDQuiz quiz = quizService.findById(quizId);
	    List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);
	    List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);

	    // Handle navigation action (Next/Previous)
	    if ("next".equals(action)) {
	        currentPage++;
	    } else if ("previous".equals(action)) {
	        currentPage--;
	    } else if ("submit".equals(action)) {
	        return submitQuiz(answers, model, session);
	    }

	    // Pagination logic
	    int totalQuestions = quizQuestions.size();
	    int totalPages = (int) Math.ceil((double) totalQuestions / pageSize);
	    int startIndex = currentPage * pageSize;
	    int endIndex = Math.min(startIndex + pageSize, totalQuestions);

	    // Ensure valid page bounds
	    if (currentPage < 0) currentPage = 0;
	    if (currentPage >= totalPages) currentPage = totalPages - 1;

	    List<RDQuizQuestion> questionsToShow = quizQuestions.subList(startIndex, endIndex);

	    // Save selected answers for the current page
	    Map<Integer, String> selectedAnswers = (Map<Integer, String>) session.getAttribute("selectedAnswers");
	    if (selectedAnswers == null) {
	        selectedAnswers = new HashMap<>();
	    }

	    for (int questionId : questionIds) {
	        String questionKey = "question_" + questionId + "_answer";
	        if (answers.containsKey(questionKey)) {
	            selectedAnswers.put(questionId, answers.get(questionKey));
	        }
	    }
	    session.setAttribute("selectedAnswers", selectedAnswers);

	    // Add attributes to the model
	    model.addAttribute("quiz", quiz);
	    model.addAttribute("questions", questionsToShow);
	    model.addAttribute("currentPage", currentPage);
	    model.addAttribute("totalPages", totalPages);
	    model.addAttribute("pageSize", pageSize);
	    model.addAttribute("mode", mode);
	    model.addAttribute("showHeaderFooter", showHeaderFooter);
	    model.addAttribute("selectedAnswers", selectedAnswers);
	//    model.addAttribute("remainingTime", remainingTime); // Pass timer data back


	    return "quizzes/take";
	}


    @PostMapping("/submit")
    public String submitQuiz(@RequestParam Map<String, String> answers, 
                             Model model, HttpSession session) {

        // Get the current user from the session
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");

        // Retrieve quiz ID from the form data
        int quizId = Integer.parseInt(answers.get("quizId"));

        // Fetch the quiz
        RDQuiz quiz = quizService.findById(quizId);

        // Get question IDs mapped to this quiz
        List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);
        List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);

        // Retrieve the user's selected answers from the session
        Map<Integer, String> selectedAnswers = (Map<Integer, String>) session.getAttribute("selectedAnswers");

        System.out.println(selectedAnswers);

        // Evaluate the quiz and store answers
        int correctAnswersCount = 0;
        int pointsEarned = 0;
        int pointsPerCorrectAnswer = 10;  // Example: 10 points per correct answer

     // Create a list to store details for analysis
        List<Map<String, Object>> questionAnalysis = new ArrayList<>();
        		
        for (RDQuizQuestion question : quizQuestions) {
            int questionId = question.getQuestionId();
            String selectedOptionStr = selectedAnswers.get(questionId);

            // Check if selected answer exists
            if (selectedOptionStr != null) {
                boolean isCorrect = false;

                // Determine question type and evaluate the answer
                try {
                    switch (question.getQuestionType()) {
                        case "multiple_choice":
                            int selectedOptionId = Integer.parseInt(selectedOptionStr);
                            isCorrect = question.getCorrectOption().getOptionId() == selectedOptionId;
                            break;

                        case "fill_in_the_blank":
                            String cleanedCorrectAnswer = cleanAnswer(question.getCorrectAnswer());
                            String cleanedSubmittedAnswer = cleanAnswer(selectedOptionStr);
                            isCorrect = cleanedCorrectAnswer.equalsIgnoreCase(cleanedSubmittedAnswer);
                            break;

                        case "true_false":
                            isCorrect = selectedOptionStr.trim().equalsIgnoreCase(question.getCorrectAnswer().trim());
                            break;

                        case "short_answer":
                            cleanedCorrectAnswer = cleanAnswer(question.getCorrectAnswer());
                            cleanedSubmittedAnswer = cleanAnswer(selectedOptionStr);
                            isCorrect = cleanedCorrectAnswer.equalsIgnoreCase(cleanedSubmittedAnswer);
                            break;
                        case "long_answer":
                            // For long answer questions, you can introduce more complex validation later, 
                            // such as keyword matching, length validation, or human evaluation
                            // Here, we assume that all long answers are correct for simplicity
                            isCorrect = true;
                            break;
                        case "coding":
                        	// Implement logic to execute or compare coding answers
                            isCorrect = evaluateCodingAnswer(selectedOptionStr, question.getCorrectAnswer());
                            break;
          

                        default:
                            System.err.println("Unknown question type: " + question.getQuestionType());
                            break;
                    }
                    
                    // Add question details to the analysis list
                    Map<String, Object> analysisEntry = new HashMap<>();
                    analysisEntry.put("question", question.getQuestionText());
                    analysisEntry.put("selectedAnswer", selectedOptionStr);
                    analysisEntry.put("correctAnswer", question.getCorrectAnswer());
                    analysisEntry.put("isCorrect", isCorrect);
                    
                 // Include options for multiple-choice questions
                    if ("multiple_choice".equals(question.getQuestionType())) {
                        List<Map<String, Object>> options = new ArrayList<>();

                        for (RDQuizOption option : question.getOptions()) {
                            Map<String, Object> optionData = new HashMap<>();
                            optionData.put("optionId", option.getOptionId());
                            optionData.put("optionText", option.getOptionText());
                            options.add(optionData);
                        }

                        analysisEntry.put("options", options);
                    }

                    questionAnalysis.add(analysisEntry);

                   

                    
                    // Log details about question processing
                    System.out.println("Processing question ID: " + questionId + " | Type: " + question.getQuestionType() + 
                                       " | Answer: " + selectedOptionStr + " | Is Correct: " + isCorrect);

                    // Store the user's answer in the database
                    RDUserQuizAnswer userQuizAnswer = new RDUserQuizAnswer();
                    userQuizAnswer.setQuizId(quizId);
                    userQuizAnswer.setUserId(currentUser.getUserID());
                    userQuizAnswer.setQuestionId(questionId);
                    userQuizAnswer.setUserAnswer(selectedOptionStr);
                    userQuizAnswer.setCorrect(isCorrect);
                    userQuizAnswer.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                    userQuizAnswerService.saveOrUpdate(userQuizAnswer);

                    
                    // Update score if the answer is correct
                    if (isCorrect) {
                        correctAnswersCount++;
                        pointsEarned += pointsPerCorrectAnswer;
                    }
                } catch (NumberFormatException e) {
                    // Handle the case where parsing fails
                    System.err.println("Error parsing selected option for question ID: " + questionId + " - " + e.getMessage());
                }
            } else {
                System.out.println("No answer provided for question ID: " + questionId);
            }
        }


        // Determine if the user passed (70% correct answers threshold)
        boolean passed = (double) correctAnswersCount / quizQuestions.size() >= 0.7;


        // Save the quiz result
        RDUserQuizResults quizResult = new RDUserQuizResults();
        quizResult.setUser(currentUser);
        quizResult.setQuiz(quiz);
        quizResult.setScore(correctAnswersCount);
        quizResult.setPassed(passed);
        quizResult.setPointsEarned(pointsEarned);
        quizResult.setStartTime(Timestamp.valueOf(LocalDateTime.now()));  // Set start time, replace with actual
        quizResult.setEndTime(Timestamp.valueOf(LocalDateTime.now()));    // Set end time, replace with actual
        quizResult.setCompletionTime((int) ((quizResult.getEndTime().getTime() - quizResult.getStartTime().getTime()) / 1000));  // Completion time in seconds

        quizResultService.saveOrUpdate(quizResult);

        // Reward points to the user
        userPointsService.addPoints(currentUser, pointsEarned);

        // Update the session with the latest user data
        currentUser = userService.getRDUser(currentUser.getUserID());
        session.setAttribute("rdUser", currentUser);

        // Pass the result to the view
        model.addAttribute("quizResult", quizResult);
        model.addAttribute("pointsEarned", pointsEarned);
        model.addAttribute("passed", passed);
        // Add the question analysis to the model
        model.addAttribute("questionAnalysis", questionAnalysis);
        System.out.println("hello submit... 10");

        // Clear the session attribute for selected answers after processing the quiz submission
        session.removeAttribute("selectedAnswers");
        return "quizzes/result";  // Return to quiz result page
    }

    private String cleanAnswer(String answer) {
        if (answer == null) {
            return "";  // Handle null cases gracefully
        }

        // Split the answer by spaces, trim each word, filter empty parts, and join them back with a single space
        return Arrays.stream(answer.split("\\s+"))
                     .map(String::trim)
                     .filter(part -> !part.isEmpty())
                     .collect(Collectors.joining(" "));
    }
    
    private boolean evaluateCodingAnswer(String userCode, String correctSolution) {
        // Implement your logic to check the correctness of the submitted code.
        // For example, you could compare userCode with correctSolution or run the code securely and check output.

        // Simple example: Check if the user's code contains the correct solution (basic validation)
        return userCode != null && userCode.trim().equalsIgnoreCase(correctSolution.trim());
    }
    
    @PostMapping("/executeCode")
    @ResponseBody
    public String executeCode(@RequestParam("code") String code, @RequestParam("languageId") String languageId) {
        // Call the Judge0 service to execute the code
    	System.out.println("Code received: " + code);
        System.out.println("Language ID: " + languageId);
        String output = judge0Service.executeCode(code, languageId);
        return output;  // Return the result back to the front-end
    }


}

