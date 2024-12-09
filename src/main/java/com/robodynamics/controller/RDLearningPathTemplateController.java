package com.robodynamics.controller;

import com.robodynamics.model.RDLearningPathTemplate;
import com.robodynamics.model.RDExam;
import com.robodynamics.service.RDLearningPathTemplateService;
import com.robodynamics.service.RDExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/learningpathtemplates")
public class RDLearningPathTemplateController {

    @Autowired
    private RDLearningPathTemplateService templateService;

    @Autowired
    private RDExamService examService;

    /**
     * Display the list of learning path templates with optional filtering by exam.
     */
    @GetMapping("/list")
    public String listTemplates(@RequestParam(value = "examId", required = false) Integer examId, Model model) {
        List<RDLearningPathTemplate> templates;
        if (examId != null) {
            templates = templateService.getTemplatesByExamId(examId);
        } else {
            templates = templateService.getAllTemplates();
        }
        List<RDExam> exams = examService.getAllExams();

        model.addAttribute("templates", templates);
        model.addAttribute("exams", exams);
        return "learningpathtemplates/templateList";
    }

    @PostMapping("/save")
    public String saveTemplate(
            @ModelAttribute("template") RDLearningPathTemplate template,
            @RequestParam("image") MultipartFile imageFile,
            RedirectAttributes redirectAttributes,
            HttpServletRequest request) {
        try {
            // Handle image upload
            if (imageFile != null && !imageFile.isEmpty()) {
                // Dynamically resolve the path to the webapps/resources/assets/images directory
                String uploadDir = request.getServletContext().getRealPath("/resources/assets/images/");
                File uploadDirFile = new File(uploadDir);
                if (!uploadDirFile.exists()) {
                    uploadDirFile.mkdirs(); // Create the directory if it doesn't exist
                }

                // Save the image file
                String fileName = imageFile.getOriginalFilename();
                File destination = new File(uploadDir + fileName);
                imageFile.transferTo(destination);

                // Store relative path in the database
                template.setImageUrl("assets/images/" + fileName);
            }

            // Save the template in the database
            templateService.saveTemplate(template);

            redirectAttributes.addFlashAttribute("message", "Template saved successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Failed to upload the image.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "An error occurred while saving the template.");
        }
        return "redirect:/learningpathtemplates/list";
    }

    /**
     * Delete a learning path template.
     */
    @GetMapping("/delete/{id}")
    public String deleteTemplate(@PathVariable("id") int id, RedirectAttributes redirectAttributes) {
        try {
            templateService.deleteTemplate(id);
            redirectAttributes.addFlashAttribute("message", "Template deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting template: " + e.getMessage());
        }
        return "redirect:/learningPathTemplates";
    }

    /**
     * Edit a learning path template.
     */
    @GetMapping("/edit/{id}")
    public String editTemplate(@PathVariable("id") int id, Model model) {
        RDLearningPathTemplate template = templateService.getTemplateById(id);
        List<RDExam> exams = examService.getAllExams();

        model.addAttribute("template", template);
        model.addAttribute("exams", exams);
        return "templateForm"; // Separate JSP for editing
    }

}
