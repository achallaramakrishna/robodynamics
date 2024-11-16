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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/contact")
public class RDContactController {

    @Autowired
    private RDContactService rdContactService;

    @PostMapping("/saveContact")
    public String saveRDContact(@ModelAttribute("contactForm") RDContactUsForm contactForm, 
                                BindingResult result, 
                                Model model, 
                                RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "contactus";
        }
        RDContact contact = new RDContact();
        contact.setName(contactForm.getContactName());
        contact.setEmail(contactForm.getEmail());
        contact.setCellPhone(contactForm.getCellPhone());
        contact.setMessage(contactForm.getMessage());
        rdContactService.saveRDContact(contact);

     // Use RedirectAttributes to pass success message
        redirectAttributes.addFlashAttribute("successMessage", "Thank you for contacting us. We will get back to you soon.");
        return "redirect:/contact/contactus"; // Ensure correct redirect path
    }

    @GetMapping("/all")
    public List<RDContact> getAllRDContacts() {
        return rdContactService.getAllRDContacts();
    }

    @GetMapping("/contactus")
    public String contactus(Model model) {
        model.addAttribute("contactForm", new RDContactUsForm());
        return "contactus";
    }
}
