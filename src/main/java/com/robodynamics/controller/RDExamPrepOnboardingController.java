	package com.robodynamics.controller;
	
	import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
	
	import javax.servlet.http.HttpSession;
	
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Controller;
	import org.springframework.ui.Model;
	import org.springframework.web.bind.annotation.GetMapping;
	import org.springframework.web.bind.annotation.ModelAttribute;
	import org.springframework.web.bind.annotation.PostMapping;
	import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDLearningPath;
	import com.robodynamics.model.RDUser;
	import com.robodynamics.model.RDExam;
	import com.robodynamics.service.RDLearningPathService;
	import com.robodynamics.service.RDExamService;
	import com.robodynamics.service.RDUserService;
	
	@Controller
	@RequestMapping("/exam-prep/onboarding")
	public class RDExamPrepOnboardingController {
	
	    @Autowired
	    private RDLearningPathService learningPathService;
	
	    @Autowired
	    private RDExamService examService;
	
	    @Autowired
	    private RDUserService userService;
	
	    /**
	     * Display the onboarding form.
	     */
	    @GetMapping
	    public String showOnboardingForm(HttpSession session, Model model,
	                                     @RequestParam(value = "childId", required = false) Integer childId) {
	        RDUser user = (RDUser) session.getAttribute("rdUser");
	        if (user == null) {
	            return "redirect:/login"; // Redirect to login if no user is logged in
	        }

	        model.addAttribute("user", user);
	        // Fetch children if the user is a parent
	        if (user.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
	            List<RDUser> children = userService.getRDChilds(user.getUserID());
	            model.addAttribute("children", children);
	        }

	        
	        // Default to the logged-in user if no child is selected
	        RDUser targetUser = user;
	        if (childId != null) {
	            targetUser = userService.getRDUser(childId); // Fetch the selected child's user object
	            model.addAttribute("selectedChildId", childId); // Set selectedChildId for JSP
	        }
	        // Fetch exams and learning paths for the target user
	        List<RDExam> exams = examService.getAllExamsWithTargetDates();
	        List<RDLearningPath> existingLearningPaths = learningPathService.getLearningPathsByUser(targetUser);

	        model.addAttribute("exams", exams);
	        model.addAttribute("existingLearningPaths", existingLearningPaths);
	        model.addAttribute("learningPath", new RDLearningPath());

	        return "learningpath/onboarding-form"; // Return the onboarding form view
	    }

	
	    @PostMapping
	    public String createLearningPath(
	            @RequestParam("selectedChildId") Integer selectedChildId,
	            @RequestParam("examId") Integer examId,
	            @RequestParam("targetDate") String targetDate,
	            HttpSession session, Model model) {
	        
	        RDUser loggedInUser = (RDUser) session.getAttribute("rdUser");

	        if (loggedInUser == null) {
	            return "redirect:/login"; // Redirect to login if no user is logged in
	        }

	        // Determine the user (parent or selected child)
	        RDUser user = loggedInUser;
	        if (loggedInUser.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue() && selectedChildId != null) {
	            user = userService.getRDUser(selectedChildId);
	        }

	        // Fetch RDExam based on examId
	        RDExam exam = examService.getExamById(examId);
	        if (exam == null) {
	            model.addAttribute("errorMessage", "Invalid or missing exam selection.");
	            return "learningpath/onboarding-form";
	        }

	        // Convert targetDate to Date object
	        Date targetDateParsed = null;
	        try {
	            targetDateParsed = new SimpleDateFormat("yyyy-MM-dd").parse(targetDate);
	        } catch (ParseException e) {
	            model.addAttribute("errorMessage", "Invalid target date format.");
	            return "learningpath/onboarding-form";
	        }

	        // Validate for duplicate learning paths
	        int examYear = exam.getExamYear();
	        if (learningPathService.isLearningPathExists(user, exam, examYear)) {
	            model.addAttribute("errorMessage", "A learning path already exists for this exam and year.");
	            return "learningpath/onboarding-form";
	        }

	        // Create and save the learning path
	        RDLearningPath learningPath = new RDLearningPath();
	        learningPath.setUser(user);
	        learningPath.setExam(exam);
	        learningPath.setTargetDate(targetDateParsed);
	        learningPath.setCreatedAt(new Date());
	        learningPath.setUpdatedAt(new Date());
	        learningPath.setStatus("Active");

	        learningPathService.saveLearningPath(learningPath);

	        model.addAttribute("learningPath", learningPath);
	        return "learningpath/onboarding-success"; // Redirect to success page
	    }

	}
