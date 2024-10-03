package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.service.RDQuizQuestionService;

@Controller
@RequestMapping("/quizquestions")
public class RDQuizQuestionController {

    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("quizQuestion", new RDQuizQuestion());
        return "quizquestions/add";
    }

    @PostMapping("/save")
    public String saveQuizQuestion(@ModelAttribute("quizQuestion") RDQuizQuestion quizQuestion) {
        quizQuestionService.saveOrUpdate(quizQuestion);
        return "redirect:/quizquestions";
    }

    @GetMapping("/edit/{questionId}")
    public String showEditForm(@PathVariable int questionId, Model model) {
        RDQuizQuestion quizQuestion = quizQuestionService.findById(questionId);
        model.addAttribute("quizQuestion", quizQuestion);
        return "quizquestions/edit";
    }

    @PostMapping("/update")
    public String updateQuizQuestion(@ModelAttribute("quizQuestion") RDQuizQuestion quizQuestion) {
        quizQuestionService.saveOrUpdate(quizQuestion);
        return "redirect:/quizquestions";
    }

    @GetMapping("/delete/{questionId}")
    public String deleteQuizQuestion(@PathVariable int questionId) {
        RDQuizQuestion quizQuestion = quizQuestionService.findById(questionId);
        quizQuestionService.delete(quizQuestion);
        return "redirect:/quizquestions";
    }
}
