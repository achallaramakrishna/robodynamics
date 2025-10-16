package com.robodynamics.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDMentorService;

@Controller
public class RDMentorDashboardController {


	@Autowired private RDMentorService mentorService;
	
	@Autowired private RDCourseOfferingService courseOfferingService;

    /**
     * Mentor dashboard – shows attendance & course tracking only.
     */
    @GetMapping("/mentor/dashboard")
    public String mentorDashboard(HttpSession session, Model model) {
    	 RDUser user = (RDUser) session.getAttribute("rdUser");
    	    if (user == null) {
    	        return "redirect:/login";
    	    }

    	    boolean profileExists = mentorService.hasMentorProfile(user.getUserID());
    	    List<RDCourseOffering> courseOfferings = courseOfferingService.getCourseOfferingsByMentor(user.getUserID());
    	    model.addAttribute("courseOfferings", courseOfferings);
    	    model.addAttribute("mentorCourseOfferings", courseOfferings);

    	    model.addAttribute("user", user);
    	    model.addAttribute("profileExists", profileExists);
    	    model.addAttribute("title", "Mentor Dashboard");

        return "mentor/dashboard"; // /WEB-INF/views/mentor/dashboard.jsp
    }
    
    
}
