package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDFlashCardAttempt;
import com.robodynamics.service.RDFlashCardAttemptService;

@Controller
@RequestMapping("/flashcard-attempts")
public class RDFlashCardAttemptController {

    @Autowired
    private RDFlashCardAttemptService rdFlashCardAttemptService;

    // List attempts for a specific flashcard
    @GetMapping("/flashcard/{flashCardId}")
    public String getAttemptsByFlashCard(@PathVariable("flashCardId") int flashCardId, Model model) {
        List<RDFlashCardAttempt> attempts = rdFlashCardAttemptService.getAttemptsByFlashCard(flashCardId);
        model.addAttribute("attempts", attempts);
        return "flashcard-attempt-list";
    }

    // List attempts by a specific user
    @GetMapping("/user/{userId}")
    public String getAttemptsByUser(@PathVariable("userId") int userId, Model model) {
        List<RDFlashCardAttempt> attempts = rdFlashCardAttemptService.getAttemptsByUser(userId);
        model.addAttribute("attempts", attempts);
        return "flashcard-attempt-list";
    }

    // Add flashcard attempt form
    @GetMapping("/add")
    public String showAddFlashCardAttemptForm(Model model) {
        model.addAttribute("attempt", new RDFlashCardAttempt());
        return "flashcard-attempt-form";
    }

    // Save flashcard attempt
    @PostMapping("/save")
    public String saveFlashCardAttempt(@ModelAttribute("attempt") RDFlashCardAttempt attempt) {
        rdFlashCardAttemptService.saveRDFlashCardAttempt(attempt);
        return "redirect:/flashcard-attempts";
    }

    // Delete an attempt
    @GetMapping("/delete/{id}")
    public String deleteFlashCardAttempt(@PathVariable("id") int attemptId) {
        rdFlashCardAttemptService.deleteRDFlashCardAttempt(attemptId);
        return "redirect:/flashcard-attempts";
    }
}
