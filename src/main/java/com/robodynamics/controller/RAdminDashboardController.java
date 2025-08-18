package com.robodynamics.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RAdminDashboardController {


    /**
     * Mentor dashboard – shows attendance & course tracking only.
     */
    @GetMapping("/mentor/dashboard")
    public String mentorDashboard() {
        return "mentor/dashboard"; // /WEB-INF/views/mentor/dashboard.jsp
    }
    
    
}
