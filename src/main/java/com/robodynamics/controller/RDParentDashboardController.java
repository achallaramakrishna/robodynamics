package com.robodynamics.controller;

import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserQuizResults;
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
    private RDUserQuizResultService quizResultService;

    @GetMapping("/parentDashboard")
    public String showParentDashboard(Model model, HttpSession session) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");

        if (currentUser != null && currentUser.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
            // Fetch children (students) under the parent
            List<RDUser> children = userService.getRDChilds(currentUser.getUserID());

            // Fetch quiz results for children
            List<RDUserQuizResults> quizResults = quizResultService.findByUserId(currentUser.getUserID());

            // Add data to model
            model.addAttribute("children", children);
            model.addAttribute("quizResults", quizResults);

            return "parentDashboard";
        } else {
            return "login";  // Redirect to login if not logged in or not a parent
        }
    }
}
