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
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Controller
@RequestMapping("/mentors/signup")
public class RDMentorSignupController {

    @Resource private RDUserService userService;
    @Resource private RDMentorOnboardingService onboardingService;

    // ----- GET: show signup form (with prefill) -----
    @GetMapping
    public String form(@RequestParam(value = "next", required = false) String next,
                       @RequestParam(value = "firstName", required = false) String qFirstName,
                       @RequestParam(value = "lastName",  required = false) String qLastName,
                       @RequestParam(value = "email",     required = false) String qEmail,
                       @RequestParam(value = "cellPhone", required = false) String qCellPhone,
                       HttpSession session,
                       Model model) {
    	System.out.println("signup 1 ..");
    	
        // if flash already provided prefill_* (after a redirect), keep it
        if (!model.containsAttribute("prefill_firstName")
         && !model.containsAttribute("prefill_lastName")
         && !model.containsAttribute("prefill_email")
         && !model.containsAttribute("prefill_cellPhone")) {
        	System.out.println("signup 2 ..");

            // try session user
	        RDUser u = (RDUser) session.getAttribute("rdUser");
            if (u != null) {
                model.addAttribute("prefill_firstName", u.getFirstName());
                model.addAttribute("prefill_lastName",  u.getLastName());
                model.addAttribute("prefill_email",     u.getEmail());
                model.addAttribute("prefill_cellPhone", u.getCellPhone());
            }
        	System.out.println("signup 3 ..");

            // URL params override if present
            if (has(qFirstName)) model.addAttribute("prefill_firstName", qFirstName);
            if (has(qLastName))  model.addAttribute("prefill_lastName",  qLastName);
            if (has(qEmail))     model.addAttribute("prefill_email",     qEmail);
            if (has(qCellPhone)) model.addAttribute("prefill_cellPhone", qCellPhone);
        }
    	System.out.println("signup 4 ..");

        model.addAttribute("next", has(next) ? next : "/mentors/onboarding?step=consent");
        return "mentor/signup"; // /WEB-INF/jsp/mentor/signup.jsp (adjust to your resolver)
    }

    private boolean has(String s) { return s != null && !s.isBlank(); }

 // ----- POST: handle submission -----
    @PostMapping
    public String submit(@RequestParam String firstName,
                         @RequestParam(required = false) String lastName,
                         @RequestParam @Email String email,
                         @RequestParam String cellPhone,
                         @RequestParam String userName,
                         @RequestParam String password,
                         @RequestParam(value = "next", required = false) String next,
                         HttpSession session,
                         RedirectAttributes ra) {

        // ✅ Validate mobile number
        if (!cellPhone.matches("\\d{10}")) {
            ra.addFlashAttribute("flashErr", "Please enter a valid 10-digit mobile number.");
            stashPrefill(ra, firstName, lastName, email, cellPhone);
            return redirectBack(next);
        }

        String normalizedEmail = email.trim().toLowerCase();
        String normalizedUserName = userName.trim();

        // ✅ Check if a user with this email already exists
        RDUser existingByEmail = userService.findByEmail(normalizedEmail);
        RDUser existingByPhone = userService.findByCellPhone(cellPhone);
        RDUser user;

        try {
            if (existingByEmail != null || existingByPhone != null) {
                // 🧩 Existing user — continue onboarding
                user = (existingByEmail != null) ? existingByEmail : existingByPhone;
                user.setUserName(normalizedUserName);
                user.setPassword(password);
                user.setLastName(lastName);
                user.setActive(1);
                user.setAge(0);
                user.setProfile_id(3);
                userService.save(user);

                ra.addFlashAttribute("flashOk",
                    "This mobile or email is already registered. Continuing your mentor onboarding.");
            } else {
                // 🆕 New user — register and create mentor profile
                RDUser u = new RDUser();
                u.setFirstName(firstName);
                u.setLastName(lastName);
                u.setEmail(normalizedEmail);
                u.setCellPhone(cellPhone);
                u.setUserName(normalizedUserName);
                u.setActive(1);
                u.setAge(0);
                u.setProfile_id(3); // mentor role
                u.setPassword(password);

                user = userService.registerRDUser(u);

                String displayName = (firstName + " " + (lastName == null ? "" : lastName)).trim();
                onboardingService.ensureMentorProfile(user.getUserID(), displayName);

                ra.addFlashAttribute("flashOk",
                    "Welcome to Robo Dynamics! Let’s complete your mentor profile.");
            }

            // ✅ Auto-login
            session.setAttribute("rdUser", user);

            String target = has(next) ? next : "/mentors/onboarding?step=consent";
            return "redirect:" + target;

        } catch (org.hibernate.exception.ConstraintViolationException e) {
            // ⚠️ Graceful handling of duplicate constraint
            ra.addFlashAttribute("flashErr",
                "This mobile number or email is already registered. Please sign in or use another number.");
            stashPrefill(ra, firstName, lastName, email, cellPhone);
            return redirectBack(next);
        } catch (Exception e) {
            e.printStackTrace();
            ra.addFlashAttribute("flashErr", "An unexpected error occurred. Please try again.");
            stashPrefill(ra, firstName, lastName, email, cellPhone);
            return redirectBack(next);
        }
    }

    private void stashPrefill(RedirectAttributes ra, String first, String last, String email, String phone) {
        ra.addFlashAttribute("prefill_firstName", first);
        ra.addFlashAttribute("prefill_lastName",  last);
        if (email != null) ra.addFlashAttribute("prefill_email", email);
        ra.addFlashAttribute("prefill_cellPhone", phone);
    }

    private String redirectBack(String next) {
        String q = has(next) ? "?next=" + URLEncoder.encode(next, StandardCharsets.UTF_8) : "";
        return "redirect:/mentors/signup" + q;
    }
}
