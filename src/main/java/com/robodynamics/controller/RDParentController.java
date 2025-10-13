package com.robodynamics.controller;

import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDMentorPortfolio;
import com.robodynamics.model.RDMentorRecommendation;
import com.robodynamics.service.RDLeadService;
import com.robodynamics.service.RDMentorPortfolioService;
import com.robodynamics.service.RDMentorRecommendationService;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.service.RDMentorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/parents")
public class RDParentController {

    @Autowired private RDLeadService leadService;
    @Autowired private RDMentorService mentorService;
    
    @Autowired private RDMentorPortfolioService portfolioService;
    @Autowired private RDMentorRecommendationService recommendationService;
    

    // Landing page (demo booking form)
    @GetMapping
    public String parentLanding(Model model) {
        model.addAttribute("title", "Book a Free Demo | Robo Dynamics");
        return "parents"; // /WEB-INF/views/parents.jsp
    }

    @GetMapping("/mentors")
    public String showMentors(@RequestParam("leadId") Long leadId, Model model) {
        RDLead lead = leadService.getLeadById(leadId);
        if (lead == null) {
            model.addAttribute("error", "Lead not found");
            return "error";
        }

        List<RDMentor> mentors = mentorService.findMentorsForLead(lead);

        List<RDMentorDTO> mentorDTOs = mentors.stream()
                .map(m -> new RDMentorDTO(
                        m.getMentorId(),
                        m.getFullName(),
                        m.getCity(),
                        m.getExperienceYears(),
                        // Pick first skill, or combine if multiple
                        m.getSkills().isEmpty() ? "" : m.getSkills().get(0).getSkillLabel(),
                        m.getIsVerified(),
                        (m.getPhotoUrl() != null ? m.getPhotoUrl() : "/images/default-mentor.jpg")

                		))
                .collect(Collectors.toList());

        model.addAttribute("lead", lead);       // ✅ add this

        model.addAttribute("mentors", mentorDTOs);
        return "parents-mentors"; // JSP
    }
    
    @GetMapping("/mentor/{mentorId}")
    public String viewMentorProfile(@PathVariable Integer mentorId,
                                    @RequestParam Long leadId,
                                    Model model) {
        RDMentor mentor = mentorService.getMentorById(mentorId);
        List<RDMentorPortfolio> portfolios = portfolioService.getPortfoliosForMentor(mentorId);
        List<RDMentorRecommendation> recommendations = recommendationService.getRecommendationsForMentor(mentorId);

        model.addAttribute("mentor", mentor);
        model.addAttribute("lead", leadService.getLeadById(leadId));
        model.addAttribute("portfolios", portfolios);
        model.addAttribute("recommendations", recommendations);

        return "parents-mentor-profile";
    }


    



    // Book demo with mentor
    @PostMapping("/demo/book")
    public String bookDemo(@RequestParam Long leadId,
                           @RequestParam Long mentorId,
                           @RequestParam String slot) {
        // call demoService.scheduleDemo(leadId, mentorId, slot);
        return "redirect:/parents/demo/confirm?leadId=" + leadId;
    }

    // Confirmation page
    @GetMapping("/demo/confirm")
    public String confirmDemo(@RequestParam Long leadId, Model model) {
        RDLead lead = leadService.getLeadById(leadId);
        model.addAttribute("lead", lead);
        return "parents-demo-confirm";
    }
}
