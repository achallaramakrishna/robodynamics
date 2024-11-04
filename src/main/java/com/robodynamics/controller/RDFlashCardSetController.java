package com.robodynamics.controller;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.fasterxml.jackson.core.type.TypeReference;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDFlashCardSet;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDFlashCardSetService;

@Controller
@RequestMapping("/flashcardsets")
public class RDFlashCardSetController {

    @Autowired
    private RDFlashCardSetService rdFlashCardSetService;
    
    @Autowired
    private RDCourseService rdCourseService;

    @Autowired
    private RDCourseSessionService courseSessionService;
    
    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    
    
    /**
     * List all flashcard sets.
     */
    @GetMapping("/flashcard-set-list")
    public String listFlashcardSets(Model model) {
        // Fetch all flashcard sets from the service layer
        List<RDFlashCardSet> flashCardSets = rdFlashCardSetService.getRDFlashCardSets();
        
        // Fetch all courses from the service layer
        List<RDCourse> courses = rdCourseService.getRDCourses();
        
     // Add the list of courses to the model for course information
        model.addAttribute("courses", courses);

        // Add the list of flashcard sets to the model so they can be accessed in the view
        model.addAttribute("flashcardSets", flashCardSets);

        // Return the view name for listing flashcard sets
        return "flashcardsets/flashcard-set-list";
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
        return "flashcardsets/flashcard-set-list";
    }

    // Delete a flashcard set by ID
    @GetMapping("/delete/{id}")
    public String deleteFlashCardSet(@PathVariable("id") int flashcardSetId) {
        rdFlashCardSetService.deleteRDFlashCardSet(flashcardSetId);
        return "flashcardsets/flashcard-set-list";
    }
    // Handle JSON upload for flashcard sets
    @PostMapping("/uploadJson")
    public String handleJsonUpload(@RequestParam("file") MultipartFile file,
                                   @RequestParam("courseSessionDetailId") int courseSessionDetailId,
                                   RedirectAttributes redirectAttributes) {
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/flashcardsets/uploadJson";
        }
        System.out.println("hello 11...");
        
        RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
        try (InputStream inputStream = file.getInputStream()) {
            ObjectMapper objectMapper = new ObjectMapper();
            List<RDFlashCardSet> flashCardSets = objectMapper.readValue(inputStream, new TypeReference<List<RDFlashCardSet>>() {});
            System.out.println("hello 12..." + flashCardSets);
            for (RDFlashCardSet set : flashCardSets) {
                set.setCourseSessionDetail(courseSessionDetail);
                rdFlashCardSetService.saveRDFlashCardSet(set);
            }
            redirectAttributes.addFlashAttribute("success", "Flashcard sets uploaded successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
        }
        // Redirect back to the flashcard-set-list page
        return "redirect:/flashcardsets/flashcard-set-list";
    }

    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", courseSessions);
        return response;
    }
    

    @GetMapping("/getCourseSessionDetails")
    @ResponseBody
    public Map<String, Object> getCourseSessionDetails(@RequestParam("courseSessionId") int courseSessionId) {
        List<RDCourseSessionDetail> sessionDetails = courseSessionDetailService.findSessionDetailsBySessionId(courseSessionId);
        Map<String, Object> response = new HashMap<>();
        response.put("sessionDetails", sessionDetails);
        return response;
    }
    

    /**
     * Get flashcard sets based on courseSessionDetailId
     */
    @GetMapping("/getFlashcardSetsBySessionDetail")
    @ResponseBody
    public Map<String, Object> getFlashcardSetsByCourseSessionDetail(@RequestParam("courseSessionDetailId") int courseSessionDetailId) {
        RDFlashCardSet flashcardSet = rdFlashCardSetService.getFlashCardSetsByCourseSessionDetail(courseSessionDetailId);
        Map<String, Object> response = new HashMap<>();
        response.put("flashcardSet", flashcardSet);
        return response;
    }

}
