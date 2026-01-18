package com.robodynamics.controller;

import com.robodynamics.dto.RDStudentQuizSummary;
import com.robodynamics.model.RDBadge;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserBadge;
import com.robodynamics.model.RDUserQuizAnswer;
import com.robodynamics.model.RDUserQuizResults;
import com.robodynamics.service.RDUserQuizResultService;
import com.robodynamics.service.RDUserPointsService;
import com.robodynamics.service.RDUserQuizAnswerService;
import com.robodynamics.service.RDBadgeService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDQuizQuestionMapService;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDStudentSessionProgressService;
import com.robodynamics.service.RDUserBadgeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

@Controller
public class RDStudentDashboardController {

	@Autowired
	private RDQuizQuestionService quizQuestionService;

	@Autowired
	private RDQuizQuestionMapService quizQuestionMapService;

	@Autowired
	private RDUserQuizAnswerService userQuizAnswerService;

	@Autowired
	private RDCourseService courseService;
	
	@Autowired
	private RDCourseSessionService courseSessionService;
	
	
	

	@Autowired
	private RDStudentEnrollmentService enrollmentService;

	@Autowired
	private RDUserQuizResultService quizResultService;

	@Autowired
	private RDUserPointsService userPointsService;

	@Autowired
	private RDUserBadgeService userBadgeService; // RDUserBadgeService instead of RDBadgeService

	@Autowired
	private RDStudentEnrollmentService studentEnrollmentService;

	@Autowired
	private RDQuizService quizService;

	@GetMapping("/student/course-dashboard")
	public String courseDashboard(@RequestParam("courseId") int courseId,
			@RequestParam("enrollmentId") int enrollmentId, Model model, HttpSession session) {

		// Logged-in student
		RDUser rdUser = (RDUser) session.getAttribute("rdUser");

		// Course details
		RDCourse course = courseService.getRDCourse(courseId);
		
		 // ✅ LOAD sessions explicitly
	    List<RDCourseSession> courseSessions =
	            courseSessionService.getCourseSessionsByCourseId(courseId);

		// Enrollment details (used only for progress display)
		RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);

		// ✅ CORRECT quiz performance query
		List<RDStudentQuizSummary> quizSummaries = quizService.getQuizSummaryByUserAndCourse(rdUser.getUserID(),
				courseId);

		// Aggregates
		int totalQuizzes = quizSummaries.size();

		double avgScore = quizSummaries.stream().mapToInt(RDStudentQuizSummary::getScore).average().orElse(0);

		// Model attributes
		model.addAttribute("course", course);
	    model.addAttribute("courseSessions", courseSessions); // IMPORTANT
		model.addAttribute("enrollment", enrollment);
		model.addAttribute("quizSummaries", quizSummaries);
		model.addAttribute("totalQuizzes", totalQuizzes);
		model.addAttribute("avgScore", Math.round(avgScore));

		return "student/course-dashboard";
	}
	
	@GetMapping("/student/session-quizzes")
	public String sessionQuizzes(
	        @RequestParam("courseSessionId") int courseSessionId,
	        @RequestParam("enrollmentId") int enrollmentId,
	        HttpSession session,
	        Model model) {

	    RDUser user = (RDUser) session.getAttribute("rdUser");
	    if (user == null) return "redirect:/login";

	    // Load session
	    RDCourseSession sessionEntity =
	            courseSessionService.getCourseSession(courseSessionId);

	    // Load quizzes under this session
	    List<RDQuiz> quizzes =
	            quizService.findByCourseSession(courseSessionId);

	    // Load quiz results for user
	    Map<Integer, RDUserQuizResults> resultMap =
	            quizResultService.findByUserId(user.getUserID())
	                    .stream()
	                    .collect(Collectors.toMap(
	                            r -> r.getQuiz().getQuizId(),
	                            r -> r,
	                            (a, b) -> a
	                    ));

	    model.addAttribute("session", sessionEntity);
	    model.addAttribute("quizzes", quizzes);
	    model.addAttribute("quizResults", resultMap);
	    model.addAttribute("enrollmentId", enrollmentId);

	    return "student/session-quizzes";
	}

	

	@GetMapping("/studentDashboard")
	public ModelAndView studentDashboard(@ModelAttribute("rdUser") RDUser rdUser, Model m, HttpSession session) {

		if (session.getAttribute("rdUser") != null) {
			rdUser = (RDUser) session.getAttribute("rdUser");
		}
		System.out.println("Going to student dashboard + " + rdUser);

		// Fetch the enrollments for the logged-in student
		List<RDStudentEnrollment> studentEnrollments = studentEnrollmentService
				.getStudentEnrollmentByStudent(rdUser.getUserID());

		// Log the enrollments for debugging
		System.out.println("Student Enrollments: " + studentEnrollments);

		// Add the enrollment data to the model to display in the view
		m.addAttribute("studentEnrollments", studentEnrollments);

		// Fetch the total quizzes taken by the user
		int totalQuizzes = quizResultService.countQuizzesTakenByUser(rdUser.getUserID());

		// Fetch the total points scored by the user
		int totalPoints = userPointsService.calculateTotalPointsByUser(rdUser.getUserID());

		// Fetch the badges earned by the user
		List<RDUserBadge> badges = userBadgeService.findByUserId(rdUser.getUserID());

		// Fetch the quiz results for the user
		List<RDUserQuizResults> quizResults = quizResultService.findByUserId(rdUser.getUserID());

		// Fetch tests allocated to the student
		List<RDQuiz> tests = quizService.findQuizzesForStudent(rdUser.getUserID());

		System.out.println("Tests - " + tests);
		m.addAttribute("tests", tests);

		// Add data to the model
		m.addAttribute("totalQuizzes", totalQuizzes);
		m.addAttribute("totalPoints", totalPoints);
		m.addAttribute("badges", badges);
		m.addAttribute("quizResults", quizResults); // Pass the quiz results
		m.addAttribute("user", rdUser);

		ModelAndView modelAndView = new ModelAndView("studentDashboard");
		return modelAndView;

	}

	@GetMapping("student/quiz-review")
	public String reviewQuiz(
	        @RequestParam("quizId") int quizId,
	        @RequestParam("enrollmentId") int enrollmentId,
	        HttpSession session,
	        Model model) {

	    RDUser user = (RDUser) session.getAttribute("rdUser");
	    if (user == null) return "redirect:/login";

	    // -----------------------------------
	    // 1️⃣ Load quiz + latest result
	    // -----------------------------------
	    RDQuiz quiz = quizService.findById(quizId);

	    RDUserQuizResults result =
	            quizResultService.findLatestByUserAndQuiz(user.getUserID(), quizId);

	    if (result == null) {
	        model.addAttribute("message", "No attempt found for this quiz.");
	        return "quizzes/error";
	    }

	    // -----------------------------------
	    // 2️⃣ Load questions
	    // -----------------------------------
	    List<Integer> questionIds =
	            quizQuestionMapService.findQuestionIdsByQuizId(quizId);

	    List<RDQuizQuestion> quizQuestions =
	            quizQuestionService.findQuestionsByIds(questionIds);

	    // -----------------------------------
	    // 3️⃣ Load stored answers
	    // -----------------------------------
	    Map<Integer, RDUserQuizAnswer> answerMap =
	    	    userQuizAnswerService.getAnswersByUserAndQuiz(user.getUserID(), quizId)
	    	        .stream()
	    	        .collect(Collectors.toMap(
	    	            RDUserQuizAnswer::getQuestionId,
	    	            a -> a,
	    	            (oldVal, newVal) -> newVal   // ✅ keep latest answer
	    	        ));


	    // -----------------------------------
	    // 4️⃣ Rebuild SAME questionAnalysis as submit
	    // -----------------------------------
	    List<Map<String, Object>> questionAnalysis = new ArrayList<>();
	    int correctCount = 0;
	    int attemptedCount = 0;
	    int notAttemptedCount = 0;


	    for (RDQuizQuestion q : quizQuestions) {

	        RDUserQuizAnswer ua = answerMap.get(q.getQuestionId());
	        boolean attempted = ua != null;

	        if (attempted) {
	            attemptedCount++;
	        } else {
	            notAttemptedCount++;
	        }


	        boolean isCorrect = ua != null && ua.isCorrect();
	        if (isCorrect) correctCount++;

	        attempted = ua != null;

	        String selectedAnswerText = "Not Attempted";

	        if (ua != null && ua.getUserAnswer() != null && !ua.getUserAnswer().trim().isEmpty()) {

	            // MCQ → convert optionId to optionText
	            if ("multiple_choice".equals(q.getQuestionType())) {
	                try {
	                    int selectedOptionId = Integer.parseInt(ua.getUserAnswer());

	                    RDQuizOption selectedOption = q.getOptions()
	                            .stream()
	                            .filter(op -> op.getOptionId() == selectedOptionId)
	                            .findFirst()
	                            .orElse(null);

	                    if (selectedOption != null) {
	                        selectedAnswerText = selectedOption.getOptionText();
	                    }

	                } catch (NumberFormatException e) {
	                    selectedAnswerText = ua.getUserAnswer(); // fallback safety
	                }

	            } else {
	                // Non-MCQ (text-based)
	                selectedAnswerText = ua.getUserAnswer();
	            }
	        }


	        String correctAnswerText = q.getCorrectAnswer();

	        // MCQ correct answer resolution
	        if ("multiple_choice".equals(q.getQuestionType())) {
	            RDQuizOption correctOption = q.getOptions()
	                    .stream()
	                    .filter(RDQuizOption::isCorrect)
	                    .findFirst()
	                    .orElse(null);

	            if (correctOption != null) {
	                correctAnswerText = correctOption.getOptionText();
	            }
	        }

	        Map<String, Object> entry = new HashMap<>();
	        entry.put("question", q.getQuestionText());
	        entry.put("selectedAnswer", selectedAnswerText);
	        entry.put("correctAnswer", correctAnswerText);
	        entry.put("isCorrect", isCorrect);
	        entry.put("attempted", attempted);     // ✅ NEW
	        entry.put("options", q.getOptions());

	        questionAnalysis.add(entry);
	    }

	    System.out.println("=======================================");
	    System.out.println("QUIZ REVIEW DEBUG");
	    System.out.println("Quiz ID            : " + quizId);
	    System.out.println("User ID            : " + user.getUserID());
	    System.out.println("Total Questions    : " + quizQuestions.size());
	    System.out.println("Attempted Questions: " + attemptedCount);
	    System.out.println("Not Attempted      : " + notAttemptedCount);
	    System.out.println("Correct Answers    : " + correctCount);
	    System.out.println("=======================================");


	    // -----------------------------------
	    // 5️⃣ UI stats (same as submit)
	    // -----------------------------------
	    int totalQ = quizQuestions.size();
	    double percentage =
	            Math.round((correctCount * 100.0 / totalQ) * 10.0) / 10.0;

	    int courseSessionId = quiz.getCourseSession().getCourseSessionId();

	    // -----------------------------------
	    // 6️⃣ Populate SAME model keys
	    // -----------------------------------
	    model.addAttribute("quiz", quiz);
	    model.addAttribute("quizResult", result);
	    model.addAttribute("correctAnswers", correctCount);
	    model.addAttribute("totalQuestions", totalQ);
	    model.addAttribute("percentage", percentage);
	    model.addAttribute("pointsEarned", result.getPointsEarned());
	    model.addAttribute("questionAnalysis", questionAnalysis);
	    
	    model.addAttribute("courseSessionId", courseSessionId);
	    model.addAttribute("courseId", quiz.getCourse().getCourseId());
	    model.addAttribute("enrollmentId", enrollmentId);

	    model.addAttribute("isReview", true); // 🔴 IMPORTANT


	    return "quizzes/result";
	}


}
