package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDFlashCardSet;
import com.robodynamics.service.RDFlashCardSetService;

@Controller
@RequestMapping("/flashcard-sets")
public class RDFlashCardSetController {

    @Autowired
    private RDFlashCardSetService rdFlashCardSetService;

    // List flashcard sets by course session detail ID
    @GetMapping("/session/{courseSessionDetailId}")
    public String getFlashCardSetsBySessionDetail(@PathVariable("courseSessionDetailId") int courseSessionDetailId, Model model) {
        List<RDFlashCardSet> flashCardSets = rdFlashCardSetService.getFlashCardSetsBySessionDetail(courseSessionDetailId);
        model.addAttribute("flashCardSets", flashCardSets);
        model.addAttribute("courseSessionDetailId", courseSessionDetailId);
        return "flashcard-set-list";
    }

    // Display a form to add a new flashcard set
    @GetMapping("/add")
    public String showAddFlashCardSetForm(Model model) {
        model.addAttribute("flashCardSet", new RDFlashCardSet());
        return "flashcard-set-form";
    }

    // Save a flashcard set
    @PostMapping("/save")
    public String saveFlashCardSet(@ModelAttribute("flashCardSet") RDFlashCardSet flashCardSet) {
        rdFlashCardSetService.saveRDFlashCardSet(flashCardSet);
        return "redirect:/flashcard-sets/session/" + flashCardSet.getCourseSessionDetailId();
    }

    // Delete a flashcard set by ID
    @GetMapping("/delete/{id}")
    public String deleteFlashCardSet(@PathVariable("id") int flashcardSetId) {
        rdFlashCardSetService.deleteRDFlashCardSet(flashcardSetId);
        return "redirect:/flashcard-sets";
    }
}
