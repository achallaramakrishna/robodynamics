package com.robodynamics.controller;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDContact;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseTrackingService;
import com.robodynamics.service.RDUserService;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class RDUserController {
	
	@Autowired
	private RDCourseOfferingService courseOfferingService;

	@Autowired
	private RDClassAttendanceService attendanceService;

	@Autowired
	private RDCourseTrackingService trackingService;

	@Autowired
	private RDUserService userService;

	@GetMapping("/register")	
	public ModelAndView home(Model m) {
		RDUser rdUser = new RDUser();
		m.addAttribute("rdUser", rdUser);
		ModelAndView modelAndView = new ModelAndView("register");
		return modelAndView;
	}

	@GetMapping("/listusers")
	public ModelAndView listusers(Model m) {
		RDUser rdUser = new RDUser();
		m.addAttribute("rdUser", rdUser);
		List < RDUser > rdUserList = userService.getRDUsers();
		m.addAttribute("rdUserList", rdUserList);
		ModelAndView modelAndView = new ModelAndView("manageusers");
		return modelAndView;
	}

	@PostMapping("/search")
	public ModelAndView search(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
		List < RDUser > rdUserList = userService.searchUsers(rdUser.getProfile_id(),rdUser.getActive());
		model.addAttribute("rdUserList", rdUserList);
		ModelAndView modelAndView = new ModelAndView("manageusers");
		return modelAndView;
	}
	
	@PostMapping("/register")
	public String register(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
		userService.registerRDUser(rdUser);
		model.addAttribute("success", "Registered Successfully");
		return "login";
	}
	
	@GetMapping("/contactus")
	public String register(@ModelAttribute("rdContact") RDContact rdContact, Model model) {
		
		model.addAttribute(new RDContact());
		return "contactus";
	}
	

	@GetMapping("/login")
	public String loginDisplay(Model m, HttpSession session) {

		RDUser rdUser = new RDUser();

		/*
		 * if (session.getAttribute("rdUser") != null) { session.invalidate();
		 * System.out.println("here"); m.addAttribute("success",
		 * "You have logout Successfully!!!"); }
		 */
		m.addAttribute("rdUser", rdUser);
		return "login";
	}
	
	@GetMapping("/logout")
	public String logout(Model m, HttpSession session) {

		RDUser rdUser = new RDUser();

		if (session.getAttribute("rdUser") != null) {
			session.invalidate();
			System.out.println("here");
			m.addAttribute("success", "You have logout Successfully!!!");
		}
		m.addAttribute("rdUser", rdUser);
		return "login";
	}
	
	@PostMapping("/login")
	public String login(@ModelAttribute("rdUser") RDUser rdUser, Model model, HttpSession session) {
		
		RDUser rdUser2 = userService.loginRDUser(rdUser);
		if (rdUser2 != null) {
			model.addAttribute("rdUser", rdUser2);
			session.setAttribute("rdUser", rdUser2);
			System.out.println("user is in session");
			
			 // Check if there is a redirect URL saved from before login
			
	        String redirectUrl = (String) session.getAttribute("redirectUrl");
			System.out.println("Redirect url - " + redirectUrl);

	        if (redirectUrl != null) {
	            session.removeAttribute("redirectUrl");  // Clear the redirect URL from session
	            return "redirect:" + redirectUrl;  // Redirect back to the original URL (quiz)
	        }
	        
			
			 if (rdUser2.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
		            return "redirect:/parentDashboard";  // Redirect to parentDashboard
		        } else if (rdUser2.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
		            return "redirect:/studentDashboard";  // Redirect to studentDashboard
		        } else {
		            return "dashboard";
		        }
		}
		
		if (rdUser2 == null) {
			System.out.println("on");
			model.addAttribute("error", "Invalid Credentials");
		}
		
		return "login";

	}
	
	@GetMapping("/dashboard")	
	public ModelAndView homeDashboard(Model model) {
		RDUser rdUser = new RDUser();
	    model.addAttribute("rdUser", rdUser);

	    LocalDate today = LocalDate.now();
	    List<RDCourseOffering> todayOfferings = courseOfferingService.getCourseOfferingsByDate(today);
	    model.addAttribute("todayOfferings", todayOfferings);

	    Map<Integer, List<RDUser>> enrolledStudentsMap = new HashMap<>();
	    for (RDCourseOffering offering : todayOfferings) {
	        List<RDUser> students = userService.getEnrolledStudents(offering.getCourseOfferingId());
	        enrolledStudentsMap.put(offering.getCourseOfferingId(), students);
	    }
	    model.addAttribute("enrolledStudentsMap", enrolledStudentsMap);

	    return new ModelAndView("dashboard");
	}
	
	@PostMapping("/dashboard")
    public String showDashboard(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
		System.out.println("Inside dashboard");
        List<RDUser> users = userService.searchUsers(rdUser.getProfile_id(), rdUser.getActive());
        model.addAttribute("users", users);
        return "dashboard";
    }
}
