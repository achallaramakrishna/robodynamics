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

import com.robodynamics.service.RDCompetitionService;
import com.robodynamics.service.RDRegistrationService;
import com.robodynamics.service.RDSubmissionService;
import com.robodynamics.service.RDWorkshopService;
import com.robodynamics.model.RDCompetition;
import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDSubmission;
import com.robodynamics.model.RDWorkshop;

@Controller
@RequestMapping("/submissions")
public class RDSubmissionController {

    @Autowired
    private RDSubmissionService submissionService;

    @Autowired
    private RDCompetitionService competitionService;

    @GetMapping("/{competitionId}/submit")
    public String submitEntryForm(@PathVariable int competitionId, Model model) {
        RDCompetition competition = competitionService.getRDCompetition(competitionId);
                
        model.addAttribute("competition", competition);
        model.addAttribute("submission", new RDSubmission());
        return "submissions/submit";
    }

    @PostMapping("/{competitionId}/submit")
    public String saveSubmission(@PathVariable int competitionId, @ModelAttribute RDSubmission submission) {
    	RDCompetition competition = competitionService.getRDCompetition(competitionId);
        submission.setCompetition(competition);
        submissionService.saveRDSubmission(submission);
        return "redirect:/competitions/" + competitionId + "/submissions";
    }

    @GetMapping("/{competitionId}/submissions")
    public String viewSubmissions(@PathVariable int competitionId, Model model) {
        List<RDSubmission> submissions = submissionService.findByCompetitionId(competitionId);
        model.addAttribute("submissions", submissions);
        return "submissions/list";
    }
}

