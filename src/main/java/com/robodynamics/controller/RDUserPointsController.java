package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDUserPoints;
import com.robodynamics.service.RDUserPointsService;

@Controller
@RequestMapping("/userpoints")
public class RDUserPointsController {

    @Autowired
    private RDUserPointsService userPointsService;

    @GetMapping
    public String listUserPoints(Model model) {
        List<RDUserPoints> userPoints = userPointsService.findAll();
        model.addAttribute("userPoints", userPoints);
        return "userpoints/list";  // Thymeleaf or JSP view
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("userPoints", new RDUserPoints());
        return "userpoints/add";
    }

    @PostMapping("/save")
    public String saveUserPoints(@ModelAttribute("userPoints") RDUserPoints userPoints) {
        userPointsService.saveOrUpdate(userPoints);
        return "redirect:/userpoints";  // Redirect to user points list
    }

    @GetMapping("/edit/{userId}")
    public String showEditForm(@PathVariable int userId, Model model) {
        RDUserPoints userPoints = userPointsService.findByUserId(userId);
        model.addAttribute("userPoints", userPoints);
        return "userpoints/edit";
    }

    @PostMapping("/update")
    public String updateUserPoints(@ModelAttribute("userPoints") RDUserPoints userPoints) {
        userPointsService.saveOrUpdate(userPoints);
        return "redirect:/userpoints";
    }

    @GetMapping("/delete/{userId}")
    public String deleteUserPoints(@PathVariable int userId) {
        RDUserPoints userPoints = userPointsService.findByUserId(userId);
        userPointsService.delete(userPoints);
        return "redirect:/userpoints";
    }
}
