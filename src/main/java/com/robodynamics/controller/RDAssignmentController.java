package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDAssignment;
import com.robodynamics.service.RDAssignmentService;

@Controller
@RequestMapping("/assignment")
public class RDAssignmentController {

    @Autowired
    private RDAssignmentService assignmentService;

    // List all assignments
    @GetMapping("/list")
    public String listAssignments(Model model) {
        List<RDAssignment> assignments = assignmentService.getAllAssignments();
        model.addAttribute("assignments", assignments);
        return "assignment/list";
    }
    
    // List all assignments
    @GetMapping("/listcoursessiondetail/{id}")
    public String listAssignmentsForCourseSessionDetailId(@PathVariable("id") int id,Model model) {
        List<RDAssignment> assignments = assignmentService.getAssignmentsByCourseSessionDetailId(id);
        model.addAttribute("assignments", assignments);
        return "assignment/list";
    }

    // View a specific assignment by ID
    @GetMapping("/view/{id}")
    public String viewAssignment(@PathVariable("id") int id, Model model) {
        RDAssignment assignment = assignmentService.getAssignmentById(id);
        model.addAttribute("assignment", assignment);
        return "assignment/view";
    }

    // Show form to add a new assignment
    @GetMapping("/add")
    public String addAssignmentForm(Model model) {
        model.addAttribute("assignment", new RDAssignment());
        return "assignment/add";
    }

    // Save a new assignment
    @PostMapping("/add")
    public String addAssignment(@ModelAttribute("assignment") RDAssignment assignment) {
        assignmentService.saveAssignment(assignment);
        return "redirect:/assignment/list";
    }

    // Update an existing assignment
    @GetMapping("/edit/{id}")
    public String editAssignmentForm(@PathVariable("id") int id, Model model) {
        RDAssignment assignment = assignmentService.getAssignmentById(id);
        model.addAttribute("assignment", assignment);
        return "assignment/edit";
    }

    @PostMapping("/edit/{id}")
    public String updateAssignment(@PathVariable("id") int id, @ModelAttribute("assignment") RDAssignment assignment) {
        assignment.setAssignmentId(id);  // Make sure the assignment ID is set
        assignmentService.updateAssignment(assignment);
        return "redirect:/assignment/list";
    }

    // Delete an assignment by ID
    @GetMapping("/delete/{id}")
    public String deleteAssignment(@PathVariable("id") int id) {
        assignmentService.deleteAssignment(id);
        return "redirect:/assignment/list";
    }
}
