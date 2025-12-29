package com.robodynamics.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.form.RDRegistrationForm;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDUserService;

@Controller
public class RDParentChildRegistrationController {

    @Autowired
    private RDUserService rdUserService;

    // -------------------------------------------------------------
    // 1️⃣  Show Registration Page
    // -------------------------------------------------------------
    @GetMapping("/registerParentChild")
    public String showParentChildForm(@RequestParam(value = "courseId", required = false) Integer courseId,
                                      Model model) {

        RDRegistrationForm registrationForm = new RDRegistrationForm();
        registrationForm.setParent(new RDRegistrationForm.Parent());
        registrationForm.setChild(new RDRegistrationForm.Child());

        model.addAttribute("registrationForm", registrationForm);
        model.addAttribute("courseId", courseId);

        return "registerParentChild";  // JSP name
    }

    // -------------------------------------------------------------
    // 2️⃣  Handle Submission
    // -------------------------------------------------------------
    @PostMapping("/registerParentChild")
    public String handleParentChildRegistration(
            @ModelAttribute("registrationForm") RDRegistrationForm registrationForm,
            BindingResult result,
            Model model) {

        try {
            RDRegistrationForm.Parent parent = registrationForm.getParent();
            RDRegistrationForm.Child child = registrationForm.getChild();

            // Basic validation
            if (parent == null || child == null) {
                model.addAttribute("errorMessage", "Invalid form submission. Please fill all required fields.");
                return "registerParentChild";
            }

            if (rdUserService.isUsernameTaken(parent.getUserName())) {
                model.addAttribute("errorMessage", "Parent username already exists. Please choose another.");
                return "registerParentChild";
            }

            if (rdUserService.isUsernameTaken(child.getUserName())) {
                model.addAttribute("errorMessage", "Child username already exists. Please choose another.");
                return "registerParentChild";
            }

            // ✅ Convert to RDUser entities using helper methods in RDUser
            RDUser parentUser = RDUser.fromParent(parent);
            RDUser childUser = RDUser.fromChild(child);

            // ✅ Link parent-child relationship
            // You can store mom or dad depending on gender (for now, we’ll set mom)
          //  childUser.setMom(parentUser);
            

            // ✅ Save parent & child together via service
            rdUserService.saveParentAndChild(parent, child);

            model.addAttribute("successMessage",
                    "Parent and Child registration successful! You can now log in to Robo Dynamics LMS.");
            return "redirect:/login?registered=true&redirect=/competitions/register";

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", "An unexpected error occurred while processing registration.");
            return "registerParentChild";
        }
    }
}
