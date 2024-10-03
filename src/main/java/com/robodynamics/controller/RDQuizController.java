package com.robodynamics.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    	
    	// Initialize form object
        RDQuizForm quizForm = new RDQuizForm();
        // Add form object to model
        model.addAttribute("quizForm", quizForm);
        
        List<RDCourse> courses = courseService.getRDCourses();
        System.out.println(courses);
        
        // Add courses to the model
        model.addAttribute("courses", courses);
        
        model.addAttribute("difficultyLevels", DifficultyLevel.values());  // Fetch all difficulty levels
        return "quizzes/createQuiz";  // Corresponding view for quiz creation form
    }
    
    @PostMapping("/create")
    public String createQuiz(@RequestParam int courseId,
                             @RequestParam(required = false) List<Integer> sessionId,  // Allow multiple session IDs
                             @RequestParam(required = false) List<Integer> sessionDetailId,  // Allow multiple session detail IDs
                             @RequestParam String quizName,
                             @RequestParam int questionLimit,  // Number of questions to include
                             @RequestParam(required = false) List<DifficultyLevel> difficultyLevels,  // Allow multiple difficulty levels
                             Model model) {

        // Step 1: Create the quiz
        RDQuiz quiz = new RDQuiz();
        quiz.setQuizName(quizName);

        // Save the newly created quiz
        quizService.saveOrUpdate(quiz);  

        // Step 2: Fetch random questions based on course/session/session detail and selected difficulty levels
        List<RDQuizQuestion> questions = new ArrayList<>();

        // If session details are provided, fetch questions based on session detail and difficulty levels
        if (sessionDetailId != null && !sessionDetailId.isEmpty()) {
            for (Integer detailId : sessionDetailId) {
                questions.addAll(quizQuestionService.getRandomQuestionsBySessionDetailAndDifficultyLevels(detailId, difficultyLevels, questionLimit));
            }
        }
        // If session is provided, fetch questions based on session and difficulty levels
        else if (sessionId != null && !sessionId.isEmpty()) {
            for (Integer sid : sessionId) {
                questions.addAll(quizQuestionService.getRandomQuestionsBySessionAndDifficultyLevels(sid, difficultyLevels, questionLimit));
            }
        }
        // If only course is provided, fetch questions based on course and difficulty levels
        else {
            questions.addAll(quizQuestionService.getRandomQuestionsByCourseAndDifficultyLevels(courseId, difficultyLevels, questionLimit));
        }

        // Step 3: Map the randomly selected questions to the quiz
        for (RDQuizQuestion question : questions) {
            quizService.addQuestionToQuiz(quiz.getQuizId(), question.getQuestionId());
        }

        // Step 4: Add a message to the model for UI feedback
        model.addAttribute("message", "Quiz created successfully with " + questions.size() + " questions.");

        // Step 5: Redirect to the quiz list page after quiz creation
        return "redirect:/quizzes/list";
    }

    
    @GetMapping("/dashboard")
    public String showQuizDashboard(@RequestParam(value = "courseId", required = false) Integer courseId,
                                    @RequestParam(value = "status", required = false) String status,
                                    @RequestParam(value = "difficultyLevel", required = false) String difficultyLevel,
                                    Model model) {
    	 // Initialize form model object
        RDQuizDashboardForm quizDashboardForm = new RDQuizDashboardForm();  // Your form class

        // Fetch the list of quizzes based on filters
        List<RDQuiz> quizzes = quizService.getQuizzesFiltered(courseId, status, difficultyLevel);
        model.addAttribute("quizzes", quizzes);

        // Fetch quizQuestionMap for each quiz
        Map<Integer, List<RDQuizQuestionMap>> quizQuestionMaps = new HashMap<>();
        for (RDQuiz quiz : quizzes) {
            List<RDQuizQuestionMap> questionMaps = quizQuestionMapService.getQuizQuestionMappingsByQuizId(quiz.getQuizId());
            quizQuestionMaps.put(quiz.getQuizId(), questionMaps);
        }
        model.addAttribute("quizQuestionMaps", quizQuestionMaps);
        // Add other data needed for filtering
     // Add form object and necessary data to the model
        model.addAttribute("quizDashboardForm", quizDashboardForm);  // Bind form to model

        model.addAttribute("courses", courseService.getRDCourses());
        model.addAttribute("difficultyLevels", DifficultyLevel.values());

        // Set selected filter values for displaying in the form
        model.addAttribute("selectedCourseId", courseId);
        model.addAttribute("selectedStatus", status);
        model.addAttribute("selectedDifficultyLevel", difficultyLevel);

        return "quizzes/quizDashboard";
    }
    
    // List available quizzes
    @GetMapping
    public String listQuizzes(Model model) {
        List<RDQuiz> quizzes = quizService.findAll();
        model.addAttribute("quizzes", quizzes);
        return "quizzes/list";  // list.jsp to display available quizzes
    }

 // Start a quiz and navigate through questions
    @GetMapping("/start/{quizId}")
    public String startQuiz(@PathVariable int quizId, 
                            HttpSession session, HttpServletRequest request, 
                            Model model, @RequestParam(value = "currentQuestionIndex", defaultValue = "0") int currentQuestionIndex) {
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
        return "quizzes/take";  // Display a single question at a time
    }
    
    @PostMapping("/navigate")
    public String navigateQuiz(
            @RequestParam("quizId") int quizId,
            @RequestParam("currentQuestionIndex") int currentQuestionIndex,
            @RequestParam("action") String action,
            @RequestParam Map<String, String> answers,  // Capture answers for the current question
            HttpSession session, Model model) {

        // Fetch the user from the session
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            // Handle case where the user is not logged in
            return "redirect:/login";
        }

        // Fetch the quiz and question IDs using the mapping
        RDQuiz quiz = quizService.findById(quizId);
        List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);

        if (questionIds.isEmpty()) {
            model.addAttribute("message", "No questions available for this quiz.");
            return "quizzes/error";
        }

        // Fetch the questions using the question IDs
        List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);

        // Store the current question's answer before navigating
        String currentQuestionParam = "question_" + quizQuestions.get(currentQuestionIndex).getQuestionId();
        Map<Integer, Integer> selectedAnswers = (Map<Integer, Integer>) session.getAttribute("selectedAnswers");
        if (selectedAnswers == null) {
            selectedAnswers = new HashMap<>();
        }
        if (answers.containsKey(currentQuestionParam)) {
            int selectedOptionId = Integer.parseInt(answers.get(currentQuestionParam));
            selectedAnswers.put(quizQuestions.get(currentQuestionIndex).getQuestionId(), selectedOptionId);
        }

        session.setAttribute("selectedAnswers", selectedAnswers);  // Save selected answers in the session

        // Handle navigation action (Next/Previous/Submit)
        if ("next".equals(action)) {
            currentQuestionIndex++;
        } else if ("previous".equals(action)) {
            currentQuestionIndex--;
        } else if ("submit".equals(action)) {
            return submitQuiz(answers, model, session);  // Submit the quiz
        }

        // Ensure valid question index bounds
        if (currentQuestionIndex < 0) currentQuestionIndex = 0;
        if (currentQuestionIndex >= quizQuestions.size()) currentQuestionIndex = quizQuestions.size() - 1;

        // Set current question and pass it to the view
        RDQuizQuestion currentQuestion = quizQuestions.get(currentQuestionIndex);
        model.addAttribute("quiz", quiz);
        model.addAttribute("currentQuestion", currentQuestion);
        model.addAttribute("currentQuestionIndex", currentQuestionIndex);
        model.addAttribute("totalQuestions", quizQuestions.size());

        return "quizzes/take";  // Return to quiz page
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
        Map<Integer, Integer> selectedAnswers = (Map<Integer, Integer>) session.getAttribute("selectedAnswers");

        // Evaluate the quiz
        int correctAnswersCount = 0;
        int pointsEarned = 0;
        int pointsPerCorrectAnswer = 10;  // Example: 10 points per correct answer

        for (RDQuizQuestion question : quizQuestions) {
            int questionId = question.getQuestionId();
            if (selectedAnswers.containsKey(questionId)) {
                int selectedOptionId = selectedAnswers.getOrDefault(questionId, -1);

                // Check if the selected option is correct
                if (question.getCorrectOption().getOptionId() == selectedOptionId) {
                    correctAnswersCount++;
                    pointsEarned += pointsPerCorrectAnswer;
                }
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

        return "quizzes/result";  // Return to quiz result page
    }
}

