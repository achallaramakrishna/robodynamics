package com.robodynamics.controller;

import com.robodynamics.model.RDBadge;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserBadge;
import com.robodynamics.model.RDUserQuizResults;
import com.robodynamics.service.RDUserQuizResultService;
import com.robodynamics.service.RDUserPointsService;
import com.robodynamics.service.RDBadgeService;
import com.robodynamics.service.RDUserBadgeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

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


    @GetMapping("/studentDashboard")
    public String showStudentDashboard(Model model, HttpSession session) {
    	 RDUser currentUser = (RDUser) session.getAttribute("rdUser");

    	    if (currentUser != null && currentUser.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
    	        // Fetch quiz results
    	        List<RDUserQuizResults> quizResults = quizResultService.findByUserId(currentUser.getUserID());

    	        // Calculate total points
    	        int totalPoints = quizResults.stream().mapToInt(RDUserQuizResults::getScore).sum();

    	        // Fetch badges earned by the student
    	        List<RDUserBadge> userBadges = userBadgeService.findByUserId(currentUser.getUserID());

    	        // Extract badge information from RDUserBadge
    	        List<RDBadge> badges = userBadges.stream()
    	                                         .map(RDUserBadge::getBadge)  // Assuming RDUserBadge has a getBadge() method
    	                                         .collect(Collectors.toList());

    	        // Add to model
    	        model.addAttribute("quizResults", quizResults);
    	        model.addAttribute("totalPoints", totalPoints);
    	        model.addAttribute("badges", badges);
    	        model.addAttribute("totalQuizzes", quizResults.size());

    	        return "studentDashboard";
    	    } else {
    	        return "login";  // Redirect to login if not logged in or not a student
    	    }
    }
}
