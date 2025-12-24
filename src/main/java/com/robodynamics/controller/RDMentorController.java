package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.dto.RDMentorSearchCriteria;
import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDMentorSkill;
import com.robodynamics.service.RDMentorService;
import com.robodynamics.service.RDMentorSkillService;

@Controller
@RequestMapping("/mentors")
public class RDMentorController {

    @Autowired
    private RDMentorService mentorService;

    @Autowired
    private RDMentorSkillService skillService;
    
    
    @GetMapping("/view/{mentorId}")
    public String viewMentorProfile(
            @PathVariable("mentorId") Integer mentorId,
            Model model) {

        // Fetch mentor + skills + feedback + recommendations
        RDMentor mentor = mentorService.getMentorById(mentorId);

        if (mentor == null) {
            model.addAttribute("errorMsg", "Mentor not found");
            return "error/404";
        }

        model.addAttribute("mentor", mentor);

        model.addAttribute("title", mentor.getFullName() + " | Mentor Profile");

        return "mentors/view-profile";  // JSP name inside /WEB-INF/views/mentors/
    }


    @GetMapping
    public String mentorLanding(Model model) {
        model.addAttribute("title", "Apply to Teach | Robo Dynamics");
        return "mentors";
    }

    @GetMapping("/dashboard")
    public String mentorDashboard(Model model) {
        model.addAttribute("title", "Mentor Dashboard");
        return "mentor-dashboard";
    }

    @GetMapping("/search")
    public String searchMentors(
            @RequestParam(required = false) String city,

            // MULTI-SELECT SKILLS
            @RequestParam(required = false, name = "skillCodes") List<String> skillCodes,

            // MULTI-SELECT GRADES
            @RequestParam(required = false, name = "grades") List<Integer> grades,

            @RequestParam(required = false) String board,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) String enquiryText,
            @RequestParam(defaultValue = "false") Boolean verifiedOnly,

            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "experienceYears") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            Model model) {


        // -------------------------------
        // BUILD THE NEW MULTI-SELECT CRITERIA
        // -------------------------------
        RDMentorSearchCriteria criteria = new RDMentorSearchCriteria(
                city,
                skillCodes,
                grades,
                board,
                gender,
                mode,
                enquiryText,
                verifiedOnly
        );


        // -------------------------------
        // FETCH DATA
        // -------------------------------

        List<RDMentor> mentors =
                mentorService.searchMentors(criteria, page, size, sortBy, sortDir);

        long totalMentors = mentorService.countMentors(criteria);
        int totalPages = (int) Math.ceil((double) totalMentors / size);

        // Build query string for pagination
        String queryString = criteria.getQueryString();


        // -------------------------------
        // ADD TO MODEL
        // -------------------------------
        model.addAttribute("criteria", criteria);
        model.addAttribute("mentors", mentors);
        model.addAttribute("skills", skillService.findAllDistinctSkills());
        model.addAttribute("boards", RDMentorSkill.SyllabusBoard.values());

        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", size);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("totalMentors", totalMentors);
        model.addAttribute("queryString", queryString);

        return "mentors/mentor-search";
    }
}
