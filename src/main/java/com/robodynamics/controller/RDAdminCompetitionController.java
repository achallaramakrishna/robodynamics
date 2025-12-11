package com.robodynamics.controller;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin/competitions")
public class RDAdminCompetitionController {

    @Autowired
    private RDCompetitionService competitionService;

    @Autowired
    private RDCompetitionRoundService roundService;

    @Autowired
    private RDCompetitionRegistrationService registrationService;

    @Autowired
    private RDCompetitionScoreService scoreService;

    @Autowired
    private RDCompetitionResultService resultService;

    @Autowired
    private RDUserService userService;

    // ------------------ LIST COMPETITIONS ------------------
    @GetMapping("/list")
    public String list(Model model ,
		HttpSession session, HttpServletRequest request) {
		 RDUser rdUser = (RDUser) session.getAttribute("rdUser");
		 if (rdUser == null) {
		     session.setAttribute("redirectUrl", request.getRequestURI());
		     return "redirect:/login";
		 }
	    model.addAttribute("competitions", competitionService.findAll());
        model.addAttribute("today", new Date());
        return "admin/competitions/list";
    }

    // ------------------ CREATE COMPETITION ------------------
    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("competition", new RDCompetition());
        return "admin/competitions/form";
    }


    // ------------------ SAVE (CREATE / UPDATE) ------------------
    @PostMapping("/save")
    public String save(@ModelAttribute("competition") RDCompetition form) {

        // ------------------ EDIT MODE ------------------
        if (form.getCompetitionId() > 0) {
            RDCompetition dbComp = competitionService.findById(form.getCompetitionId());

            // Copy updated fields (including fee)
            dbComp.setTitle(form.getTitle());
            dbComp.setCategory(form.getCategory());
            dbComp.setMode(form.getMode());
            dbComp.setGradeGroup(form.getGradeGroup());
            dbComp.setMaxParticipants(form.getMaxParticipants());

            dbComp.setDate(form.getDate());
            dbComp.setStartTime(form.getStartTime());
            dbComp.setEndTime(form.getEndTime());

            dbComp.setVenue(form.getVenue());
            dbComp.setDescription(form.getDescription());

            dbComp.setRegistrationStartDate(form.getRegistrationStartDate());
            dbComp.setRegistrationEndDate(form.getRegistrationEndDate());

            dbComp.setStatus(form.getStatus());

            // ⭐ NEW — FEE SUPPORT
            dbComp.setFee(form.getFee());

            competitionService.update(dbComp);
        }

        // ------------------ CREATE MODE ------------------
        else {
            // Fee is already bound from form → set directly
            competitionService.save(form);
        }

        return "redirect:/admin/competitions/list";
    }


    // ------------------ EDIT COMPETITION ------------------
    @GetMapping("/edit")
    public String edit(@RequestParam("id") int id, Model model) {
        model.addAttribute("competition", competitionService.findById(id));
        return "admin/competitions/form";
    }


    // ------------------ VIEW REGISTRATIONS ------------------
    @GetMapping("/registrations")
    public String registrations(@RequestParam("id") int competitionId, Model model,
    		HttpSession session, HttpServletRequest request) {
    	 RDUser rdUser = (RDUser) session.getAttribute("rdUser");
         if (rdUser == null) {
             session.setAttribute("redirectUrl", request.getRequestURI());
             return "redirect:/login";
         }
        model.addAttribute("competition", competitionService.findById(competitionId));
    	model.addAttribute("registrations", registrationService.findByCompetition(competitionId));
        return "admin/competitions/registrations";
    }


    // ------------------ MANAGE ROUNDS ------------------
    @GetMapping("/rounds")
    public String listRounds(@RequestParam("competitionId") int compId, Model model,
    		HttpSession session, HttpServletRequest request) {
    	 RDUser rdUser = (RDUser) session.getAttribute("rdUser");
         if (rdUser == null) {
             session.setAttribute("redirectUrl", request.getRequestURI());
             return "redirect:/login";
         }
    	model.addAttribute("competition", competitionService.findById(compId));
        model.addAttribute("rounds", roundService.findByCompetition(compId));
        return "admin/competitions/rounds";
    }

    @GetMapping("/rounds/create")
    public String createRound(@RequestParam("competitionId") int compId, Model model) {
    
    	RDCompetitionRound round = new RDCompetitionRound();
        round.setCompetition(competitionService.findById(compId));
        round.setJudge(new RDUser());   // prevents null binding errors

        model.addAttribute("round", round);
        model.addAttribute("judges", userService.getRDInstructors());

        return "admin/competitions/round_form";
    }

    @PostMapping("/rounds/save")
    public String saveRound(@ModelAttribute("round") RDCompetitionRound round) {

        // If judge is not selected (value="" in dropdown)
        if (round.getJudge() != null && round.getJudge().getUserID() == null) {
            round.setJudge(null);
        }

        roundService.save(round);

        return "redirect:/admin/competitions/rounds?competitionId=" 
                + round.getCompetition().getCompetitionId();
    }

    @GetMapping("/scores")
    public String enterScores(@RequestParam("roundId") int roundId, Model model, HttpServletRequest request, HttpSession session) {

        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            session.setAttribute("redirectUrl", request.getRequestURI());
            return "redirect:/login";
        }

        RDCompetitionRound round = roundService.findById(roundId);
        RDCompetition competition = round.getCompetition();
        Hibernate.initialize(competition);   // Force load the competition

        // Get the existing scores for the round
        Map<Integer, RDCompetitionScore> existingScores = scoreService.findScoresForRound(roundId);
        System.out.println(existingScores);
        // Pass data to the view
        model.addAttribute("round", round);
        model.addAttribute("competition", competition);
        model.addAttribute("participants", registrationService.findByCompetition(competition.getCompetitionId()));
        model.addAttribute("scores", existingScores);  // Pass existing scores to the view

        return "admin/competitions/score_entry";
    }




    @PostMapping("/scores/save")
    public String saveScores(@RequestParam("roundId") Integer roundId,
                             @RequestParam Map<String, String> params, HttpServletRequest request, HttpSession session) {

        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            session.setAttribute("redirectUrl", request.getRequestURI());
            return "redirect:/login";
        }

        RDCompetitionRound round = roundService.findById(roundId);
        RDCompetition competition = round.getCompetition();  // Get the associated competition

        // Process and save the scores
        params.keySet().stream()
                .filter(key -> key.startsWith("score_"))
                .forEach(key -> {
                    Integer studentId = Integer.parseInt(key.replace("score_", ""));
                    Integer scoreValue = Integer.parseInt(params.get(key));
                    String commentValue = params.get("comment_" + studentId);

                    RDCompetitionScore score = scoreService.findForStudent(roundId, studentId);

                    if (score == null) {
                        score = new RDCompetitionScore();
                        score.setRound(round);
                        score.setStudent(userService.getRDUser(studentId));
                    }
                    score.setJudge(rdUser);
                    score.setScore(scoreValue);
                    score.setComments(commentValue);

                    scoreService.save(score);
                });

        // Redirect back to the rounds page after saving scores
        return "redirect:/admin/competitions/rounds?competitionId=" + competition.getCompetitionId();
    }

    @PostMapping("/results/generate")
    public String generateResults(@RequestParam("competitionId") int competitionId,
                                  RedirectAttributes ra,
                                  HttpSession session,
                                  HttpServletRequest request) {

        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            session.setAttribute("redirectUrl", request.getRequestURI());
            return "redirect:/login";
        }

        try {
            resultService.generateResults(competitionId);
            ra.addFlashAttribute("successMessage", "Results generated successfully.");
        } catch (IllegalStateException e) {
            ra.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/admin/competitions/rounds?competitionId=" + competitionId;
    }


    // ------------------ RESULTS ------------------
    @GetMapping("/results")
    public String results(@RequestParam("competitionId") int competitionId, Model model) {
        model.addAttribute("competition", competitionService.findById(competitionId));
        model.addAttribute("results", resultService.findByCompetition(competitionId));
        return "admin/competitions/results";
    }
}
