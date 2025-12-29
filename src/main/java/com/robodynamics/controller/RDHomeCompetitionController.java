package com.robodynamics.controller;

import com.robodynamics.model.RDUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;

@Controller
public class RDHomeCompetitionController {

    /**
     * Entry point from Home page CTA:
     * "Register for Competitions"
     */
    @GetMapping("/competitions/register")
    public String registerForCompetitions(HttpSession session) {

        RDUser parent = (RDUser) session.getAttribute("rdUser");

        // Not logged in → redirect to LOGIN
        if (parent == null) {
            session.setAttribute("redirectUrl", "/competitions/register");
            return "redirect:/login";
        }

        // Logged-in parent → go to competitions list
        return "redirect:/parent/competitions/list?parentUserId="
                + parent.getUserID();
    }
}
