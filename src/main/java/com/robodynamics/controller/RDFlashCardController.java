package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDFlashCard;
import com.robodynamics.service.RDFlashCardService;

@Controller
@RequestMapping("/flashcards")
public class RDFlashCardController {

    @Autowired
    private RDFlashCardService rdFlashCardService;

    // List flashcards by flashcard set ID
    @GetMapping("/set/{flashcardSetId}")
    public String getFlashCardsBySetId(@PathVariable("flashcardSetId") int flashcardSetId, Model model) {
        List<RDFlashCard> flashCards = rdFlashCardService.getFlashCardsBySetId(flashcardSetId);
        model.addAttribute("flashCards", flashCards);
        model.addAttribute("flashcardSetId", flashcardSetId);
        return "flashcard-list";
    }

    // Display a form to add a new flashcard
    @GetMapping("/add")
    public String showAddFlashCardForm(Model model) {
        model.addAttribute("flashCard", new RDFlashCard());
        return "flashcard-form";
    }

    // Save a flashcard
    @PostMapping("/save")
    public String saveFlashCard(@ModelAttribute("flashCard") RDFlashCard flashCard) {
        rdFlashCardService.saveRDFlashCard(flashCard);
        return "redirect:/flashcards/set/" + flashCard.getFlashcardSet().getFlashcardSetId();
    }

    // Delete a flashcard by ID
    @GetMapping("/delete/{id}")
    public String deleteFlashCard(@PathVariable("id") int flashCardId) {
        rdFlashCardService.deleteRDFlashCard(flashCardId);
        return "redirect:/flashcards";
    }
}
