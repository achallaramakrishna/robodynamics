package com.robodynamics.controller;

import com.robodynamics.form.RDContactUsForm;
import com.robodynamics.model.RDContact;
import com.robodynamics.service.RDContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping("/contact")
public class RDContactController {

    @Autowired
    private RDContactService rdContactService;
    


    @PostMapping("/saveContact")
    public String saveRDContact(@ModelAttribute("contactForm") RDContactUsForm contactForm, Model model,
			BindingResult result) {
    	
    	List<FieldError> errors = result.getFieldErrors();
        for (FieldError error : errors ) {
            System.out.println (error.getObjectName() + " - " + error.getDefaultMessage());
        }
        
    	if (result.hasErrors()) {
			return "contactus";
		}
    	
    	System.out.println("inside save contact");
    	RDContact contact = new RDContact();
    	contact.setName(contactForm.getContactName());
    	contact.setEmail(contactForm.getEmail());
    	contact.setCellPhone(contactForm.getCellPhone());
    	contact.setMessage(contactForm.getMessage());
        rdContactService.saveRDContact(contact);
        model.addAttribute("successMessage", "Thank you for contacting us. We will get back to you soon.");
        return "contactus";
    }

    @GetMapping("/all")
    public List<RDContact> getAllRDContacts() {
        return rdContactService.getAllRDContacts();
    }
    
    @GetMapping("/contactus")
    public String contactus(Model model) {
    	System.out.println("hello.... i am here ....");
    	model.addAttribute("contactForm", new RDContactUsForm());
    	return "contactus";
    }

   
}
