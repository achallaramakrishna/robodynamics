package com.robodynamics.controller;

import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDMentorSkill;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDMentorOnboardingService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Controller
@RequestMapping("/mentors/onboarding")
public class RDMentorOnboardingController {

    @Resource
    private RDMentorOnboardingService onboardingService;

    // ----- constants -----
    private static final String VIEW = "mentor/onboarding_wizard";
    private static final String CONSENT_TEXT =
        "I agree that Robo Dynamics may display my mentor profile (name, headline, bio) and my photo on its website/app and marketing pages. "
      + "I confirm I have the rights to upload the photo and content, and I can withdraw this permission later by contacting support.";

    // ----- auth helpers -----
    private RDUser sessionUser(HttpSession session) {
        return (session == null) ? null : (RDUser) session.getAttribute("rdUser");
    }

    private Integer currentUserIdOrNull(HttpSession session) {
        RDUser u = sessionUser(session);
        return (u == null) ? null : u.getUserID(); // keep getUserID() as per your model
    }

    // ⬇️ changed: redirect unauthenticated users to SIGNUP (not login)
    private String redirectToSignup(HttpServletRequest req) {
        String uri  = req.getRequestURI();
        String qs   = req.getQueryString();
        String next = uri + (qs != null ? "?" + qs : "");
        String encNext = URLEncoder.encode(next, StandardCharsets.UTF_8);
        return "redirect:/mentors/signup?next=" + encNext;
    }

    // ----- GET: wizard -----
    @GetMapping
    public String view(@RequestParam(value = "step", required = false) String step,
                       Model model,
                       HttpSession session,
                       HttpServletRequest req) {

        Integer uid = currentUserIdOrNull(session);
        if (uid == null) return redirectToSignup(req);   // ⇠ updated

        var status = onboardingService.getStatus(uid);

        // gating & default tab
        String active = step;
        if (active == null) {
            active = !status.isHasConsent() ? "consent"
                    : !status.isHasProfile() ? "profile"
                    : "skills";
        }
        if ("profile".equals(active) && !status.isHasConsent()) active = "consent";
        if ("skills".equals(active) && !status.isHasProfile()) active = "profile";

        // data for JSP
        model.addAttribute("activeTab", active);
        model.addAttribute("hasConsent", status.isHasConsent());
        model.addAttribute("hasProfile", status.isHasProfile());
        model.addAttribute("hasSkills",  status.isHasSkills());
        model.addAttribute("consentText", CONSENT_TEXT);

        RDMentor mentor = onboardingService.getMentorByUserId(uid);
        model.addAttribute("mentor", mentor == null ? new RDMentor() : mentor);
        
        RDUser user = sessionUser(session);
        model.addAttribute("user", user);


        var resumeMeta = onboardingService.getCurrentResumeMeta(uid); // Pair<String, Boolean> or null
        model.addAttribute("currentResumeName", resumeMeta == null ? "" : resumeMeta.getLeft());
        model.addAttribute("resumePublic",     resumeMeta != null && resumeMeta.getRight());

        model.addAttribute("skills", onboardingService.getSkills(uid));
        model.addAttribute("subjects", List.of("MATH","SCIENCE","ENGLISH","HINDI","KANNADA","CODING","ROBOTICS"));
        model.addAttribute("boards", RDMentorSkill.SyllabusBoard.values());

        return VIEW;
    }

    // ----- POST: consent -----
    @PostMapping("/consent")
    public String saveConsent(HttpServletRequest req,
                              HttpSession session,
                              RedirectAttributes ra) {
        Integer uid = currentUserIdOrNull(session);
        if (uid == null) return redirectToSignup(req);   // ⇠ updated

        onboardingService.recordConsent(
            uid,
            CONSENT_TEXT,
            req.getRemoteAddr(),
            req.getHeader("User-Agent")
        );
        ra.addFlashAttribute("flashOk", "Consent saved.");
        return "redirect:/mentors/onboarding?step=profile";
    }

    // ----- POST: profile + resume -----
    @PostMapping("/profile")
    public String saveProfile(@RequestParam("fullName") String fullName,
                              @RequestParam(required = false) String headline,
                              @RequestParam(required = false) String bio,
                              @RequestParam(required = false) BigDecimal yearsExperience,
                              @RequestParam(required = false) Integer hourlyRateInr,
                              @RequestParam(required = false) String city,
                              @RequestParam(required = false) String area,
                              @RequestParam(required = false) String teachingModes, // CSV: ONLINE,OFFLINE,...
                              @RequestParam(required = false) MultipartFile resume,
                              @RequestParam(required = false, defaultValue = "false") boolean resumePublic,
                              HttpSession session,
                              HttpServletRequest req,
                              RedirectAttributes ra) {

        Integer uid = currentUserIdOrNull(session);
        if (uid == null) return redirectToSignup(req);   // ⇠ updated

        onboardingService.saveProfile(
            uid, fullName, headline, bio, yearsExperience,
            hourlyRateInr, city, area, teachingModes,
            resume, resumePublic
        );
        ra.addFlashAttribute("flashOk", "Profile saved.");
        return "redirect:/mentors/onboarding?step=skills";
    }

    // ----- POST: skills -----
    @PostMapping("/skills")
    public String saveSkills(@RequestParam("subjectCode") List<String> subjectCodes,
                             @RequestParam("gradeMin") List<Integer> gradeMins,
                             @RequestParam("gradeMax") List<Integer> gradeMaxs,
                             @RequestParam("board") List<String> boards,
                             HttpSession session,
                             HttpServletRequest req,
                             RedirectAttributes ra) {

        Integer uid = currentUserIdOrNull(session);
        if (uid == null) return redirectToSignup(req);   // ⇠ updated

        onboardingService.replaceSkills(uid, subjectCodes, gradeMins, gradeMaxs, boards);
        ra.addFlashAttribute("flashOk", "Skills updated. You’re all set!");
        return "mentor/thankyoumentor";  // resolves to /WEB-INF/views/mentor/thankyoumentor.jsp
    }
}
