package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDCourseForm;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDCourseResource;
import com.robodynamics.service.RDCourseCategoryService;
import com.robodynamics.service.RDCourseService;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/coursemonitor")
public class RDCourseMonitorController {
	
	
	@Autowired
	ServletContext servletContext;
	

	@Autowired
	private RDCourseService service;
	
	@Autowired
	private RDCourseCategoryService courseCategoryService;

	@GetMapping("/slide1")
	    public String listCourses(Model theModel) {
	        List < RDCourse > courses = service.getRDCourses();
	        theModel.addAttribute("courses", courses);
	        return "showslide";
	}
	
	
}
