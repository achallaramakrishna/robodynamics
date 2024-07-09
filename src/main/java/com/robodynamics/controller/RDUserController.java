package com.robodynamics.controller;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDUserService;

import java.util.List;

@Controller
public class RDUserController {

	@Autowired
	private RDUserService service;

	@GetMapping("/register")
	public ModelAndView home(Model m) {
		RDUser rdUser = new RDUser();
		m.addAttribute("rdUser", rdUser);
		ModelAndView modelAndView = new ModelAndView("register");
		return modelAndView;
	}

	@GetMapping("/listusers")
	public ModelAndView listusers(Model m) {
		List < RDUser > rdUserList = service.getRDUsers();
		m.addAttribute("rdUserList", rdUserList);
		ModelAndView modelAndView = new ModelAndView("manageusers");
		return modelAndView;
	}

	@PostMapping("/register")
	public String register(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
		service.registerRDUser(rdUser);
		model.addAttribute("success", "Registered Successfully");
		return "login";
	}
	
	

	@GetMapping("/login")
	public String loginDisplay(Model m, HttpSession session) {

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
		
		System.out.println("RD user - " + rdUser);
		RDUser rdUser2 = service.loginRDUser(rdUser);
		System.out.println("rdUser2" + rdUser2);
		if (rdUser2 != null) {
			System.out.println("hello");
			model.addAttribute("rdUser", rdUser2);
			session.setAttribute("rdUser", rdUser2);
			
			if(rdUser2.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {

				return "parentDashboard";

			} else 	if(rdUser2.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {

				return "studentDashboard";

			} else {

				return "welcome";
			}
		}
		
		if (rdUser2 == null) {
			System.out.println("on");
			model.addAttribute("error", "Invalid Credentials");
		}
		
		return "login";

	}
}
