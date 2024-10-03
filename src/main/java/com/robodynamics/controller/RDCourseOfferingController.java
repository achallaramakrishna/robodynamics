package com.robodynamics.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDAssetTransactionForm;
import com.robodynamics.form.RDCourseForm;
import com.robodynamics.form.RDCourseOfferingForm;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/courseoffering")
public class RDCourseOfferingController {
	
	
	@Autowired
	ServletContext servletContext;
	

	@Autowired
	private RDCourseService courseService;
	
	@Autowired
	private RDUserService userService;
	
	@Autowired
	private RDCourseOfferingService courseOfferingService;


	@GetMapping("/list")
    public String listCourseOfferings(Model theModel) {
        List < RDCourseOffering > courseOfferings = courseOfferingService.getRDCourseOfferings();
        System.out.println(courseOfferings);
        theModel.addAttribute("courseOfferings", courseOfferings);
        return "listCourseOfferings";
    }

	@GetMapping("/showCalendar")
    public String showCalendar(Model theModel) {
        List < RDCourseOffering > courseOfferings = courseOfferingService.getRDCourseOfferings();
        System.out.println(courseOfferings);
        theModel.addAttribute("courseOfferings", courseOfferings);
        return "showCalendar";
    }
	

	@GetMapping(value = "/viewCalendar", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List < RDCourseOffering >  getCourseOfferingList() {
        List < RDCourseOffering > courseOfferings = courseOfferingService.getRDCourseOfferings();
        System.out.println("inside view calendar");
        System.out.println(courseOfferings);
        
        return courseOfferings;
    }	

	
    @GetMapping("/showForm")
    public ModelAndView viewHistory(Model theModel) {
    	List < RDCourse > courses = courseService.getRDCourses();
        theModel.addAttribute("courses", courses);
        
        List<RDUser> instructors = userService.getRDInstructors();

        theModel.addAttribute("instructors", instructors);
        
        theModel.addAttribute("courseOfferingForm", new RDCourseOfferingForm());
        
        
		ModelAndView modelAndView = new ModelAndView("course-offering-form");
		return modelAndView;
    }
    
  
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }
    
	@PostMapping("/saveCourseOffering")
    public String saveCourseOffering(@ModelAttribute("courseOfferingForm") RDCourseOfferingForm courseOfferingForm,
    		BindingResult bindingResult) {
		
		System.out.println(courseOfferingForm);
        if(bindingResult.hasErrors()) {
        	 List<FieldError> errors = bindingResult.getFieldErrors();
        	    for (FieldError error : errors ) {
        	        System.out.println (error.getObjectName() + " - " + error.getDefaultMessage());
        	    }
        	  	return "showForm";
        }
        
    	RDCourseOffering theCourseOffering = new RDCourseOffering();

        System.out.println("i am here");
    	RDCourse course = courseService.getRDCourse(courseOfferingForm.getCourseId());
    	System.out.println("course id - " + courseOfferingForm.getCourseId());
    	course.setCourseId(courseOfferingForm.getCourseId());
        RDUser user = userService.getRDUser(courseOfferingForm.getUserID());
    	
    	try {
    		theCourseOffering.setStartDate(new SimpleDateFormat("yyyy-mm-dd").parse(courseOfferingForm.getStartDate()));
    		theCourseOffering.setEndDate(new SimpleDateFormat("yyyy-mm-dd").parse(courseOfferingForm.getEndDate()));

    	
    	} catch (ParseException e) {
			
			e.printStackTrace();
		}
    	theCourseOffering.setCourse(course);
    	theCourseOffering.setInstructor(user);
    	theCourseOffering.setTitle(course.getCourseName());
    	theCourseOffering.setCourseOfferingName(courseOfferingForm.getCourseOfferingName());

		courseOfferingService.saveRDCourseOffering(theCourseOffering);


        
        return "redirect:/courseoffering/list";
    }
	
}
