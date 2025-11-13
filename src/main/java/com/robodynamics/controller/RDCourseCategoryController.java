package com.robodynamics.controller;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.service.RDCourseCategoryService;

import java.util.*;

@Controller
@RequestMapping("/coursecategory")
public class RDCourseCategoryController {

	@Autowired
	private RDCourseCategoryService service;

	@GetMapping("/list")
	    public String listCourseCategories(Model theModel) {
	        List < RDCourseCategory > courseCategories = service.getRDCourseCategories();
	        theModel.addAttribute("courseCategories", courseCategories);
	        return "listCourseCategories";
	    }
	
	@GetMapping("/showForm")
	public ModelAndView home(Model m) {
		RDCourseCategory courseCategory = new RDCourseCategory();
		m.addAttribute("courseCategory", courseCategory);
		ModelAndView modelAndView = new ModelAndView("coursecategory-form");
		return modelAndView;
	}
	
	@PostMapping("/saveCourseCategory")
    public String saveCustomer(@ModelAttribute("courseCategory") RDCourseCategory theCourseCategory) {
		service.saveRDCourseCategory(theCourseCategory);
        return "redirect:/coursecategory/list";
    }

    @GetMapping("/updateForm")
    public String showFormForUpdate(@RequestParam("courseCategoryId") int theId,
        Model theModel) {
    	RDCourseCategory courseCategory = service.getRDCourseCategory(theId);
        theModel.addAttribute("courseCategory", courseCategory);
        return "coursecategory-form";
    }

    @GetMapping("/delete")
    public String deleteCourseCategory(@RequestParam("courseCategoryId") int theId, RedirectAttributes redirectAttributes) {
    	try {
    		service.deleteRDCourseCategory(theId);
            redirectAttributes.addFlashAttribute("successMessage", "Course category deleted successfully!");
        } catch (DataIntegrityViolationException e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Cannot delete category because it has assigned courses.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", 
                    "Something went wrong while deleting the category. Please try again.");
            }
        return "redirect:/coursecategory/list";

    }
	
}
