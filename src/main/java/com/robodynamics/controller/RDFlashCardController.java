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
import com.robodynamics.model.RDFlashCard;
import com.robodynamics.model.RDFlashCardSet;
import com.robodynamics.service.*;
import com.robodynamics.wrapper.RDFlashCardJson;

@Controller
@RequestMapping("/flashcards")
public class RDFlashCardController {

    @Autowired
    private RDFlashCardService rdFlashCardService;

    @Autowired
    private RDFlashCardSetService rdFlashCardSetService;

    @Autowired
    private RDCourseService rdCourseService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @GetMapping("/start/{courseSessionDetailId}")
    public String startFlashcardSessionByCourseSessionDetailId(@PathVariable("courseSessionDetailId") int courseSessionDetailId, Model model) {
        // Retrieve the course session detail based on the ID
        RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
        
        if (courseSessionDetail == null || !"flashcard".equalsIgnoreCase(courseSessionDetail.getType())) {
            model.addAttribute("error", "No flashcard session available for this course session detail.");
            return "flashcards/flashcard-viewer";
        }

        // Retrieve the flashcard set associated with the course session detail
        List<RDFlashCardSet> flashcardSets = rdFlashCardSetService.getFlashCardSetsByCourseSessionDetail(courseSessionDetailId);
        if (flashcardSets == null || flashcardSets.isEmpty()) {
            model.addAttribute("error", "No flashcard sets associated with this course session detail.");
            return "flashcards/flashcard-viewer";
        }

        // Display the first flashcard from the first flashcard set by default
        List<RDFlashCard> flashcards = rdFlashCardService.getFlashCardsBySetId(flashcardSets.get(0).getFlashcardSetId());
        
        if (flashcards.isEmpty()) {
            model.addAttribute("error", "No flashcards available in this set.");
            return "flashcards/flashcard-viewer";
        }

        model.addAttribute("currentFlashcard", flashcards.get(0));
        model.addAttribute("currentFlashcardIndex", 0);
        model.addAttribute("totalFlashcards", flashcards.size());
        model.addAttribute("flashcardSets", flashcardSets); // Add flashcard sets to select from
        model.addAttribute("flashcardSetId", flashcardSets.get(0).getFlashcardSetId());

        return "flashcards/flashcard-viewer";
    }

    @GetMapping("/view")
    public String viewFlashcard(@RequestParam(value = "index", required = false, defaultValue = "0") int index, 
                                @RequestParam("flashcardSetId") int flashcardSetId, 
                                Model model) {
        List<RDFlashCard> flashcards = rdFlashCardService.getFlashCardsBySetId(flashcardSetId);
        int totalFlashcards = flashcards.size();
        
        if (index < 0 || index >= totalFlashcards) {
            model.addAttribute("error", "Invalid flashcard index.");
            model.addAttribute("currentFlashcard", null);
            model.addAttribute("totalFlashcards", totalFlashcards);
            return "flashcards/flashcard-viewer";
        }

        RDFlashCard currentFlashcard = flashcards.get(index);
        model.addAttribute("currentFlashcard", currentFlashcard);
        model.addAttribute("currentFlashcardIndex", index);
        model.addAttribute("totalFlashcards", totalFlashcards);
        model.addAttribute("flashcardSetId", flashcardSetId);
        return "flashcards/flashcard-viewer";
    }

    @GetMapping("/list")
    public String listFlashcards(Model model) {
        List<RDFlashCardSet> flashcardSets = rdFlashCardSetService.getRDFlashCardSets();
        model.addAttribute("flashcardSets", flashcardSets);
        
        // Fetch all courses from the service layer
        List<RDCourse> courses = rdCourseService.getRDCourses();
        model.addAttribute("courses", courses);

        return "flashcards/listFlashCards";
    }

    @PostMapping("/uploadJson")
    public String handleJsonUpload(@RequestParam("file") MultipartFile file,
                                   @RequestParam("flashcardSetId") int flashcardSetId, 
                                   RedirectAttributes redirectAttributes) {
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/flashcards/list";
        }

        try (InputStream inputStream = file.getInputStream()) {
            ObjectMapper objectMapper = new ObjectMapper();
            
            // Deserialize JSON into RDFlashCardJson objects
            List<RDFlashCardJson> flashcardJsonList = objectMapper.readValue(inputStream, new TypeReference<List<RDFlashCardJson>>() {});
            
            // Retrieve the flashcard set from the database
            RDFlashCardSet flashcardSet = rdFlashCardSetService.getRDFlashCardSet(flashcardSetId);

            // Convert each RDFlashCardJson to RDFlashCard and save it
            for (RDFlashCardJson flashcardJson : flashcardJsonList) {
                RDFlashCard flashcard = new RDFlashCard();
                flashcard.setQuestion(flashcardJson.getQuestion());
                flashcard.setAnswer(flashcardJson.getAnswer());
                flashcard.setHint(flashcardJson.getHint());
                flashcard.setImageUrl(flashcardJson.getImageUrl());
                flashcard.setExample(flashcardJson.getExample());
                flashcard.setInsight(flashcardJson.getInsight());
                
                // Convert the insight type string to enum, handle any potential errors
                try {
                    flashcard.setInsightType(RDFlashCard.InsightType.valueOf(flashcardJson.getInsightType().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    flashcard.setInsightType(null); // Set to null or handle as needed
                }

                flashcard.setFlashcardSet(flashcardSet); // Associate with the flashcard set

                // Save each flashcard
                rdFlashCardService.saveRDFlashCard(flashcard);
            }

            redirectAttributes.addFlashAttribute("success", "Flashcards uploaded successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
        }

        return "redirect:/flashcards/list";
    }

    @GetMapping("/getFlashcardsBySet")
    @ResponseBody
    public Map<String, Object> getFlashcardsBySet(@RequestParam("flashcardSetId") int flashcardSetId) {
        List<RDFlashCard> flashcards = rdFlashCardService.getFlashCardsBySetId(flashcardSetId);
        Map<String, Object> response = new HashMap<>();
        response.put("flashcards", flashcards);
        return response;
    }

    // Additional AJAX Endpoints for Dynamic Dropdown Support
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

    @GetMapping("/getFlashcardSetsBySessionDetail")
    @ResponseBody
    public Map<String, Object> getFlashcardSetsByCourseSessionDetail(@RequestParam("courseSessionDetailId") int courseSessionDetailId) {
        List<RDFlashCardSet> flashcardSets = rdFlashCardSetService.getFlashCardSetsByCourseSessionDetail(courseSessionDetailId);
        Map<String, Object> response = new HashMap<>();
        response.put("flashcardSets", flashcardSets);
        return response;
    }
}
