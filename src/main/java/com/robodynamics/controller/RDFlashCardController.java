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
	    RDFlashCardSet flashcardSet = rdFlashCardSetService.getFlashCardSetsByCourseSessionDetail(courseSessionDetailId);
	    if (flashcardSet == null) {
	        model.addAttribute("error", "No flashcard set associated with this course session detail.");
	        return "flashcards/flashcard-viewer";
	    }

	    // Retrieve flashcards from the flashcard set
	    List<RDFlashCard> flashcards = rdFlashCardService.getFlashCardsBySetId(flashcardSet.getFlashcardSetId());
	    
	    if (flashcards.isEmpty()) {
	        model.addAttribute("error", "No flashcards available in this set.");
	        return "flashcards/flashcard-viewer";
	    }

	    model.addAttribute("currentFlashcard", flashcards.get(0));
	    model.addAttribute("currentFlashcardIndex", 0);
	    model.addAttribute("totalFlashcards", flashcards.size());
	    model.addAttribute("flashcardSetId", flashcardSet.getFlashcardSetId());
	    
	    return "flashcards/flashcard-viewer";
	}


	/*    *//**
			 * Start viewing flashcards in a specific flashcard set, starting from the first
			 * card.
			 *//*
				 * @GetMapping("/start/{flashcardSetId}") public String
				 * startFlashcardSession(@PathVariable("flashcardSetId") int flashcardSetId,
				 * Model model) { List<RDFlashCard> flashcards =
				 * rdFlashCardService.getFlashCardsBySetId(flashcardSetId); if
				 * (flashcards.isEmpty()) { model.addAttribute("error",
				 * "No flashcards available in this set."); return
				 * "flashcards/flashcard-viewer"; }
				 * 
				 * model.addAttribute("currentFlashcard", flashcards.get(0));
				 * model.addAttribute("currentFlashcardIndex", 0);
				 * model.addAttribute("totalFlashcards", flashcards.size());
				 * model.addAttribute("flashcardSetId", flashcardSetId); return
				 * "flashcards/flashcard-viewer"; }
				 */

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


	/**
	 * List all flashcard sets.
	 */
	@GetMapping("/list")
	public String listFlashcards(Model model) {
		List<RDFlashCardSet> flashcardSets = rdFlashCardSetService.getRDFlashCardSets();
		model.addAttribute("flashcardSets", flashcardSets);
		// Fetch all courses from the service layer
		List<RDCourse> courses = rdCourseService.getRDCourses();

		// Add the list of courses to the model for course information
		model.addAttribute("courses", courses);

		return "flashcards/listFlashCards";
	}

	/**
	 * Handle JSON upload for flashcards associated with a specific flashcard set.
	 */
	@PostMapping("/uploadJson")
	public String handleJsonUpload(@RequestParam("file") MultipartFile file,
			@RequestParam("flashcardSetId") int flashcardSetId, RedirectAttributes redirectAttributes) {
		if (file.isEmpty()) {
			redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
			return "redirect:/flashcards/list";
		}

		try (InputStream inputStream = file.getInputStream()) {
			ObjectMapper objectMapper = new ObjectMapper();
			List<RDFlashCard> flashcards = objectMapper.readValue(inputStream, new TypeReference<List<RDFlashCard>>() {
			});
			RDFlashCardSet flashcardSet = rdFlashCardSetService.getRDFlashCardSet(flashcardSetId);

			for (RDFlashCard card : flashcards) {
				card.setFlashcardSet(flashcardSet);
				rdFlashCardService.saveRDFlashCard(card);
			}

			redirectAttributes.addFlashAttribute("success", "Flashcards uploaded successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
		}

		return "redirect:/flashcards/list";
	}

	/**
	 * Get flashcards based on flashcardSetId for AJAX support.
	 */
	@GetMapping("/getFlashcardsBySet")
	@ResponseBody
	public Map<String, Object> getFlashcardsBySet(@RequestParam("flashcardSetId") int flashcardSetId) {
		List<RDFlashCard> flashcards = rdFlashCardService.getFlashCardsBySetId(flashcardSetId);
		Map<String, Object> response = new HashMap<>();
		response.put("flashcards", flashcards);
		return response;
	}

	// Additional AJAX Endpoints for Dynamic Dropdown Support (Course Sessions,
	// Session Details)
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
		List<RDCourseSessionDetail> sessionDetails = courseSessionDetailService
				.findSessionDetailsBySessionId(courseSessionId);
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
