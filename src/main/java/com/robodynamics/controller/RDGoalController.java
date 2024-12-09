package com.robodynamics.controller;

import com.robodynamics.model.RDGoal;
import com.robodynamics.model.RDLearningPath;
import com.robodynamics.service.RDGoalService;
import com.robodynamics.service.RDLearningPathService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/goals")
public class RDGoalController {

    @Autowired
    private RDGoalService goalService;

    @Autowired
    private RDLearningPathService learningPathService;

    // Display all goals for a specific learning path
    @GetMapping("/list/{learningPathId}")
    public String listGoals(@PathVariable("learningPathId") int learningPathId, Model model) {
        List<RDGoal> goals = goalService.getGoalsByLearningPathId(learningPathId);
        RDLearningPath learningPath = learningPathService.getLearningPathById(learningPathId);
        model.addAttribute("learningPath", learningPath);
        model.addAttribute("goals", goals);
        return "goals-list";
    }

    // Show the form to add a new goal
    @GetMapping("/add/{learningPathId}")
    public String showAddGoalForm(@PathVariable("learningPathId") int learningPathId, Model model) {
        RDGoal goal = new RDGoal();
        goal.setLearningPathId(learningPathId); // Associate with the learning path
        model.addAttribute("goal", goal);
        return "goal-form";
    }

    // Save a new or updated goal
    @PostMapping("/save")
    public String saveGoal(@ModelAttribute("goal") RDGoal goal) {
        if (goal.getId() != 0) {
            goalService.updateGoal(goal); // Update if ID exists
        } else {
            goalService.saveGoal(goal); // Save a new goal
        }
        return "redirect:/goals/list/" + goal.getLearningPathId();
    }

    // Show the form to edit an existing goal
    @GetMapping("/edit/{id}")
    public String showEditGoalForm(@PathVariable("id") int id, Model model) {
        RDGoal goal = goalService.getGoalById(id);
        model.addAttribute("goal", goal);
        return "goal-form";
    }

    // Delete a goal
    @GetMapping("/delete/{id}")
    public String deleteGoal(@PathVariable("id") int id) {
        RDGoal goal = goalService.getGoalById(id);
        int learningPathId = goal.getLearningPathId();
        goalService.deleteGoalById(id);
        return "redirect:/goals/list/" + learningPathId;
    }
}
