package com.robodynamics.controller;

import com.robodynamics.service.RDCompetitionService;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCompetitionRegistrationService;
import com.robodynamics.service.RDCompetitionRoundService;
import com.robodynamics.service.RDCompetitionScoreService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
public class RDCompetitionDashboardController {

    @Autowired
    private RDCompetitionService competitionService;

    @Autowired
    private RDCompetitionRegistrationService registrationService;

    @Autowired
    private RDCompetitionRoundService roundService;

    @Autowired
    private RDCompetitionScoreService scoreService;

    @GetMapping("/admin/competitions/dashboard")
    public String openCompetitionDashboard(Model model, HttpSession session) {

    	 RDUser rdUser = new RDUser();
         if (session.getAttribute("rdUser") != null) {
             session.invalidate();
             model.addAttribute("success", "You have logout Successfully!!!");
         } else {
            return "redirect:/login";
        }

        

        // 1 = Super Admin, 2 = Admin
       
        if (rdUser.getProfile_id() == RDUser.profileType.ROBO_ADMIN.getValue() || rdUser.getProfile_id() == RDUser.profileType.SUPER_ADMIN.getValue()) {
            model.addAttribute("errorMessage", "Access Denied: Admins Only");
            return "error/access-denied";
        }

        // ------- SUMMARY DATA -------
        Map<String, Object> summary = new HashMap<>();
        summary.put("upcoming", competitionService.countUpcomingCompetitions());
        summary.put("registrations", registrationService.countAllRegistrations());
        summary.put("pendingScores", scoreService.countPendingScores());
        summary.put("results", competitionService.countCompetitionsWithResults());

        model.addAttribute("summary", summary);

        return "admin/competitions/competition-dashboard";
    }
}
