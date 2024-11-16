package com.robodynamics.controller;


import com.robodynamics.model.RDProject;
import com.robodynamics.service.RDProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/projects")
public class RDProjectController {

    @Autowired
    private RDProjectService projectService;

    @GetMapping("/projects")
    public String listProjects(Model model) {
        // Retrieve projects by grade range and category
        model.addAttribute("grades", projectService.getProjectsGroupedByGradeRange());
        model.addAttribute("categories", projectService.getProjectsGroupedByCategory());

        // Return the JSP page for displaying projects
        return "projects/projects";
    }

    
    @GetMapping("/list")
    public String list(Model model) {
        // Retrieve projects by grade and category
        
        model.addAttribute("projects", projectService.getRDProjects());
        
        // Return the JSP page for displaying projects
        return "projects/listProjects";
    }
    
    /**
     * Handle JSON file upload to add multiple projects.
     */
    @PostMapping("/uploadJson")
    public String handleJsonUpload(@RequestParam("file") MultipartFile file,
                                   RedirectAttributes redirectAttributes) {
        // Validate if the file is empty
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/projects/list";
        }
        try {
            // Process the JSON file for projects
        	projectService.processJson(file);
            redirectAttributes.addFlashAttribute("success", "JSON file uploaded and projects added successfully.");
        } catch (Exception e) {
            // Handle any error during the processing
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
        }
        // Redirect back to the projects list page
        return "redirect:/projects/list";
    }

   
    @GetMapping("/showForm")
    public ModelAndView showFormForAdd(Model model) {
        RDProject project = new RDProject();
        model.addAttribute("project", project);
        return new ModelAndView("projects/project-form");
    }

    @PostMapping("/saveProject")
    public String saveProject(@ModelAttribute("project") RDProject project) {
        projectService.saveRDProject(project);
        return "redirect:/projects/list";
    }

    @GetMapping("/updateForm")
    public String showFormForUpdate(@RequestParam("projectId") int projectId, Model model) {
        RDProject project = projectService.getRDProject(projectId);
        model.addAttribute("project", project);
        return "projects/project-form";
    }

    @GetMapping("/delete")
    public String deleteProject(@RequestParam("projectId") int projectId) {
        projectService.deleteRDProject(projectId);
        return "redirect:/projects/list";
    }

    @GetMapping("/details")
    public String projectDetails(@RequestParam("projectId") int projectId, Model model) {
        RDProject project = projectService.getRDProject(projectId);
        model.addAttribute("project", project);
        return "projects/project-details";
    }
}

