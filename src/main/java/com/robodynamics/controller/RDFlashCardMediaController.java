package com.robodynamics.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

@Controller
@RequestMapping("/flashcards/media")
public class RDFlashCardMediaController {

    /* ================= SERVICES ================= */

    @Autowired private RDCourseService courseService;
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;
    @Autowired private RDFlashCardService flashCardService;
    @Autowired private RDFlashCardSetService flashCardSetService;

    /* ================= FILE STORAGE ================= */

    @Value("${rd.session.materials.base:/opt/robodynamics/session_materials}")
    private String materialsBase;

    private Path flashcardFolder(int courseId) {
        return Paths.get(materialsBase, String.valueOf(courseId), "flashcards");
    }

    private String publicUrl(int courseId, String fileName) {
        return "/session_materials/" + courseId + "/flashcards/" + fileName;
    }

    /* =================================================
     * PAGE
     * ================================================= */

    @GetMapping("/manage")
    public String showFlashcardMediaPage(Model model) {
        model.addAttribute("courses", courseService.getRDCourses());
        return "flashcards/flashcardMediaManager"; // JSP name
    }

    /* =================================================
     * CASCADING FILTER APIs
     * ================================================= */

    /** Sessions by course */
    @GetMapping("/sessions")
    @ResponseBody
    public List<Map<String, Object>> getSessions(@RequestParam int courseId) {
        return courseSessionService.getCourseSessionsByCourseId(courseId)
                .stream()
                .map(s -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("sessionId", s.getCourseSessionId());
                    m.put("sessionTitle", s.getSessionTitle());
                    return m;
                }).toList();
    }

    /** Session details by session */
    @GetMapping("/session-details")
    @ResponseBody
    public List<Map<String, Object>> getSessionDetails(@RequestParam int sessionId) {
        return courseSessionDetailService.findSessionDetailsBySessionId(sessionId)
                .stream()
                .map(d -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("sessionDetailId", d.getCourseSessionDetailId());
                    m.put("topic", d.getTopic());
                    return m;
                }).toList();
    }

    /** Flashcard sets by session detail */
    @GetMapping("/flashcard-sets")
    @ResponseBody
    public List<Map<String, Object>> getFlashcardSets(
            @RequestParam("courseSessionDetailId") int sessionDetailId) {

        return flashCardSetService.getFlashCardSetsByCourseSessionDetail(sessionDetailId)
                .stream()
                .map(set -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("flashcardSetId", set.getFlashcardSetId());
                    m.put("setName", set.getSetName());
                    return m;
                }).toList();
    }

    /* =================================================
     * FLASHCARDS
     * ================================================= */

    /** List flashcards by set */
    @GetMapping("/list")
    @ResponseBody
    public List<Map<String, Object>> listFlashcards(
            @RequestParam int flashcardSetId) {

        return flashCardService.getFlashCardsBySetId(flashcardSetId)
                .stream()
                .map(fc -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("flashcardId", fc.getFlashcardId());
                    m.put("question", fc.getQuestion());
                    m.put("hasQImage", fc.getQuestionImageUrl() != null);
                    m.put("hasAImage", fc.getAnswerImageUrl() != null);
                    return m;
                }).toList();
    }

    /** Fetch single flashcard for upload modal */
    @GetMapping("/flashcard")
    @ResponseBody
    public Map<String, Object> getFlashcard(@RequestParam int flashcardId) {

        RDFlashCard fc = flashCardService.getRDFlashCard(flashcardId);

        Map<String, Object> m = new HashMap<>();
        m.put("flashcardId", fc.getFlashcardId());
        m.put("question", fc.getQuestion());
        m.put("answer", fc.getAnswer());
        m.put("questionImageUrl", fc.getQuestionImageUrl());
        m.put("answerImageUrl", fc.getAnswerImageUrl());
        return m;
    }

    /* =================================================
     * IMAGE UPLOAD
     * ================================================= */

    @PostMapping(
    	    value = "/upload",
    	    consumes = "multipart/form-data",
    	    produces = "application/json"
    	)
    	@ResponseBody
    	public Map<String, Object> uploadImages(
    	        @RequestParam int flashcardId,
    	        @RequestParam(required = false) MultipartFile qImage,
    	        @RequestParam(required = false) MultipartFile aImage,
    	        @RequestParam(defaultValue = "0") int qRemove,
    	        @RequestParam(defaultValue = "0") int aRemove) {
    	  System.out.println("=== FLASHCARD UPLOAD HIT ===");
    	    System.out.println("flashcardId=" + flashcardId);
    	    System.out.println("qImage=" + (qImage != null ? qImage.getOriginalFilename() : "null"));
    	    System.out.println("qImageSize=" + (qImage != null ? qImage.getSize() : -1));
    	    System.out.println("aImage=" + (aImage != null ? aImage.getOriginalFilename() : "null"));
    	    System.out.println("aImageSize=" + (aImage != null ? aImage.getSize() : -1));


    	    try {
    	        RDFlashCard fc = flashCardService.getRDFlashCard(flashcardId);
    	        if (fc == null) {
    	            return Map.of("ok", false, "message", "Flashcard not found");
    	        }

    	        RDFlashCardSet set = fc.getFlashcardSet();
    	        int courseId = set.getCourseSessionDetail().getCourse().getCourseId();

    	        Path folder = flashcardFolder(courseId);
    	        Files.createDirectories(folder);

    	        if (qRemove == 1) fc.setQuestionImageUrl(null);
    	        if (aRemove == 1) fc.setAnswerImageUrl(null);

    	        if (qImage != null && !qImage.isEmpty()) {
    	            String name = "fc_" + flashcardId + "_q_" +
    	                    StringUtils.cleanPath(qImage.getOriginalFilename());
    	            qImage.transferTo(folder.resolve(name));
    	            fc.setQuestionImageUrl(publicUrl(courseId, name));
    	        }

    	        if (aImage != null && !aImage.isEmpty()) {
    	            String name = "fc_" + flashcardId + "_a_" +
    	                    StringUtils.cleanPath(aImage.getOriginalFilename());
    	            aImage.transferTo(folder.resolve(name));
    	            fc.setAnswerImageUrl(publicUrl(courseId, name));
    	        }

    	        flashCardService.saveRDFlashCard(fc);
    	        return Map.of("ok", true);

    	    } catch (Exception e) {
    	        e.printStackTrace();
    	        return Map.of("ok", false, "message", e.getMessage());
    	    }
    	}

}
