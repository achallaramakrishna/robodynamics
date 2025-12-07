package com.robodynamics.controller;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
    public String list(Model model) {
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
    public String registrations(@RequestParam("id") int competitionId, Model model) {
        model.addAttribute("registrations", registrationService.findByCompetition(competitionId));
        return "admin/competitions/registrations";
    }


    // ------------------ MANAGE ROUNDS ------------------
    @GetMapping("/rounds")
    public String listRounds(@RequestParam("competitionId") int compId, Model model) {
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


    // ------------------ SCORE ENTRY ------------------
    @GetMapping("/scores")
    public String enterScores(@RequestParam("roundId") int roundId, Model model) {
        RDCompetitionRound round = roundService.findById(roundId);

        model.addAttribute("round", round);
        model.addAttribute("participants",
                registrationService.findByCompetition(round.getCompetition().getCompetitionId()));
        model.addAttribute("scores", scoreService.findByRound(roundId));

        return "admin/competitions/score_entry";
    }

    @PostMapping("/scores/save")
    public String saveScore(@ModelAttribute("score") RDCompetitionScore score) {
        scoreService.save(score);
        return "redirect:/admin/competitions/scores?roundId=" 
                + score.getRound().getRoundId();
    }


    // ------------------ RESULTS ------------------
    @GetMapping("/results")
    public String results(@RequestParam("competitionId") int competitionId, Model model) {
        model.addAttribute("competition", competitionService.findById(competitionId));
        model.addAttribute("results", resultService.findByCompetition(competitionId));
        return "admin/competitions/results";
    }
}
