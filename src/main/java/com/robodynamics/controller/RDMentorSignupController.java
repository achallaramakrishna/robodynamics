package com.robodynamics.controller;

import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDMentorOnboardingService;
import com.robodynamics.service.RDUserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.constraints.Email;

@Controller
@RequestMapping("/mentors/signup")
public class RDMentorSignupController {

    @Resource private RDUserService userService;
    @Resource private RDMentorOnboardingService onboardingService;

    // ----- GET: show signup form -----
    @GetMapping
    public String form(@RequestParam(value = "next", required = false) String next, Model model) {
        model.addAttribute("next", next);
        return "mentor/signup"; // /WEB-INF/jsp/mentor/signup.jsp
    }

    // ----- POST: handle submission -----
    @PostMapping
    public String submit(@RequestParam String firstName,
                         @RequestParam(required = false) String lastName,
                         @RequestParam @Email String email,
                         @RequestParam String cellPhone,
                         @RequestParam String password,
                         @RequestParam(value = "next", required = false) String next,
                         HttpSession session,
                         RedirectAttributes ra) {

        // 1) Block duplicate email
        RDUser existing = userService.findByEmail(email);
        if (existing != null) {
            ra.addFlashAttribute("flashErr", "Email already registered. Please sign in or use another email.");
            ra.addFlashAttribute("prefill_firstName", firstName);
            ra.addFlashAttribute("prefill_lastName",  lastName);
            ra.addFlashAttribute("prefill_cellPhone", cellPhone);
            return "redirect:/mentors/signup" + (next != null && !next.isBlank() ? "?next=" + next : "");
        }

        // 2) Create user with Mentor role (profile_id = 3)
        RDUser u = new RDUser();
        u.setFirstName(firstName);
        u.setLastName(lastName);
        u.setEmail(email);
        u.setCellPhone(cellPhone);
        u.setPassword(password);      // If you hash in service, pass raw here. Otherwise hash before set.
        u.setUserName(email);
        u.setActive(1);
        u.setProfile_id(3);           // 3 = Mentor

        RDUser saved = userService.registerRDUser(u);

        // 3) Ensure mentor profile row exists (rd_mentors)
        String displayName = (firstName + " " + (lastName == null ? "" : lastName)).trim();
        onboardingService.ensureMentorProfile(saved.getUserID(), displayName);

        // 4) Auto-login by putting user in session
        session.setAttribute("rdUser", saved);

        // 5) Go to next (if provided) or onboarding wizard
        ra.addFlashAttribute("flashOk", "Welcome to Robo Dynamics! Let’s complete your mentor profile.");
        String target = (next != null && !next.isBlank()) ? next : "/mentors/onboarding";
        return "redirect:" + target;
    }
}
