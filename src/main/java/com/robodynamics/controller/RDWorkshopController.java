package com.robodynamics.controller;

import java.util.List;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.service.RDRegistrationService;
import com.robodynamics.service.RDWorkshopService;
import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;

@Controller
@RequestMapping("/workshops")
public class RDWorkshopController {

    @Autowired
    private RDWorkshopService workshopService;
    
    @Autowired
    private RDRegistrationService registrationService;

    @GetMapping
    public String listWorkshops(Model model) {
        List<RDWorkshop> workshops = workshopService.getRDWorkshops();
        model.addAttribute("workshops", workshops);
        return "listWorkshops";
    }

    @GetMapping("/{id}/register")
    public String registerForm(@PathVariable int id, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(id);
        model.addAttribute("workshop", workshop);
        System.out.println(workshop);
        model.addAttribute("registration", new RDRegistration());
        return "registerWorkshop";
    }

    @PostMapping("/{id}/register")
    public String saveRegistration(@PathVariable int id, 
    		@ModelAttribute RDRegistration registration, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(id);
        registration.setWorkshop(workshop);
        registrationService.saveRDRegistration(registration);
        
        model.addAttribute("workshop",workshop);
        
        return "redirect:/workshops/" + id + "/registrations";
    }

    @GetMapping("/{id}/registrations")
    public String viewRegistrations(@PathVariable int id, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(id);
	    List<RDRegistration> registrations = registrationService.getRDRegistration(workshop);
        model.addAttribute("workshop", workshop);
        model.addAttribute("registrations", registrations);
        return "registrations";
    }
}
