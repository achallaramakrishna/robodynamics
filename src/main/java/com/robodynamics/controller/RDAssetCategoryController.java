package com.robodynamics.controller;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDAssetCategoryService;

import java.util.*;

@Controller
@RequestMapping("/assetcategory")
public class RDAssetCategoryController {

	@Autowired
	private RDAssetCategoryService service;

	@GetMapping("/list")
	    public String listAssetCategories(Model theModel) {
	        List < RDAssetCategory > assetCategories = service.getRDAssetCategories();
	        theModel.addAttribute("assetCategories", assetCategories);
	        return "listAssetCategories";
	    }
	@GetMapping("/showForm")
	public ModelAndView home(Model m) {
		RDAssetCategory assetCategory = new RDAssetCategory();
		m.addAttribute("assetCategory", assetCategory);
		ModelAndView modelAndView = new ModelAndView("assetcategory-form");
		return modelAndView;
	}
	
	@PostMapping("/saveAssetCategory")
    public String saveCustomer(@ModelAttribute("assetCategory") RDAssetCategory theAssetCategory) {
        service.saveRDAssetCategory(theAssetCategory);
        return "redirect:/assetcategory/list";
    }

    @GetMapping("/updateForm")
    public ModelAndView showFormForUpdate(@RequestParam("assetCategoryId") int theId,
        Model theModel) {
    	RDAssetCategory assetCategory = service.getRDAssetCategory(theId);
        theModel.addAttribute("assetCategory", assetCategory);
        ModelAndView modelAndView = new ModelAndView("assetcategory-form");
		return modelAndView;
    }

    @GetMapping("/delete")
    public String deleteCustomer(@RequestParam("assetCategoryId") int theId) {
        service.deleteRDAssetCategory(theId);
        return "redirect:/assetcategory/list";
    }
	
}
