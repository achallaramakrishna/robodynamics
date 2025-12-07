package com.robodynamics.controller;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/parent/competitions")
public class RDParentCompetitionController {

    @Autowired
    private RDCompetitionService competitionService;

    @Autowired
    private RDCompetitionRegistrationService registrationService;

    @Autowired
    private RDUserService userService;

    // ---------------------------------------------------
    // LIST ALL COMPETITIONS + STATUS LOGIC
    // ---------------------------------------------------
    @GetMapping("/list")
    public String list(@RequestParam(value = "parentUserId", required = false) Integer parentUserId,
                       HttpSession session,
                       Model model) {

        // Auto-detect logged-in parent
        if (parentUserId == null) {
            RDUser parent = (RDUser) session.getAttribute("rdUser");
            if (parent == null) {
                model.addAttribute("error", "Please login first.");
                return "parent/competitions/list";
            }
            parentUserId = parent.getUserID();
        }

        List<RDCompetition> competitions = competitionService.findAll();
        List<RDUser> children = userService.getRDChilds(parentUserId);

        // Get all competitionIds registered by children
        List<Integer> registeredIds = children.stream()
                .flatMap(child ->
                        registrationService.findByStudent(child.getUserID()).stream()
                )
                .map(r -> r.getCompetition().getCompetitionId())
                .collect(Collectors.toList());

        // Convert to format: ",1,3,5,"
        String registeredIdsStr = registeredIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(",", ",", ","));

        model.addAttribute("competitions", competitions);
        model.addAttribute("children", children);
        model.addAttribute("registeredIdsStr", registeredIdsStr);
        model.addAttribute("registeredCompetitionIds", registeredIds);
        model.addAttribute("parentUserId", parentUserId);
        model.addAttribute("today", new Date());

        return "parent/competitions/list";
    }


    // ---------------------------------------------------
    // SHOW REGISTRATION PAGE
    // ---------------------------------------------------
    @GetMapping("/register")
    public String register(@RequestParam("competitionId") int competitionId,
                           @RequestParam(value = "parentUserId", required = false) Integer parentUserId,
                           HttpSession session,
                           Model model) {

        // Validate parent
        if (parentUserId == null) {
            RDUser parent = (RDUser) session.getAttribute("rdUser");
            if (parent == null) {
                model.addAttribute("errorMessage", "Please login first.");
                return "parent/competitions/list";
            }
            parentUserId = parent.getUserID();
        }

        RDCompetition competition = competitionService.findById(competitionId);

        // Registration window check
        Date today = new Date();
        if (today.before(competition.getRegistrationStartDate())) {
            model.addAttribute("errorMessage", "Registration has not started yet.");
            return "parent/competitions/list";
        }
        if (today.after(competition.getRegistrationEndDate())) {
            model.addAttribute("errorMessage", "Registration is closed.");
            return "parent/competitions/list";
        }

        List<RDUser> children = userService.getRDChilds(parentUserId);

        RDCompetitionRegistration reg = new RDCompetitionRegistration();
        reg.setCompetition(competition);
        reg.setPaymentAmount(competition.getFee());
        reg.setPaymentStatus("PENDING");

        model.addAttribute("competition", competition);
        model.addAttribute("children", children);
        model.addAttribute("parentUserId", parentUserId);
        model.addAttribute("registration", reg);

        return "parent/competitions/register";
    }


    // ---------------------------------------------------
    // SUBMIT REGISTRATION
    // ---------------------------------------------------
    @PostMapping("/submit")
    public String submit(@ModelAttribute("registration") RDCompetitionRegistration registration,
                         @RequestParam(value = "parentUserId", required = false) Integer parentUserId,
                         HttpSession session,
                         Model model) {

        RDUser parent;

        if (parentUserId == null) {
            parent = (RDUser) session.getAttribute("rdUser");
            if (parent == null) return "redirect:/login";
            parentUserId = parent.getUserID();
        } else {
            parent = userService.getRDUser(parentUserId);
        }

        registration.setParent(parent);

        // Prevent duplicate registration (same child + same competition)
        List<RDCompetitionRegistration> existing = registrationService
                .findByStudent(registration.getStudent().getUserID());

        boolean duplicate = existing.stream()
                .anyMatch(r ->
                        r.getCompetition().getCompetitionId() ==
                                registration.getCompetition().getCompetitionId()
                );

        if (duplicate) {
            model.addAttribute("errorMessage",
                    "This child is already registered for this competition.");
            return "redirect:/parent/competitions/list?parentUserId=" + parentUserId;
        }

        // Set timestamps + initial state
        registration.setRegistrationDate(new Date());
        registration.setPaymentStatus("PENDING");
        registration.setPaymentDate(null);

        registrationService.register(registration);

        return "redirect:/parent/competitions/my?parentUserId=" + parentUserId;
    }


    // ---------------------------------------------------
    // VIEW REGISTRATIONS LIST
    // ---------------------------------------------------
    @GetMapping("/my")
    public String myCompetitions(@RequestParam("parentUserId") int parentUserId,
                                 Model model) {

        List<RDUser> children = userService.getRDChilds(parentUserId);

        List<RDCompetitionRegistration> regs = children.stream()
                .flatMap(child -> registrationService.findByStudent(child.getUserID()).stream())
                .sorted(Comparator.comparing(RDCompetitionRegistration::getRegistrationDate)
                        .reversed())
                .collect(Collectors.toList());

        model.addAttribute("registrations", regs);
        model.addAttribute("parentUserId", parentUserId);

        return "parent/competitions/my_competitions";
    }
}
