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

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.EmailService;
import com.robodynamics.service.RDAssetService;
import com.robodynamics.service.RDAssetTransactionService;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/parent")
public class RDParentController {

	@Autowired
	private RDUserService service;

	
	@Autowired
	private RDAssetService assetService;
	
	@Autowired
	private RDAssetTransactionService assetTransactionService;
	
	@Autowired
	private RDClassAttendanceService attendanceService;

	
	
	@Autowired
	private EmailService emailService;

	/*
	 * @Autowired MailSender mailSender;
	 */

	@GetMapping("/register")
	public ModelAndView home1(Model m, HttpSession session) {
		RDUser rdUser = new RDUser();
		m.addAttribute("rdUser", rdUser);
		ModelAndView modelAndView = new ModelAndView("registerParentPageOne");
		return modelAndView;
	}
    
	@GetMapping("/profile")
	public ModelAndView showProfile( Model theModel, HttpSession session) {
		RDUser parent = null;
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
		}

		System.out.println("user - " + parent);
		List<RDUser> childs = service.getRDChilds(parent.getUserID());
		System.out.println(childs);
		theModel.addAttribute("childs", childs);
		ModelAndView modelAndView = new ModelAndView("showProfile");
		return modelAndView;
	}
	
	@GetMapping("/legos")
	public ModelAndView showLegos( Model theModel, HttpSession session) {
		
        List < RDAsset> legoAssets = assetService.getRDAssetLegos();
        theModel.addAttribute("legoAssets", legoAssets);
        
        RDUser parent = null;
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
			theModel.addAttribute("user", parent);
		}
        
		ModelAndView modelAndView = new ModelAndView("showLegos");
		return modelAndView;
	}

	@GetMapping("/3dPens")
	public ModelAndView show3DPen( Model theModel, HttpSession session) {
		RDUser parent = null;
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
		}
		theModel.addAttribute("rdUser", parent);

		ModelAndView modelAndView = new ModelAndView("show3DPen");
		return modelAndView;
	}

	@GetMapping("/showFirstPageSuccess")
	public ModelAndView showFirstPageSuccess(Model m) {
		RDUser rdUser = new RDUser();
		m.addAttribute("rdUser", rdUser);
		ModelAndView modelAndView = new ModelAndView("showFirstPageSuccess");
		return modelAndView;
	}

	@GetMapping("/parentDashboard")
	public ModelAndView parentDashboard(@ModelAttribute("rdUser") RDUser rdUser, Model m, HttpSession session) {
		System.out.println(rdUser);
		m.addAttribute("rdUser", rdUser);
		
		if (rdUser != null) {
			session.setAttribute("rdUser", rdUser);
		}

		ModelAndView modelAndView = new ModelAndView("parentDashboard");
		return modelAndView;
	}

	/*
	 * @GetMapping("/register2") public ModelAndView home2(Model
	 * m, @RequestParam("userid") Integer userId) { // error handling to implement
	 * 
	 * System.out.println("register2 here .........." + userId);
	 * 
	 * RDUser rdUser = service.getRDUser(userId); rdUser.setUserName(null);
	 * rdUser.setPassword(null); m.addAttribute("rdUser", rdUser);
	 * 
	 * ModelAndView modelAndView = new ModelAndView("registerParentPageTwo"); return
	 * modelAndView; }
	 */

	@PostMapping("/registerParentPageOne")
	public String register1(@ModelAttribute("rdUser") RDUser rdUser, Model model, HttpSession session) {

		rdUser.setProfile_id(RDUser.profileType.ROBO_PARENT.getValue());
		service.registerRDUser(rdUser);
		if (rdUser != null) {
			session.setAttribute("rdUser", rdUser);
		}
		
		model.addAttribute("rdUser", rdUser);
		model.addAttribute("success", "Dear Parent, You have Registered Successfully. Please Login !!!");

		return "parentDashboard";

	}

	/*
	 * @PostMapping("/registerParentPageTwo") public String
	 * register2(@ModelAttribute("rdUser") RDUser rdUser, Model model, HttpSession
	 * session) { rdUser.setProfile_id(RDUser.profileType.ROBO_PARENT.getValue());
	 * service.registerRDUser(rdUser); String subject =
	 * "Congratulations. Welcome to Robo Dynamics !!!"; String body =
	 * "You have Registered Successfully !!!"; String url =
	 * "http://localhost:8090/robodynamics/login"; body +=
	 * "Please click on the url to login " + url; System.out.println(subject);
	 * System.out.println(body); emailService.sendEmail(rdUser.getEmail(), subject,
	 * body);
	 * 
	 * if (rdUser != null) { session.setAttribute("rdUser", rdUser); }
	 * 
	 * model.addAttribute("rdUser", rdUser); model.addAttribute("success",
	 * "Dear Parent, You have Registered Successfully. Please Login !!!");
	 * 
	 * return "parentDashboard"; }
	 */
	
	@GetMapping("/showForm")
	public ModelAndView home(@ModelAttribute("parent") RDUser parent, Model m) {
		RDUser child = new RDUser();
		child.setDad(parent);
		m.addAttribute("child",child);
		ModelAndView modelAndView = new ModelAndView("child-form");
		return modelAndView;
	}
	
	@PostMapping("/registerChild")
    public String saveCustomer(@ModelAttribute("child") RDUser child, HttpSession session) {
		RDUser parent = null;
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
		}
		System.out.println(child);
		child.setDad(parent);
		child.setProfile_id(RDUser.profileType.ROBO_STUDENT.getValue());
        service.registerRDUser(child);
        return "redirect:/parent/profile";

		
    }

    @GetMapping("/updateForm")
    public String showFormForUpdate(@RequestParam("userId") int theId,
        Model theModel) {
    	RDUser child = service.getRDUser(theId);
        theModel.addAttribute("child", child);
        return "child-form";
    }

    @GetMapping("/deleteChild")
    public String deleteCustomer(@RequestParam("userId") int theId) {
        service.deleteRDUser(theId);
        return "redirect:/parent/profile";
    }
    
	

}
