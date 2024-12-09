package com.robodynamics.controller;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDLearningPath;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserQuizResults;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDLearningPathService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDUserQuizResultService;
import com.robodynamics.service.RDUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
public class RDParentDashboardController {

    @Autowired
    private RDUserService userService;
    
    @Autowired
    private RDQuizService quizService;
    
    
    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDUserQuizResultService quizResultService;
    
    @Autowired
    private RDLearningPathService learningPathService;

    @GetMapping("/parentDashboard")
    public String showParentDashboard(Model model, HttpSession session) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        System.out.println("Current User - " + currentUser);
        
        if (currentUser != null && currentUser.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
            // Fetch children (students) under the parent
            List<RDUser> children = userService.getRDChilds(currentUser.getUserID());

            // Fetch quiz results for children
            List<RDUserQuizResults> quizResults = quizResultService.findByUserId(currentUser.getUserID());

            List<RDQuiz> createdTests = quizService.findQuizzesByCreator(currentUser.getUserID());
            List<RDLearningPath> learningPaths = learningPathService.findPathsByParent(currentUser.getUserID());
            
            System.out.println("Created tests - " + createdTests);
            model.addAttribute("createdTests", createdTests);
            model.addAttribute("learningPaths", learningPaths);

            
            // Add data to model
            
            List<RDCourse> availableCourses = courseService.getRDCourses();
    	    System.out.println("hello available courses");
    	    System.out.println(availableCourses);
    	    // Add the list of available courses to the model
    	    model.addAttribute("availableCourses", availableCourses);

    	    
    	    
            model.addAttribute("children", children);
            model.addAttribute("quizResults", quizResults);

            return "parentDashboard";
        } else {
            return "login";  // Redirect to login if not logged in or not a parent
        }
    }
}
