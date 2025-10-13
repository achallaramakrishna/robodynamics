package com.robodynamics.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.service.RDCourseCategoryService;

@Controller
public class RDHomeController {
	
	@Autowired
    private RDCourseCategoryService courseCategoryService;

    @GetMapping({"/", "/home"})
    public String home(Model model) {
        // Add any global attributes if needed
    	
    	// Fetch all course categories
        List<RDCourseCategory> categories = courseCategoryService.getRDCourseCategories();
        
        // Add the categories to the model
        model.addAttribute("categories", categories);
        
        model.addAttribute("title", "Robo Dynamics — Learn & Teach");
        return "home"; // /WEB-INF/views/home.jsp
    }
    
    @GetMapping("/thank-you")
    public String thankYou(@RequestParam(value = "audience", required = false) String audience,
                           @RequestParam(value = "name", required = false) String name,
                           @RequestParam(value = "phone", required = false) String phone,
                           @RequestParam(value = "email", required = false) String email,
                           Model model) {
        model.addAttribute("audience", Optional.ofNullable(audience).orElse("parent"));
        model.addAttribute("name", nvl(name));
        model.addAttribute("phone", nvl(phone));
        model.addAttribute("email", nvl(email));
        return "thank-you"; // /WEB-INF/views/thank-you.jsp
    }
    
    private static String nvl(String s) {
        return s == null ? "" : s;
    }
}
