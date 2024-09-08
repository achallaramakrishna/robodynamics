package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDQuest;
import com.robodynamics.service.RDQuestService;

@Controller
@RequestMapping("/quests")
public class RDQuestController {

    @Autowired
    private RDQuestService questService;

    @GetMapping
    public String listQuests(Model model) {
        List<RDQuest> quests = questService.findAll();
        model.addAttribute("quests", quests);
        return "quests/list";
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("quest", new RDQuest());
        return "quests/add";
    }

    @PostMapping("/save")
    public String saveQuest(@ModelAttribute("quest") RDQuest quest) {
        questService.saveOrUpdate(quest);
        return "redirect:/quests";
    }

    @GetMapping("/edit/{questId}")
    public String showEditForm(@PathVariable int questId, Model model) {
        RDQuest quest = questService.findById(questId);
        model.addAttribute("quest", quest);
        return "quests/edit";
    }

    @PostMapping("/update")
    public String updateQuest(@ModelAttribute("quest") RDQuest quest) {
        questService.saveOrUpdate(quest);
        return "redirect:/quests";
    }

    @GetMapping("/delete/{questId}")
    public String deleteQuest(@PathVariable int questId) {
        RDQuest quest = questService.findById(questId);
        questService.delete(quest);
        return "redirect:/quests";
    }
}
