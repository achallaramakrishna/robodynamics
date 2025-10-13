package com.robodynamics.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.robodynamics.form.RDContactUsForm;

@Controller
public class RDHeaderController {

    @GetMapping("/about")
    public String about(Model model) {
        model.addAttribute("title", "About Us");
        return "about";   // /WEB-INF/views/about.jsp
    }

    @GetMapping("/mentors/apply")
    public String mentors(Model model) {
        model.addAttribute("title", "Become a Mentor");
        return "mentors";
    }

    @GetMapping("/pricing/plans")
    public String pricing(Model model) {
        model.addAttribute("title", "Our Pricing Plans");
        return "pricing";
    }

    @GetMapping("/contact-us")
    public String contact(Model model) {
        model.addAttribute("title", "Contact Us");
        model.addAttribute("contactForm", new RDContactUsForm());
        return "contact";
    }
}
