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
	private RDCourseSessionDetailService courseSessionDetailservice;
	
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
	//	List <RDCourseSessionDetail> courseSessionDetails = courseSessionDetailservice.getRDCourseSessionDetails(theId);
		
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
    public String saveCourse(@ModelAttribute("courseForm") RDCourseForm courseForm,
    		BindingResult result) {
        if(result.hasErrors()) {
        	return "showForm";
        }
		
        System.out.println("course name : " + courseForm.getCourseName());
        System.out.println("course category id : " + courseForm.getCourseCategoryId());
        
        MultipartFile imageFile = courseForm.getImageFile();
        RDCourse theCourse = new RDCourse();
        theCourse.setCourseName(courseForm.getCourseName());
    	RDCourseCategory courseCategory = new RDCourseCategory();
    	courseCategory.setCourseCategoryId(courseForm.getCourseCategoryId());
    	
    	theCourse.setCourseCategory(courseCategory);
    	
        if(imageFile != null || !imageFile.isEmpty()) {
        	System.out.println("hello............");
        	String fileName = servletContext.getRealPath("/") + "resources\\images\\" + imageFile.getOriginalFilename();
        	try {
        		imageFile.transferTo(new File(fileName));
			} catch (IllegalStateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        	System.out.println(fileName);
        }
        
		service.saveRDCourse(theCourse);
        return "redirect:/course/list";
    }

    @GetMapping("/updateForm")
    public String showFormForUpdate(@RequestParam("courseId") int theId,
        Model theModel) {
    	RDCourse course = service.getRDCourse(theId);
        theModel.addAttribute("course", course);
        return "course-form";
    }

    @GetMapping("/delete")
    public String deleteCourse(@RequestParam("courseId") int theId) {
        service.deleteRDCourse(theId);
        return "redirect:/course/list";
    }
	
}
