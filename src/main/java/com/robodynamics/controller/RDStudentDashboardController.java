package com.robodynamics.controller;

import com.robodynamics.model.RDBadge;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserBadge;
import com.robodynamics.model.RDUserQuizResults;
import com.robodynamics.service.RDUserQuizResultService;
import com.robodynamics.service.RDUserPointsService;
import com.robodynamics.service.RDBadgeService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDStudentSessionProgressService;
import com.robodynamics.service.RDUserBadgeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

@Controller
public class RDStudentDashboardController {

    @Autowired
    private RDUserQuizResultService quizResultService;

    @Autowired
    private RDUserPointsService userPointsService;

    @Autowired
    private RDUserBadgeService userBadgeService;  // RDUserBadgeService instead of RDBadgeService

	@Autowired
	private RDStudentEnrollmentService studentEnrollmentService;
	
	@Autowired
	private RDQuizService quizService;



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
    	    m.addAttribute("quizResults", quizResults);  // Pass the quiz results
    	    m.addAttribute("user", rdUser);

    	    ModelAndView modelAndView = new ModelAndView("studentDashboard");
    	    return modelAndView;

	}
}
