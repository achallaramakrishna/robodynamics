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

    @GetMapping("/edit")
	public String showEditQuizForm(@RequestParam("quizId") Integer quizId, Model model) {
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

	
	
	@GetMapping("/delete")
	public String deleteQuiz(@RequestParam("quizId") Integer quizId, Model model) {
	    // Fetch the quiz to ensure it exists
	    RDQuiz quiz = quizService.findById(quizId);
	    
	    if (quiz == null) {
	        // If no quiz is found, you can add an error message to the model
	        model.addAttribute("message", "Quiz not found.");
	        return "redirect:/quizzes/dashboard";
	    }

	    // Perform the delete operation
	    quizService.delete(quiz);

	    // Redirect back to the quiz dashboard after deletion
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

    
    

 // Start a quiz and navigate through questions
    @GetMapping("/start/{quizId}")
    public String startQuiz(@PathVariable int quizId, 
                            HttpSession session, HttpServletRequest request, 
                            Model model, @RequestParam(value = "currentQuestionIndex", defaultValue = "0") int currentQuestionIndex,
                            @RequestParam(value = "mode", defaultValue = "practice") String mode,
                            @RequestParam(value = "showHeaderFooter", required = false, defaultValue = "false") boolean showHeaderFooter) {
        RDUser rdUser = null;

        if (session.getAttribute("rdUser") != null) {
            rdUser = (RDUser) session.getAttribute("rdUser");
        }

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
        
        System.out.println("questionIds - " + questionIds);
        if (questionIds.isEmpty()) {
            model.addAttribute("message", "No questions available for this quiz.");
            return "quizzes/error";
        }

        // Fetch the questions based on the IDs from the mapping
        List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);

        // Ensure valid question index
        if (currentQuestionIndex < 0) currentQuestionIndex = 0;
        if (currentQuestionIndex >= quizQuestions.size()) currentQuestionIndex = quizQuestions.size() - 1;

        RDQuizQuestion currentQuestion = quizQuestions.get(currentQuestionIndex);

        model.addAttribute("quiz", quiz);
        model.addAttribute("currentQuestion", currentQuestion);
        model.addAttribute("currentQuestionIndex", currentQuestionIndex);
        model.addAttribute("totalQuestions", quizQuestions.size());
        model.addAttribute("mode", mode);
        // Add the showHeaderFooter flag to the model
        model.addAttribute("showHeaderFooter", showHeaderFooter);
        
        if ("practice".equals(mode)) {
            model.addAttribute("correctAnswer", currentQuestion.getCorrectAnswer());
        }

        return "quizzes/take";  // Display a single question at a time
    }
    
    @PostMapping("/navigate")
    public String navigateQuiz(@RequestParam("quizId") int quizId,
                               @RequestParam("currentQuestionIndex") int currentQuestionIndex,
                               @RequestParam("action") String action,
                               @RequestParam Map<String, String> answers, 
                               @RequestParam(value = "mode", defaultValue = "practice") String mode,
                               @RequestParam(value = "showHeaderFooter", required = false, defaultValue = "false") boolean showHeaderFooter,
                               HttpSession session, Model model) {
        // Fetch the user from the session
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            // Handle case where the user is not logged in
            return "redirect:/login";
        }
        
        
        // Fetch the quiz and questions
        RDQuiz quiz = quizService.findById(quizId);
        List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);
        if (questionIds.isEmpty()) {
            model.addAttribute("message", "No questions available for this quiz.");
            return "quizzes/error";
        }

        List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);
        RDQuizQuestion currentQuestion = quizQuestions.get(currentQuestionIndex);

        // Initialize or fetch selectedAnswers from the session
        Map<Integer, String> selectedAnswers = (Map<Integer, String>) session.getAttribute("selectedAnswers");
        if (selectedAnswers == null) {
            selectedAnswers = new HashMap<>();
            session.setAttribute("selectedAnswers", selectedAnswers);
        }

        String questionKey = "question_" + currentQuestion.getQuestionId() + "_answer";
        System.out.println("Question key " + questionKey);
        System.out.println("currentQuestion.getQuestionType()" + currentQuestion.getQuestionType());
        // Determine if the current question is multiple-choice or fill-in-the-blank
        if ("multiple_choice".equals(currentQuestion.getQuestionType()) && answers.containsKey(questionKey)) {
            selectedAnswers.put(currentQuestion.getQuestionId(), answers.get(questionKey));
            System.out.println("multiple_choice");
        } else if ("true_false".equals(currentQuestion.getQuestionType()) && answers.containsKey(questionKey)) {
        	System.out.println("true_false");
        	selectedAnswers.put(currentQuestion.getQuestionId(), answers.get(questionKey));
            System.out.println("Selected answers - " + selectedAnswers);

        } else if ("fill_in_the_blank".equals(currentQuestion.getQuestionType()) && answers.containsKey(questionKey)) {
        	System.out.println("fill_in_the_blank");
        	selectedAnswers.put(currentQuestion.getQuestionId(), answers.get(questionKey));
        } else if ("short_answer".equals(currentQuestion.getQuestionType()) && answers.containsKey(questionKey)) {
        	System.out.println("short_answer");
        	selectedAnswers.put(currentQuestion.getQuestionId(), answers.get(questionKey));
        } else if ("long_answer".equals(currentQuestion.getQuestionType()) && answers.containsKey(questionKey)) {
        	System.out.println("long_answer");
        	selectedAnswers.put(currentQuestion.getQuestionId(), answers.get(questionKey));
        } else if ("coding".equals(currentQuestion.getQuestionType()) && answers.containsKey(questionKey)) {
        	System.out.println("coding");
        	selectedAnswers.put(currentQuestion.getQuestionId(), answers.get(questionKey));
        }
        System.out.println("Selected answers - " + selectedAnswers);
        session.setAttribute("selectedAnswers", selectedAnswers);
        System.out.println("Selected Answers - " + selectedAnswers);


      
        // Handle navigation action (Next/Previous/Submit)
        if ("next".equals(action)) {
            currentQuestionIndex++;
        } else if ("previous".equals(action)) {
            currentQuestionIndex--;
        } else if ("submit".equals(action)) {
            return submitQuiz(answers, model, session);
        }

        // Ensure valid question index bounds
        if (currentQuestionIndex < 0) currentQuestionIndex = 0;
        if (currentQuestionIndex >= quizQuestions.size()) currentQuestionIndex = quizQuestions.size() - 1;

        // Set current question and pass it to the view
        currentQuestion = quizQuestions.get(currentQuestionIndex);
        model.addAttribute("quiz", quiz);
        model.addAttribute("currentQuestion", currentQuestion);
        model.addAttribute("currentQuestionIndex", currentQuestionIndex);
        model.addAttribute("totalQuestions", quizQuestions.size());
        model.addAttribute("selectedAnswers", selectedAnswers);
        model.addAttribute("showHeaderFooter", showHeaderFooter); // Pass this parameter forward

        
        model.addAttribute("mode", mode);

        if ("practice".equals(mode)) {
            model.addAttribute("correctAnswer", currentQuestion.getCorrectAnswer());
        }

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

