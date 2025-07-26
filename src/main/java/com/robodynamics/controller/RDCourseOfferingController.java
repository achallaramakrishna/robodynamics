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

        System.out.println("Course Offering - " + courseOfferingForm);
        if (bindingResult.hasErrors()) {
            List<FieldError> errors = bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                System.out.println(error.getObjectName() + " - " + error.getDefaultMessage());
            }
            return "showForm";
        }

        RDCourseOffering theCourseOffering = new RDCourseOffering();
        theCourseOffering.setCourseOfferingId(courseOfferingForm.getCourseOfferingId());
        System.out.println("i am here");

        RDCourse course = courseService.getRDCourse(courseOfferingForm.getCourseId());
        course.setCourseId(courseOfferingForm.getCourseId());

        RDUser user = userService.getRDUser(courseOfferingForm.getUserID());

        try {
            theCourseOffering.setStartDate(new SimpleDateFormat("yyyy-MM-dd").parse(courseOfferingForm.getStartDate()));
            theCourseOffering.setEndDate(new SimpleDateFormat("yyyy-MM-dd").parse(courseOfferingForm.getEndDate()));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        theCourseOffering.setCourse(course);
        theCourseOffering.setInstructor(user);
        theCourseOffering.setTitle(course.getCourseName());
        theCourseOffering.setCourseOfferingName(courseOfferingForm.getCourseOfferingName());

        // ✅ New Fields Start Here
        theCourseOffering.setSessionsPerWeek(courseOfferingForm.getSessionsPerWeek());
	
        if (courseOfferingForm.getDaysOfWeek() != null && courseOfferingForm.getDaysOfWeek().length() > 0) {
            theCourseOffering.setDaysOfWeek(String.join(",", courseOfferingForm.getDaysOfWeek()));
        } else {
            theCourseOffering.setDaysOfWeek(null); // or "" depending on preference
        }


        try {
            if (courseOfferingForm.getSessionStartTime() != null && !courseOfferingForm.getSessionStartTime().isEmpty()) {
                theCourseOffering.setSessionStartTime(java.time.LocalTime.parse(courseOfferingForm.getSessionStartTime()));
            }

            if (courseOfferingForm.getSessionEndTime() != null && !courseOfferingForm.getSessionEndTime().isEmpty()) {
                theCourseOffering.setSessionEndTime(java.time.LocalTime.parse(courseOfferingForm.getSessionEndTime()));
            }
        } catch (Exception e) {
            e.printStackTrace(); // Handle invalid time input gracefully
        }

        // ✅ Save it
        System.out.println("The Course offering -  "+ theCourseOffering );
        courseOfferingService.saveRDCourseOffering(theCourseOffering);

        return "redirect:/courseoffering/list";
    }
    
    @GetMapping("/updateForm")
    public String showUpdateForm(@RequestParam("courseOfferingId") int id, Model model) {
        RDCourseOffering courseOffering = courseOfferingService.getRDCourseOffering(id);
        if (courseOffering == null) {
            throw new RuntimeException("Course Offering not found for id: " + id);
        }

        RDCourseOfferingForm form = new RDCourseOfferingForm();
        form.setCourseOfferingId(courseOffering.getCourseOfferingId());
        form.setCourseId(courseOffering.getCourse().getCourseId());
        form.setUserID(courseOffering.getInstructor().getUserID());
        form.setCourseOfferingName(courseOffering.getCourseOfferingName());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        if (courseOffering.getStartDate() != null) {
            form.setStartDate(sdf.format(courseOffering.getStartDate()));
        }

        if (courseOffering.getEndDate() != null) {
            form.setEndDate(sdf.format(courseOffering.getEndDate()));
        }

        // Set these if they exist
        form.setSessionsPerWeek(courseOffering.getSessionsPerWeek());
        form.setDaysOfWeek(courseOffering.getDaysOfWeek());
        form.setSessionStartTime(courseOffering.getSessionStartTime() != null ? courseOffering.getSessionStartTime().toString() : null);
        form.setSessionEndTime(courseOffering.getSessionEndTime() != null ? courseOffering.getSessionEndTime().toString() : null);

        model.addAttribute("courseOfferingForm", form);
        model.addAttribute("courses", courseService.getRDCourses());
        model.addAttribute("instructors", userService.getRDInstructors());

        System.out.println("Course Offering Form - " + form);
        return "course-offering-form";  // same JSP used for add/update
    }

    @GetMapping("/delete")
    public String deleteCourseOffering(@RequestParam("courseOfferingId") int courseOfferingId) {
        courseOfferingService.deleteCourseOffering(courseOfferingId);
        return "redirect:/courseoffering/list";
    }

	
}
