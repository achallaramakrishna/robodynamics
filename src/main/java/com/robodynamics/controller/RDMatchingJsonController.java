package com.robodynamics.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDMatchingCategory;
import com.robodynamics.model.RDMatchingGame;
import com.robodynamics.model.RDMatchingItem;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDMatchingCategoryService;
import com.robodynamics.service.RDMatchingGameService;
import com.robodynamics.service.RDMatchingItemService;

public class RDMatchingJsonController {
	
	@Autowired
	private RDCourseService courseService;

	@Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;
    
    @Autowired
    private RDMatchingGameService matchingGameService;
    
    @Autowired
    private RDMatchingCategoryService matchingCategoryService;
    
    @Autowired
    private RDMatchingItemService matchingItemService;
    
    
    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
    	
    	System.out.println("inside course sessions.. get method");
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", courseSessions);
        return response;
    }

    @GetMapping("/getCourseSessionDetails")
    @ResponseBody
    public Map<String, Object> getCourseSessionDetails(@RequestParam("sessionId") int sessionId) {
        List<RDCourseSessionDetail> sessionDetails = courseSessionDetailService.findSessionDetailsBySessionId(sessionId);
        Map<String, Object> response = new HashMap<>();
        response.put("sessionDetails", sessionDetails);
        return response;
    }
    @GetMapping("/list")
    public String listMatchingGames(@RequestParam(required = false) Integer courseSessionDetailId, Model model) {
    	RDMatchingGame matchingGame = null;

        if (courseSessionDetailId != null && courseSessionDetailId > 0) {
        	matchingGame = matchingGameService.getGameByCourseSessionDetails(courseSessionDetailId);
        }

        if (matchingGame == null) {
            model.addAttribute("message", "No matching game available for the selected session.");
        } else {
            model.addAttribute("games", matchingGame);
        }

        return "matchingGames/listMatchingGames"; // JSP page to list games
    }

    @GetMapping("/add")
    public String showAddForm(@RequestParam("courseSessionDetailId") int courseSessionDetailId, Model model) {
        RDMatchingGame game = new RDMatchingGame();
        model.addAttribute("courseSessionDetailId", courseSessionDetailId);
        model.addAttribute("game", game);
        return "matchingGames/addEditMatchingGame"; // JSP page to add/edit games
    }

    @GetMapping("/edit")
    public String showEditForm(@RequestParam("gameId") int gameId, @RequestParam("courseSessionDetailId") int courseSessionDetailId, Model model) {
        RDMatchingGame game = matchingGameService.getGameById(gameId);
        model.addAttribute("courseSessionDetailId", courseSessionDetailId);
        model.addAttribute("game", game);
        return "matchingGames/addEditMatchingGame";
    }

    @PostMapping("/save")
    public String saveMatchingGame(@ModelAttribute("game") RDMatchingGame game,
                                   @RequestParam("courseSessionDetailId") int courseSessionDetailId,
                                   RedirectAttributes redirectAttributes) {
        try {
            RDCourseSessionDetail courseSessionDetail = 
            		courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
            
            game.setCourseSessionDetail(courseSessionDetail);
            matchingGameService.saveGame(game);
            redirectAttributes.addFlashAttribute("message", "Matching game saved successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error saving the matching game.");
        }
        return "redirect:/matching-games/list?courseSessionDetailId=" + courseSessionDetailId;
    }

    @GetMapping("/delete")
    public String deleteMatchingGame(@RequestParam("gameId") int gameId, RedirectAttributes redirectAttributes) {
        try {
            matchingGameService.deleteGame(gameId);
            redirectAttributes.addFlashAttribute("message", "Matching game deleted successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting the matching game.");
        }
        return "redirect:/matching-games/list";
    }

    @GetMapping("/getCategories")
    @ResponseBody
    public Map<String, Object> getCategories(@RequestParam("gameId") int gameId) {
        List<RDMatchingCategory> categories = matchingCategoryService.getCategoriesByGameId(gameId);
        Map<String, Object> response = new HashMap<>();
        response.put("categories", categories);
        return response;
    }

    @GetMapping("/getItems")
    @ResponseBody
    public Map<String, Object> getItems(@RequestParam("categoryId") int categoryId) {
        List<RDMatchingItem> items = matchingItemService.getItemsByCategoryId(categoryId);
        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        return response;
    }

    @PostMapping("/uploadWithImages")
    public String handleJsonAndImageUpload(
            @RequestParam("file") MultipartFile jsonFile,
            @RequestParam("images") MultipartFile[] images,
            @RequestParam("courseSessionDetailId") Integer courseSessionDetailId,
            RedirectAttributes redirectAttributes) {

        if (jsonFile.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/matching-games/list?courseSessionDetailId=" + courseSessionDetailId;
        }

        if (images == null || images.length == 0) {
            redirectAttributes.addFlashAttribute("error", "Please select images to upload.");
            return "redirect:/matching-games/list?courseSessionDetailId=" + courseSessionDetailId;
        }

        try {
            if (courseSessionDetailId == null || courseSessionDetailId <= 0) {
                redirectAttributes.addFlashAttribute("error", "Invalid session detail ID. Please select a valid session detail.");
                return "redirect:/matching-games/list";
            }

            // Process the JSON file
            Map<String, Object> parsedData = matchingGameService.processJson(jsonFile, courseSessionDetailId);

            // Save images and associate them with respective entities
            for (MultipartFile image : images) {
                String imageName = image.getOriginalFilename();
                matchingGameService.saveImage(parsedData, imageName, image.getBytes());
            }

            redirectAttributes.addFlashAttribute("message", "JSON and images uploaded and processed successfully for session detail ID: " + courseSessionDetailId);
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON or images: " + e.getMessage());
        }

        return "redirect:/matching-games/list?courseSessionDetailId=" + courseSessionDetailId;
    }

}