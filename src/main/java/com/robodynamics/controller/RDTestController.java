package com.robodynamics.controller;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/tests")
public class RDTestController {

    @Autowired
    private RDQuizService quizService;

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @Autowired
    private RDQuizQuestionMapService quizQuestionMapService;

    // Show the test creation page
    @GetMapping("/create")
    public String showCreateTestForm(Model model, HttpSession session) {
        RDQuiz quiz = new RDQuiz();
        model.addAttribute("quiz", quiz);

        // Get the current user from the session
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser == null) {
            return "redirect:/login"; // Redirect to login if the user is not logged in
        }

        // Get list of courses
        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);

        // Fetch quizzes created by the current user
        List<RDQuiz> createdQuizzes = quizService.findQuizzesByCreator(currentUser.getUserID());
        model.addAttribute("createdQuizzes", createdQuizzes);

        return "tests/createTest";
    }

    // Save the test
    @PostMapping("/save")
    public String saveTest(
            @ModelAttribute("quiz") RDQuiz quiz,
            @RequestParam("courseId") Integer courseId,
            @RequestParam("courseSessionIds") List<Integer> courseSessionIds, // Multiple course session IDs
            @RequestParam("difficultyLevel") List<String> difficultyLevels, // Multi-select values
            @RequestParam("questionType") List<String> questionTypes,       // Multi-select values
            @RequestParam("totalQuestions") int totalQuestions,
            @RequestParam("durationMinutes") int durationMinutes,
            HttpSession httpSession) {

        // Fetch the associated course
        RDCourse course = courseService.getRDCourse(courseId);

        quiz.setCourse(course);
        quiz.setTotalQuestions(totalQuestions);
        quiz.setDurationMinutes(durationMinutes);

        RDUser currentUser = (RDUser) httpSession.getAttribute("rdUser");
        System.out.println("Current User - " + currentUser);
        quiz.setCreatedByUser(currentUser);
        quiz.setCategory(course.getCategory());
        quiz.setGradeRange(RDQuiz.GradeRange.ALL_GRADES);

        // Save the quiz to get the generated ID
        quizService.saveOrUpdate(quiz);

        // Fetch random questions matching the selected criteria across multiple course sessions
        List<RDQuizQuestion> selectedQuestions =
                quizQuestionService.findQuestionsByCriteria(courseId, courseSessionIds, questionTypes, difficultyLevels, totalQuestions);
        System.out.println("Selected questions - " + selectedQuestions);

        // Map selected questions to the quiz
        for (RDQuizQuestion question : selectedQuestions) {
            RDQuizQuestionMap quizQuestionMap = new RDQuizQuestionMap();
            quizQuestionMap.setQuiz(quiz);
            quizQuestionMap.setQuestion(question);
            quizQuestionMapService.saveQuizQuestionMap(quizQuestionMap);
        }

        return "redirect:/tests/list";
    }

    // List all tests
    @GetMapping("/list")
    public String listTests(Model model, HttpSession session) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        List<RDQuiz> quizzes;

        // Fetch quizzes based on user roles
        if (currentUser.getProfile_id() == RDUser.profileType.ROBO_ADMIN.getValue()) {
            // Admin can see only their own created quizzes
            quizzes = quizService.findQuizzesByCreator(currentUser.getUserID());
        } else if (currentUser.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
            // Parent can see quizzes they created
            quizzes = quizService.findQuizzesByCreator(currentUser.getUserID());
        } else if (currentUser.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
            // Student can see quizzes they created + quizzes shared by their parent
            quizzes = quizService.findQuizzesForStudent(currentUser.getUserID());
        } else {
            // Default case: empty list for unhandled roles
            quizzes = List.of();
        }

        // Prepare test URLs for sharing or displaying
        Map<Integer, String> testUrls = new HashMap<>();
        for (RDQuiz quiz : quizzes) {
            String testUrl = generateTestUrl(quiz.getQuizId());
            testUrls.put(quiz.getQuizId(), testUrl);
        }

        model.addAttribute("tests", quizzes);
        model.addAttribute("testUrls", testUrls);
        model.addAttribute("currentUser", currentUser);

        return "tests/list";
    }

    // Generate a unique test URL
    private String generateTestUrl(int quizId) {
        return "/tests/take?testId=" + quizId; // Modify the base URL as per your application's structure
    }

    // Dynamic loading of course sessions
    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        return Map.of("courseSessions", courseSessions);
    }
}
