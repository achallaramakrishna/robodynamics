package com.robodynamics.controller;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/student/competitions")
public class RDStudentCompetitionController {

    @Autowired
    private RDCompetitionRegistrationService registrationService;

    @Autowired
    private RDCompetitionService competitionService;

    @Autowired
    private RDCompetitionRoundService roundService;

    @Autowired
    private RDCompetitionResultService resultService;

    // ------------------ STUDENT DASHBOARD ------------------
    @GetMapping("/my")
    public String myCompetitions(@RequestParam("studentUserId") int studentUserId, Model model) {
        model.addAttribute("registrations", registrationService.findByStudent(studentUserId));
        return "student/competitions/my_competitions";
    }

    // ------------------ JOIN ONLINE ROUND ------------------
    @GetMapping("/join")
    public String joinRound(@RequestParam("roundId") int roundId, Model model) {
        RDCompetitionRound round = roundService.findById(roundId);
        model.addAttribute("round", round);
        return "student/competitions/join_round";
    }

    // ------------------ VIEW RESULTS ------------------
    @GetMapping("/results")
    public String results(@RequestParam("studentUserId") int studentUserId, Model model) {
        model.addAttribute("results", resultService.findByStudent(0, studentUserId)); 
        return "student/competitions/results";
    }

    // ------------------ CERTIFICATE ------------------
    @GetMapping("/certificate")
    public String certificate(@RequestParam("resultId") int resultId, Model model) {
        RDCompetitionResult result = resultService.findByStudent(0, resultId);
        model.addAttribute("result", result);
        return "student/competitions/certificate";
    }
}
