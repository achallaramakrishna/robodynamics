package com.robodynamics.controller;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDRegistrationForm;
import com.robodynamics.form.RDRegistrationForm.Child;
import com.robodynamics.form.RDRegistrationForm.Parent;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.EmailService;
import com.robodynamics.service.RDAssetService;
import com.robodynamics.service.RDAssetTransactionService;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.util.EmailUtil;

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
	private RDCourseOfferingService courseOfferingService;
	
	@Autowired
	private RDCourseService courseService;

	@Autowired
	private RDStudentEnrollmentService studentEnrollmentService;
	
	@Autowired
	private EmailService emailService;

	/*
	 * @Autowired MailSender mailSender;
	 */

	@GetMapping("/register")
	public ModelAndView home1(@RequestParam(value = "courseId", required = false) Integer courseId, Model m, HttpSession session) {
	    // Handle the case where courseId is missing or invalid
	    if (courseId == null) {
	        // Optionally, return an error view or redirect
		    m.addAttribute("courseId", courseId);
	    }

	    RDUser rdUser = new RDUser();
	    RDRegistrationForm registrationForm = new RDRegistrationForm();
	    m.addAttribute("courseId", courseId);  // Add courseId to the model

	    m.addAttribute("registrationForm", registrationForm);

	    return new ModelAndView("registerParentPageOne");
	}
    
	@PostMapping("/registerParentChild")
	public String registerParentChild(@ModelAttribute("registrationForm") RDRegistrationForm form,
	                                  @RequestParam(value = "courseId", required = false) Integer courseId,
	                                  @RequestParam("parentConfirmPassword") String parentConfirmPassword,
	                                  @RequestParam("childConfirmPassword") String childConfirmPassword,
	                                  Model model,
	                                  HttpSession session,
	                                  BindingResult result) {

	    // Step 1: Validate if form has errors
	    if (result.hasErrors()) {
	        List<FieldError> errors = result.getFieldErrors();
	        for (FieldError error : errors) {
	            System.out.println(error.getObjectName() + " - " + error.getDefaultMessage());
	        }
	        model.addAttribute("courseId", courseId);
	        return "register";
	    }

	    RDUser parentUser = null;
	    RDUser childUser = null;

	    // Step 2: Check if the parent is already logged in
	    if (session.getAttribute("rdUser") != null) {
	        parentUser = (RDUser) session.getAttribute("rdUser");
	        childUser = service.getChildForParent(parentUser.getUserID()); // Assuming a method to get child if already registered
	    } else {
	        // Step 3: Check if parent and child usernames already exist
	        String username = form.getParent().getUserName();
	        if (service.isUsernameTaken(username)) {
	            model.addAttribute("errorMessage", "Username '" + username + "' already exists. Please choose another.");
	            model.addAttribute("courseId", courseId);
	            return "redirect:/parent/register";
	        }

	        String childUserName = form.getChild().getUserName();
	        if (service.isUsernameTaken(childUserName)) {
	            model.addAttribute("errorMessage", "Username '" + childUserName + "' already exists. Please choose another.");
	            model.addAttribute("courseId", courseId);
	            return "redirect:/parent/register";
	        }

	        // Step 4: Validate password and confirm password fields
	        if (!form.getParent().getPassword().equals(parentConfirmPassword)) {
	            model.addAttribute("errorMessage", "Parent passwords do not match!");
	            model.addAttribute("courseId", courseId);
	            return "redirect:/parent/register";
	        }

	        if (!form.getChild().getPassword().equals(childConfirmPassword)) {
	            model.addAttribute("errorMessage", "Child passwords do not match!");
	            model.addAttribute("courseId", courseId);
	            return "register";
	        }

	        // Step 5: Register parent and child
	        parentUser = RDUser.fromParent(form.getParent());
	        childUser = RDUser.fromChild(form.getChild());
	        RDUser parentUser1 = service.registerRDUser(parentUser); // Save parent user to database
	        childUser.setDad(parentUser1); // Set parent-child relationship
	        RDUser childUser1 = service.registerRDUser(childUser); // Save child user to database

	        // Set the parent in the session after successful registration
	        session.setAttribute("rdUser", parentUser1);
	    }

	    // Step 6: Handle course registration
	    if (courseId != null) {
	        RDCourseOffering courseOffering = courseOfferingService.getOnlineCourseOffering(courseId);
	        if (courseOffering != null) {
	            RDStudentEnrollment enrollment = new RDStudentEnrollment();
	            enrollment.setCourseOffering(courseOffering);
	            enrollment.setParent(parentUser);
	            enrollment.setStudent(childUser);
	            enrollment.setEnrollmentDate(new Date());
	            enrollment.setStatus(0); // 0 means "Pending Payment"
	            studentEnrollmentService.saveRDStudentEnrollment(enrollment);

	            // Step 7: Show UPI Payment Information and Success Message
	            model.addAttribute("courseOffering", courseOffering);
	            model.addAttribute("upiId", "8374377311@ybl"); // Example UPI ID for payment
	            String subject = "Welcome to Robo Dynamics !!! Registration successful!";
	            String body = "Registered Successfully !!! Please complete the payment to confirm your registration.";
	            String url = "http://localhost:8090/robodynamics/login";
	            body += " After Payment Please Login on the url to avail the course. " + url;
	            emailService.sendEmail(parentUser.getEmail(), subject, body);

	            model.addAttribute("message", "Registration successful! Please complete the payment to confirm your registration.");
	            model.addAttribute("courseId", courseId);
	            model.addAttribute("enrollmentId", enrollment.getEnrollmentId());

	            return "registrationSuccess";
	        } else {
	            model.addAttribute("errorMessage", "Invalid course ID.");
	            return "redirect:/courses";
	        }
	    } else {
	        // No courseId, only a signup process for the parent-child
	        model.addAttribute("message", "Signup successful! You can now access the dashboard.");
	        return "redirect:/login";
	    }
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

	
	@PostMapping("/registerParentPageOne")
	public String register1(@ModelAttribute("rdUser") RDUser rdUser, Model model, HttpSession session) {

		rdUser.setProfile_id(RDUser.profileType.ROBO_PARENT.getValue());
		service.registerRDUser(rdUser);
		if (rdUser != null) {
			session.setAttribute("rdUser", rdUser);
		}
		
		model.addAttribute("rdUser", rdUser);
		model.addAttribute("success", "Dear Parent, You have Registered Successfully. Please Login !!!");

		 return "redirect:/login";

	}

	
	
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
