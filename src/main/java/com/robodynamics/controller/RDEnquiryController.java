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
import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDAssetCategoryService;
import com.robodynamics.service.RDEnquiryService;

import java.util.*;

@Controller
@RequestMapping("/enquiry")
public class RDEnquiryController {

	@Autowired
	private RDEnquiryService service;

	@GetMapping("/list")
    public String listEnquiries(Model theModel) {
        List < RDEnquiry > enquiries = service.getRDEnquiries();
        System.out.println("Number of enquiries - " + enquiries.size());
        theModel.addAttribute("enquiries", enquiries);
        return "listEnquiries";
    }
	@GetMapping("/showForm")
	public ModelAndView home(Model m) {
		RDEnquiry enquiry = new RDEnquiry();
		m.addAttribute("enquiry", enquiry);
		ModelAndView modelAndView = new ModelAndView("enquiry-form");
		return modelAndView;
	}
	
	@PostMapping("/saveEnquiry")
    public String saveCustomer(@ModelAttribute("enquiry") RDEnquiry theEnquiry) {
		theEnquiry.setEnquiryDate(new Date());
        service.saveRDEnquiry(theEnquiry);
        return "redirect:/enquiry/list";
    }

    @GetMapping("/updateForm")
    public ModelAndView showFormForUpdate(@RequestParam("enquiryId") int theId,
        Model theModel) {
    	RDEnquiry enquiry = service.getRDEnquiry(theId);
        theModel.addAttribute("enquiry", enquiry);
        ModelAndView modelAndView = new ModelAndView("enquiry-form");
		return modelAndView;
    }

    @GetMapping("/delete")
    public String deleteEnquiry(@RequestParam("enquiryId") int theId) {
        service.deleteRDEnquiry(theId);
        return "redirect:/enquiry/list";
    }
	
}
