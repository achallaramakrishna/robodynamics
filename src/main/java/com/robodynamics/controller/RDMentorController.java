package com.robodynamics.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/mentors")
public class RDMentorController {

    // Landing page (apply to teach form)
    @GetMapping
    public String mentorLanding(Model model) {
        model.addAttribute("title", "Apply to Teach | Robo Dynamics");
        return "mentors"; // /WEB-INF/views/mentors.jsp
    }

    // Later: /mentors/dashboard
    @GetMapping("/dashboard")
    public String mentorDashboard(Model model) {
        model.addAttribute("title", "Mentor Dashboard");
        return "mentor-dashboard"; // placeholder JSP
    }
}
