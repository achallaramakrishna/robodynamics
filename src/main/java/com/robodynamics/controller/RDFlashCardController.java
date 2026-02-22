package com.robodynamics.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dto.RDFlashcardSetDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
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
	private RDCourseCategoryService courseCategoryService;

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

    private static final class FlashcardWorkspaceSelection {
        private Integer selectedDetailId;
        private Integer selectedSetId;
        private String selectedTopicTitle;
        private int selectedTopicSetCount;
        private int selectedTopicCardCount;
        private boolean selectedTopicJsonBacked;
    }
    
    @GetMapping("/manageMedia")   // GET /robodynamics/quizquestions/manageMedia
    public String manageMedia(Model model) {
        // TODO: replace with real service call
        List<RDCourse> courses = rdCourseService.getRDCourses();
        model.addAttribute("courses", courses != null ? courses : java.util.Collections.emptyList());

        model.addAttribute("mediaList", java.util.Collections.emptyList());
        return "flashcards/flashcard-media-manager"; // resolves to /WEB-INF/views/quizMediaManager.jsp
    } 
    
    @GetMapping(
    	    value = "/getCoursesByCategory",
    	    produces = MediaType.APPLICATION_JSON_VALUE
    	)
    	@ResponseBody
    	public Map<String, Object> getCoursesByCategory(
    	        @RequestParam("categoryId") int categoryId) {

    	    List<RDCourse> courses = rdCourseService.getCoursesByCategoryId(categoryId);

    	    List<Map<String, Object>> dto = courses.stream().map(c -> {
    	        Map<String, Object> m = new HashMap<>();
    	        m.put("courseId", c.getCourseId());
    	        m.put("courseName", c.getCourseName());
    	        return m;
    	    }).toList();

    	    Map<String, Object> response = new HashMap<>();
    	    response.put("courses", dto);
    	    return response;
    	}


    @GetMapping("/start/{courseSessionDetailId}")
    public String startFlashcardSessionByCourseSessionDetailId(
            @PathVariable("courseSessionDetailId") int courseSessionDetailId,
            @RequestParam(value = "sessionId", required = false) Integer sessionId,
            @RequestParam(value = "enrollmentId", required = false) Integer enrollmentId,
            @RequestParam(value = "courseId", required = false) Integer courseId,
            Model model) {
        RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);

        if (courseSessionDetail != null && courseSessionDetail.getCourseSession() != null) {
            if (sessionId == null) {
                sessionId = courseSessionDetail.getCourseSession().getCourseSessionId();
            }
            if (courseId == null
                    && courseSessionDetail.getCourseSession().getCourse() != null) {
                courseId = courseSessionDetail.getCourseSession().getCourse().getCourseId();
            }
        }

        FlashcardWorkspaceSelection workspace =
                populateWorkspaceModel(model, sessionId, courseSessionDetailId, null);

        model.addAttribute("sessionId", sessionId);
        model.addAttribute("enrollmentId", enrollmentId);
        model.addAttribute("courseId", courseId);
        model.addAttribute("courseSessionDetailId", workspace.selectedDetailId);

        if (courseSessionDetail == null || !"flashcard".equalsIgnoreCase(courseSessionDetail.getType())) {
            model.addAttribute("error", "No flashcard topic available for the selected session detail.");
            if (workspace.selectedSetId != null) {
                return buildViewRedirect(
                        workspace.selectedSetId,
                        0,
                        sessionId,
                        enrollmentId,
                        courseId,
                        workspace.selectedDetailId);
            }
            return "flashcards/flashcard-viewer";
        }

        if (workspace.selectedSetId == null) {
            if (workspace.selectedTopicJsonBacked && workspace.selectedDetailId != null) {
                model.addAttribute("info", "This topic is available as guided content. Open topic content to continue.");
                model.addAttribute("topicContentDetailId", workspace.selectedDetailId);
            } else {
                model.addAttribute("error", "No flashcard sets associated with this topic.");
            }
            model.addAttribute("currentFlashcard", null);
            model.addAttribute("currentFlashcardIndex", 0);
            model.addAttribute("totalFlashcards", 0);
            return "flashcards/flashcard-viewer";
        }

        return buildViewRedirect(
                workspace.selectedSetId,
                0,
                sessionId,
                enrollmentId,
                courseId,
                workspace.selectedDetailId);
    }

    @GetMapping("/view")
    public String viewFlashcard(
            @RequestParam(value = "index", required = false, defaultValue = "0") int index,
            @RequestParam("flashcardSetId") int flashcardSetId,
            @RequestParam(value = "sessionId", required = false) Integer sessionId,
            @RequestParam(value = "enrollmentId", required = false) Integer enrollmentId,
            @RequestParam(value = "courseId", required = false) Integer courseId,
            @RequestParam(value = "courseSessionDetailId", required = false) Integer courseSessionDetailId,
            Model model) {

        RDFlashCardSet selectedSet = rdFlashCardSetService.getRDFlashCardSet(flashcardSetId);
        if (selectedSet != null && selectedSet.getCourseSessionDetail() != null) {
            courseSessionDetailId = selectedSet.getCourseSessionDetail().getCourseSessionDetailId();

            if (selectedSet.getCourseSessionDetail().getCourseSession() != null) {
                if (sessionId == null) {
                    sessionId = selectedSet.getCourseSessionDetail().getCourseSession().getCourseSessionId();
                }
                if (courseId == null
                        && selectedSet.getCourseSessionDetail().getCourseSession().getCourse() != null) {
                    courseId = selectedSet.getCourseSessionDetail().getCourseSession().getCourse().getCourseId();
                }
            }
        }

        FlashcardWorkspaceSelection workspace =
                populateWorkspaceModel(model, sessionId, courseSessionDetailId, flashcardSetId);

        model.addAttribute("sessionId", sessionId);
        model.addAttribute("enrollmentId", enrollmentId);
        model.addAttribute("courseId", courseId);
        model.addAttribute("courseSessionDetailId", workspace.selectedDetailId);

        Integer effectiveSetId = workspace.selectedSetId;
        if (effectiveSetId == null) {
            if (workspace.selectedTopicJsonBacked && workspace.selectedDetailId != null) {
                model.addAttribute("info", "This topic is available as guided content. Open topic content to continue.");
                model.addAttribute("topicContentDetailId", workspace.selectedDetailId);
            } else {
                model.addAttribute("error", "No flashcards available for the selected topic.");
            }
            model.addAttribute("currentFlashcard", null);
            model.addAttribute("currentFlashcardIndex", 0);
            model.addAttribute("totalFlashcards", 0);
            return "flashcards/flashcard-viewer";
        }

        List<RDFlashCard> flashcards = rdFlashCardService.getFlashCardsBySetId(effectiveSetId);
        if (flashcards == null || flashcards.isEmpty()) {
            model.addAttribute("error", "No flashcards available in the selected set.");
            model.addAttribute("currentFlashcard", null);
            model.addAttribute("currentFlashcardIndex", 0);
            model.addAttribute("totalFlashcards", 0);
            model.addAttribute("flashcardSetId", effectiveSetId);
            return "flashcards/flashcard-viewer";
        }

        int totalFlashcards = flashcards.size();
        int normalizedIndex = index;
        if (normalizedIndex < 0) {
            normalizedIndex = 0;
        }
        if (normalizedIndex >= totalFlashcards) {
            normalizedIndex = totalFlashcards - 1;
        }

        RDFlashCard currentFlashcard = flashcards.get(normalizedIndex);
        model.addAttribute("currentFlashcard", currentFlashcard);
        model.addAttribute("currentFlashcardIndex", normalizedIndex);
        model.addAttribute("totalFlashcards", totalFlashcards);
        model.addAttribute("flashcardSetId", effectiveSetId);
        model.addAttribute("selectedCourseSessionDetailId", workspace.selectedDetailId);

        return "flashcards/flashcard-viewer";
    }

    private FlashcardWorkspaceSelection populateWorkspaceModel(
            Model model,
            Integer sessionId,
            Integer preferredDetailId,
            Integer preferredSetId) {

        List<RDCourseSessionDetail> topicDetails =
                (sessionId == null)
                        ? Collections.emptyList()
                        : courseSessionDetailService.getBySessionAndType(sessionId, "flashcard");

        if (topicDetails == null) {
            topicDetails = Collections.emptyList();
        }

        FlashcardWorkspaceSelection selection = new FlashcardWorkspaceSelection();
        selection.selectedDetailId = preferredDetailId;

        if (selection.selectedDetailId == null && !topicDetails.isEmpty()) {
            selection.selectedDetailId = topicDetails.get(0).getCourseSessionDetailId();
        }

        List<Map<String, Object>> topicSummaries = new ArrayList<>();
        Map<Integer, List<RDFlashcardSetDTO>> setsByDetailId = new HashMap<>();
        Map<Integer, Integer> cardsByDetailId = new HashMap<>();
        Map<Integer, String> titleByDetailId = new HashMap<>();
        Map<Integer, Boolean> jsonBackedByDetailId = new HashMap<>();

        int totalCardsInSession = 0;
        int totalSetsInSession = 0;

        for (int i = 0; i < topicDetails.size(); i++) {
            RDCourseSessionDetail detail = topicDetails.get(i);
            int detailId = detail.getCourseSessionDetailId();
            String title = (detail.getTopic() == null || detail.getTopic().trim().isEmpty())
                    ? "Topic " + (i + 1)
                    : detail.getTopic().trim();

            List<RDFlashcardSetDTO> sets =
                    rdFlashCardSetService.getFlashCardSetsByCourseSessionDetail(detailId);
            if (sets == null) {
                sets = Collections.emptyList();
            }

            int cardCount = 0;
            for (RDFlashcardSetDTO set : sets) {
                List<RDFlashCard> cards =
                        rdFlashCardService.getFlashCardsBySetId(set.getFlashcardSetId());
                cardCount += cards == null ? 0 : cards.size();
            }

            boolean jsonBacked = detail.getFile() != null && !detail.getFile().trim().isEmpty();
            if (cardCount == 0 && jsonBacked) {
                cardCount = 1;
            }

            totalCardsInSession += cardCount;
            totalSetsInSession += sets.size();

            Integer firstSetId = sets.isEmpty() ? null : sets.get(0).getFlashcardSetId();

            Map<String, Object> summary = new HashMap<>();
            summary.put("detailId", detailId);
            summary.put("topic", title);
            summary.put("setCount", sets.size());
            summary.put("cardCount", cardCount);
            summary.put("firstSetId", firstSetId);
            summary.put("jsonBacked", jsonBacked);
            topicSummaries.add(summary);

            setsByDetailId.put(detailId, sets);
            cardsByDetailId.put(detailId, cardCount);
            titleByDetailId.put(detailId, title);
            jsonBackedByDetailId.put(detailId, jsonBacked);
        }

        if (selection.selectedDetailId != null
                && !setsByDetailId.containsKey(selection.selectedDetailId)
                && !topicSummaries.isEmpty()) {
            selection.selectedDetailId = (Integer) topicSummaries.get(0).get("detailId");
        }

        List<RDFlashcardSetDTO> selectedSets = Collections.emptyList();
        if (selection.selectedDetailId != null) {
            selectedSets = setsByDetailId.getOrDefault(selection.selectedDetailId, Collections.emptyList());
            selection.selectedTopicTitle = titleByDetailId.get(selection.selectedDetailId);
            selection.selectedTopicCardCount = cardsByDetailId.getOrDefault(selection.selectedDetailId, 0);
            selection.selectedTopicSetCount = selectedSets.size();
            selection.selectedTopicJsonBacked = jsonBackedByDetailId.getOrDefault(selection.selectedDetailId, false);
        }

        if (!selectedSets.isEmpty()) {
            if (preferredSetId != null) {
                boolean preferredSetFound = selectedSets.stream()
                        .anyMatch(s -> s.getFlashcardSetId() == preferredSetId);
                if (preferredSetFound) {
                    selection.selectedSetId = preferredSetId;
                }
            }
            if (selection.selectedSetId == null) {
                selection.selectedSetId = selectedSets.get(0).getFlashcardSetId();
            }
        }

        model.addAttribute("flashcardTopics", topicSummaries);
        model.addAttribute("totalFlashcardTopics", topicSummaries.size());
        model.addAttribute("totalFlashcardsInSession", totalCardsInSession);
        model.addAttribute("totalFlashcardSetsInSession", totalSetsInSession);
        model.addAttribute("selectedCourseSessionDetailId", selection.selectedDetailId);
        model.addAttribute("selectedTopicTitle", selection.selectedTopicTitle);
        model.addAttribute("selectedTopicSetCount", selection.selectedTopicSetCount);
        model.addAttribute("selectedTopicCardCount", selection.selectedTopicCardCount);
        model.addAttribute("selectedTopicJsonBacked", selection.selectedTopicJsonBacked);
        model.addAttribute("flashcardSets", selectedSets);
        if (selection.selectedSetId != null) {
            model.addAttribute("flashcardSetId", selection.selectedSetId);
        }

        return selection;
    }

    private String buildViewRedirect(
            int flashcardSetId,
            int index,
            Integer sessionId,
            Integer enrollmentId,
            Integer courseId,
            Integer courseSessionDetailId) {

        StringBuilder url = new StringBuilder("redirect:/flashcards/view?index=")
                .append(Math.max(index, 0))
                .append("&flashcardSetId=")
                .append(flashcardSetId);

        if (sessionId != null) {
            url.append("&sessionId=").append(sessionId);
        }
        if (enrollmentId != null) {
            url.append("&enrollmentId=").append(enrollmentId);
        }
        if (courseId != null) {
            url.append("&courseId=").append(courseId);
        }
        if (courseSessionDetailId != null) {
            url.append("&courseSessionDetailId=").append(courseSessionDetailId);
        }
        return url.toString();
    }

    @GetMapping("/list")
    public String listFlashcards(Model model) {
        List<RDFlashCardSet> flashcardSets = rdFlashCardSetService.getRDFlashCardSets();
        model.addAttribute("flashcardSets", flashcardSets);
        
        // Load only categories initially
        List<RDCourseCategory> categories = courseCategoryService.getRDCourseCategories();
        model.addAttribute("categories", categories);

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
                flashcard.setQuestionImageUrl(flashcardJson.getQuestionImageUrl());
                flashcard.setAnswerImageUrl(flashcardJson.getAnswerImageUrl());

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

    @GetMapping(
    	    value = "/getCourseSessions",
    	    produces = MediaType.APPLICATION_JSON_VALUE
    	)
    	@ResponseBody
    	public Map<String, Object> getCourseSessions(
    	        @RequestParam("courseId") int courseId) {

    	    List<RDCourseSession> sessions =
    	            courseSessionService.getCourseSessionsByCourseId(courseId);

    	    List<Map<String, Object>> dto = sessions.stream().map(s -> {
    	        Map<String, Object> m = new HashMap<>();
    	        m.put("courseSessionId", s.getCourseSessionId());
    	        m.put("sessionTitle", s.getSessionTitle());
    	        return m;
    	    }).toList();

    	    Map<String, Object> response = new HashMap<>();
    	    response.put("courseSessions", dto);
    	    return response;
    	}


    @GetMapping(
    	    value = "/getCourseSessionDetails",
    	    produces = MediaType.APPLICATION_JSON_VALUE
    	)
    	@ResponseBody
    	public Map<String, Object> getCourseSessionDetails(
    	        @RequestParam("courseSessionId") int courseSessionId) {

    	    List<RDCourseSessionDetail> details =
    	            courseSessionDetailService.findSessionDetailsBySessionId(courseSessionId);

    	    List<Map<String, Object>> dto = details.stream().map(d -> {
    	        Map<String, Object> m = new HashMap<>();
    	        m.put("courseSessionDetailId", d.getCourseSessionDetailId());
    	        m.put("topic", d.getTopic());
    	        m.put("type", d.getType());
    	        return m;
    	    }).toList();

    	    Map<String, Object> response = new HashMap<>();
    	    response.put("sessionDetails", dto);
    	    return response;
    	}

    @GetMapping(
    	    value = "/getFlashcardSetsBySessionDetail",
    	    produces = MediaType.APPLICATION_JSON_VALUE
    	)
    	@ResponseBody
    	public Map<String, Object> getFlashcardSetsByCourseSessionDetail(
    	        @RequestParam("courseSessionDetailId") int courseSessionDetailId) {

    	    List<RDFlashcardSetDTO> flashcardSets =
    	            rdFlashCardSetService.getFlashCardSetsByCourseSessionDetail(courseSessionDetailId);

    	    Map<String, Object> response = new HashMap<>();
    	    response.put("flashcardSets", flashcardSets);
    	    return response;
    	}
}
