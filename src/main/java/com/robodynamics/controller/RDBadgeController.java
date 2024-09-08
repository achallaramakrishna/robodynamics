package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDBadge;
import com.robodynamics.service.RDBadgeService;

@Controller
@RequestMapping("/badges")
public class RDBadgeController {

    @Autowired
    private RDBadgeService badgeService;

    @GetMapping
    public String listBadges(Model model) {
        List<RDBadge> badges = badgeService.findAll();
        model.addAttribute("badges", badges);
        return "badges/list";
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("badge", new RDBadge());
        return "badges/add";
    }

    @PostMapping("/save")
    public String saveBadge(@ModelAttribute("badge") RDBadge badge) {
        badgeService.saveOrUpdate(badge);
        return "redirect:/badges";
    }

    @GetMapping("/edit/{badgeId}")
    public String showEditForm(@PathVariable int badgeId, Model model) {
        RDBadge badge = badgeService.findById(badgeId);
        model.addAttribute("badge", badge);
        return "badges/edit";
    }

    @PostMapping("/update")
    public String updateBadge(@ModelAttribute("badge") RDBadge badge) {
        badgeService.saveOrUpdate(badge);
        return "redirect:/badges";
    }

    @GetMapping("/delete/{badgeId}")
    public String deleteBadge(@PathVariable int badgeId) {
        RDBadge badge = badgeService.findById(badgeId);
        badgeService.delete(badge);
        return "redirect:/badges";
    }
}
