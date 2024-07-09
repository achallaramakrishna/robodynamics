package com.robodynamics.controller;

import java.util.List;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.EmailService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/student")
public class RDStudentController {

	@Autowired
	private RDUserService service;

	@Autowired
	private EmailService emailService;

	/*
	 * @Autowired MailSender mailSender;
	 */

	@GetMapping("/studentDashboard")
	public ModelAndView parentDashboard(@ModelAttribute("rdUser") RDUser rdUser, Model m, HttpSession session) {
		System.out.println(rdUser);
		m.addAttribute("rdUser", rdUser);
		
		if (rdUser != null) {
			session.setAttribute("rdUser", rdUser);
		}

		ModelAndView modelAndView = new ModelAndView("studentDashboard");
		return modelAndView;
	}
	
	@GetMapping("/viewcourses")
	public ModelAndView viewCourses(@ModelAttribute("rdUser") RDUser rdUser, Model m, HttpSession session) {
		System.out.println(rdUser);
		m.addAttribute("rdUser", rdUser);
		
		if (rdUser != null) {
			session.setAttribute("rdUser", rdUser);
		}

		ModelAndView modelAndView = new ModelAndView("/enrollment/listbystudent");
		return modelAndView;
	}
}
