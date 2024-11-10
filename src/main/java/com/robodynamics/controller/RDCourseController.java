package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDCourseForm;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDCourseResource;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.service.RDCourseCategoryService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDStudentEnrollmentService;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/course")
public class RDCourseController {
	
	
	@Autowired
	ServletContext servletContext;
	

	@Autowired
	private RDCourseService service;
	
	@Autowired
	private RDCourseSessionService courseSessionservice;
	

	@Autowired
	private RDCourseCategoryService courseCategoryService;
	
	@Autowired
	private RDStudentEnrollmentService enrollmentService;
	
	@GetMapping("/{courseId}/sessions")
    @ResponseBody
    public List<RDCourseSession> getSessionsByCourse(@PathVariable int courseId) {
        return service.findSessionsByCourseId(courseId);
    }
	

	@GetMapping("/{courseId}")
    public String viewCourseDetails(@PathVariable("courseId") int courseId, Model model) {
        // Fetch course details by course ID from the service
        RDCourse course = service.getRDCourse(courseId);
        System.out.println(course);
        // Add course details to the model
        model.addAttribute("course", course);
        
        return "courseDetails";  // This is the JSP page name
    }
	
	@GetMapping("/list")
	    public String listCourses(Model theModel) {
	        List < RDCourse > courses = service.getRDCourses();
	        theModel.addAttribute("courses", courses);
	        return "listCourses";
	    }
	@GetMapping("/showForm")
	public ModelAndView home(Model theModel) {
		
		List < RDCourseCategory > courseCategories = courseCategoryService.getRDCourseCategories();
		theModel.addAttribute("courseCategories", courseCategories);

		theModel.addAttribute("courseForm", new RDCourseForm());
		
		ModelAndView modelAndView = new ModelAndView("course-form");
		return modelAndView;
	}
	
	@GetMapping("/monitor")
	public ModelAndView monitor(Model theModel,
			@RequestParam("courseId") int theId,
			@RequestParam("enrollmentId") int enrollmentId) {
		
		RDCourse course = service.getRDCourse(theId);
		System.out.println("Enrollment id = " + enrollmentId);
		
		RDStudentEnrollment studentEnrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);
		//RDCourse course = service.getRDCourse(theId);
		List <RDCourseSession> courseSessions = courseSessionservice.getCourseSessionsByCourseId(theId);
		
		System.out.println("Size - " + courseSessions.size());
		System.out.println(courseSessions);
	//	System.out.println(courseSessionDetails);
		
		
		//System.out.println("hello....course id............." + course.getCourseId());
		//System.out.println("hello....course name............." + course.getCourseName());
        theModel.addAttribute("courseSessions", courseSessions);
        theModel.addAttribute("studentEnrollment",studentEnrollment);
       
       // theModel.addAttribute("courseSessionDetails", courseSessionDetails);
        ModelAndView modelAndView = null;

        modelAndView = new ModelAndView("showDashboard");
		
        return modelAndView;
	}
	
	@PostMapping("/saveCourse")
	public String saveCourse(@ModelAttribute("courseForm") RDCourseForm courseForm, BindingResult result) {
	    if (result.hasErrors()) {
	        return "course-form";
	    }

	    // Fetch the existing category from the database using the provided category ID
	    RDCourseCategory courseCategory = courseCategoryService.getRDCourseCategoryById(courseForm.getCourseCategoryId());
	    
	    if (courseCategory == null) {
	        // Handle the case where the category is not found (optional, but recommended)
	        result.rejectValue("courseCategoryId", "error.courseCategoryId", "Invalid course category.");
	        return "course-form";
	    }

	    // Create and set up the course entity
	    RDCourse theCourse = new RDCourse();
	    theCourse.setCourseName(courseForm.getCourseName());
	    theCourse.setCourseCategory(courseCategory); // Properly set the fetched course category

	    // Handle image upload if it's present
	    MultipartFile imageFile = courseForm.getImageFile();
	    if (imageFile != null && !imageFile.isEmpty()) {
	        String fileName = servletContext.getRealPath("/") + "resources/images/" + imageFile.getOriginalFilename();
	        try {
	            imageFile.transferTo(new File(fileName));
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
	    }

	    // Save the course
	    service.saveRDCourse(theCourse);
	    return "redirect:/course/list";
	}

    @GetMapping("/updateForm")
    public String showFormForUpdate(@RequestParam("courseId") int theId,
        Model theModel) {
    	RDCourse course = service.getRDCourse(theId);
    	
    	 // Fetch all course categories to populate the dropdown
        List<RDCourseCategory> courseCategories = courseCategoryService.getRDCourseCategories();

    	RDCourseForm courseForm = course.toRDCourseForm(course);
        theModel.addAttribute("courseForm", courseForm);
        theModel.addAttribute("courseCategories", courseCategories);

        return "course-form";
    }

    @GetMapping("/delete")
    public String deleteCourse(@RequestParam("courseId") int theId) {
        service.deleteRDCourse(theId);
        return "redirect:/course/list";
    }
	
}
