package com.robodynamics.controller;

import com.robodynamics.model.RDMatchingGame;
import com.robodynamics.dto.RDMatchingCategoryDTO;

import com.robodynamics.dto.RDMatchingGameDTO;
import com.robodynamics.dto.RDMatchingGameMapper;
import com.robodynamics.dto.RDMatchingItemDTO;
import com.robodynamics.dto.RDMatchingGameResponseDTO;
import com.robodynamics.form.RDMatchingCategoryForm;
import com.robodynamics.form.RDMatchingItemForm;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDMatchingCategory;
import com.robodynamics.model.RDMatchingItem;
import com.robodynamics.service.RDMatchingGameService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDMatchingCategoryService;
import com.robodynamics.service.RDMatchingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/matching-game")
public class RDMatchingGameController {
	
	@Autowired
	ServletContext servletContext;
	
	@Autowired
	private RDCourseService courseService;

    @Autowired
    private RDMatchingGameService matchingGameService;

    @Autowired
    private RDMatchingCategoryService matchingCategoryService;

    @Autowired
    private RDMatchingItemService matchingItemService;
    
    @Autowired
    private RDCourseSessionService courseSessionService;
    
    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;
    

    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
    	
    	System.out.println("inside course sessions.. get method");
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", courseSessions);
        return response;
    }
    
    @GetMapping("/dashboard")
    public String matchingDashboard(Model model) {
        model.addAttribute("courses", courseService.getRDCourses());
        return "matching-game/listMatchingGames";
    }


    @GetMapping("/getCourseSessionDetails")
    @ResponseBody
    public Map<String, Object> getCourseSessionDetails(@RequestParam("sessionId") int sessionId) {
        List<RDCourseSessionDetail> sessionDetails = courseSessionDetailService.findSessionDetailsBySessionId(sessionId);
        Map<String, Object> response = new HashMap<>();
        response.put("sessionDetails", sessionDetails);
        return response;
    }
   
    // View all matching games
    @GetMapping("/all")
    public String viewAllGames(Model model) {
        List<RDMatchingGame> games = matchingGameService.getAllGames();
        model.addAttribute("games", games);
        return "matching-game/all-games";  // JSP page to list all games
    }
    
    @GetMapping("/matching/play")
    public String playMatchingGame(
            @RequestParam int sessionId,
            @RequestParam int enrollmentId,
            Model model) {

    	
        model.addAttribute("sessionId", sessionId);
        model.addAttribute("enrollmentId", enrollmentId);
        return "matching-game/play";
    }
    
    @GetMapping("/list")
    public String listMatchingGames(
            @RequestParam int sessionId,
            @RequestParam int enrollmentId,
            Model model) {

        List<RDMatchingGame> games =
            matchingGameService.getGamesBySessionId(sessionId);

        model.addAttribute("games", games);
        model.addAttribute("sessionId", sessionId);
        model.addAttribute("enrollmentId", enrollmentId);

        return "redirect:/matching-game/list?sessionId="
        + sessionId +
        "&enrollmentId="
        + enrollmentId;

    }


    
	/*
	 * @GetMapping("/list") public String listMatchingGames(@RequestParam(required =
	 * false) Integer courseSessionDetailId, Model model) { RDMatchingGame game =
	 * null;
	 * 
	 * if (courseSessionDetailId != null && courseSessionDetailId > 0) {
	 * 
	 * game =
	 * matchingGameService.getGameByCourseSessionDetails(courseSessionDetailId); }
	 * 
	 * if (game == null) { model.addAttribute("message",
	 * "No matching games available for the selected session."); } else {
	 * model.addAttribute("games", game); } List<RDCourse> courses =
	 * courseService.getRDCourses(); model.addAttribute("courses",courses);
	 * 
	 * return "matching-game/listMatchingGames"; // JSP page to display the list of
	 * matching games }
	 */
    
    @PostMapping("/uploadJsonWithImages")
    public String uploadJsonWithImages(
            @RequestParam("file") MultipartFile jsonFile,
            @RequestParam("images") MultipartFile[] images,
            @RequestParam("courseSessionDetailId") int courseSessionDetailId,
            RedirectAttributes redirectAttributes) {

        try {
            // Parse JSON file
            Map<String, Object> parsedData = matchingGameService.parseJson(jsonFile);

            // Save images
            String uploadDir = servletContext.getRealPath("/resources/assets/images/");
            File uploadDirFile = new File(uploadDir);
            if (!uploadDirFile.exists()) {
                uploadDirFile.mkdirs();
            }

            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String fileName = image.getOriginalFilename();
                    File destination = new File(uploadDir + fileName);
                    image.transferTo(destination);
                }
            }

            // Process and save the game data
            matchingGameService.saveGameWithCategoriesAndItems(parsedData, courseSessionDetailId);

            redirectAttributes.addFlashAttribute("success", "Matching game and images uploaded successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Failed to upload JSON or images.");
        }

        return "redirect:/matching-game/list";
    }



    @GetMapping("/category/edit/{categoryId}")
    public String editCategory(@PathVariable int categoryId, Model model) {
        // Fetch the category
        RDMatchingCategory category = matchingCategoryService.getCategoryById(categoryId);

        if (category == null) {
            throw new IllegalStateException("Category not found.");
        }

        // Map RDMatchingCategory to RDMatchingCategoryForm
        RDMatchingCategoryForm matchingCategoryForm = new RDMatchingCategoryForm();
        matchingCategoryForm.setCategoryId(category.getCategoryId());
        matchingCategoryForm.setCategoryName(category.getCategoryName());
        matchingCategoryForm.setGameId(category.getGame().getGameId());

        // Add existing image path for preview
        model.addAttribute("existingImage", category.getImageName());
        model.addAttribute("matchingCategoryForm", matchingCategoryForm);

        return "matching-game/category-form"; // JSP for editing category
    }
    
    
    @PostMapping("/delete/{gameId}")
    public String deleteGame(@PathVariable int gameId) {
        matchingGameService.deleteGame(gameId);
        return "redirect:/matching-game/all";  // Redirect to the list of all games
    }
    
    @PostMapping("/category/delete/{categoryId}")
    public String deleteCategory(@PathVariable int categoryId) {
        RDMatchingCategory category = matchingCategoryService.getCategoryById(categoryId);
        matchingCategoryService.deleteCategory(categoryId);
        return "redirect:/matching-game/" + category.getGame().getGameId() + "/categories";  // Redirect to the list of categories
    }

    @PostMapping("/item/delete/{itemId}")
    public String deleteItem(@PathVariable int itemId) {
        RDMatchingItem item = matchingItemService.getItemById(itemId);
        matchingItemService.deleteItem(itemId);
        return "redirect:/matching-game/category/" + item.getCategory().getCategoryId() + "/items";  // Redirect to the list of items
    }

    @GetMapping
    public String showMatchingGamePage(@RequestParam(required = false) int categoryId, Model model) {
        // Fetch the default or requested category
        RDMatchingCategory category;
        if (categoryId != 0) {
            category = matchingCategoryService.getCategoryById(categoryId);
            if (category == null) {
                throw new IllegalArgumentException("Invalid category ID: " + categoryId);
            }
        } else {
            // Select the first category if no categoryId is provided
            category = matchingCategoryService.getFirstCategory();
            if (category == null) {
                throw new IllegalStateException("No categories available.");
            }
        }

        // Fetch the game associated with the category
        RDMatchingGame game = matchingGameService.getGameById(category.getGame().getGameId());
        if (game == null) {
            throw new IllegalArgumentException("Game not found for category ID: " + category.getCategoryId());
        }

        // Fetch the items for the selected category
        List<RDMatchingItem> items = matchingItemService.getItemsByCategoryId(category.getCategoryId());

        // Add attributes to the model
        model.addAttribute("game", game);
        model.addAttribute("categories", List.of(category)); // Only the selected category
        model.addAttribute("items", items);

        return "matching-game"; // Corresponds to matching-game.jsp
    }

    
    
    // View a specific matching game by ID
    @GetMapping("/{gameId}")
    public String viewGameById(@PathVariable int gameId, Model model) {
        RDMatchingGame game = matchingGameService.getGameById(gameId);
        if (game == null) {
            return "error/no-game-found";  // Error page if no game is found
        }

        List<RDMatchingCategory> categories = matchingCategoryService.getCategoriesByGameId(gameId);
        System.out.println("Size - " + categories.size());
        System.out.println("Categories - " + categories);
        
        for (RDMatchingCategory category : categories) {
            // Force initialization of items collection
            category.setItems(matchingItemService.getItemsByCategoryId(category.getCategoryId()));
        }
        
        // Add a default `MatchingCategoryForm` for adding/editing categories
        RDMatchingCategoryForm matchingCategoryForm = new RDMatchingCategoryForm();
        matchingCategoryForm.setGameId(gameId); // Pre-set the gameId for the form
        model.addAttribute("matchingCategoryForm", matchingCategoryForm);
        

        
        model.addAttribute("game", game);
        model.addAttribute("categories", categories);

        return "matching-game/view-game";  // JSP page to display game with categories
    }

    // Display form to create a new game
    @GetMapping("/new")
    public String createGameForm(Model model) {
        model.addAttribute("game", new RDMatchingGame());
        return "matching-game/create-game";  // JSP page for creating a new game
    }
    
    @GetMapping("/edit/{gameId}")
    public String editGameForm(@PathVariable int gameId, Model model) {
        RDMatchingGame game = matchingGameService.getGameById(gameId);
        if (game == null) {
            throw new IllegalStateException("Game not found.");
        }
        model.addAttribute("game", game);
        return "matching-game/edit-game";
    }

    @PostMapping("/update")
    public String updateGame(@ModelAttribute("game") RDMatchingGame game) {
        matchingGameService.saveGame(game); // Update the game
        return "redirect:/matching-game/all";
    }


    // Save or update a matching game
    @PostMapping("/save")
    public String saveGame(@ModelAttribute("game") RDMatchingGame game) {
        matchingGameService.saveGame(game);
        return "redirect:/matching-game/" + game.getGameId() + "/categories";  // Redirect to manage categories for the new game
    }

    // View categories for a specific game
    @GetMapping("/{gameId}/categories")
    public String viewCategoriesByGame(@PathVariable int gameId, Model model) {
        List<RDMatchingCategory> categories = matchingCategoryService.getCategoriesByGameId(gameId);
        model.addAttribute("categories", categories);
        model.addAttribute("gameId", gameId);  // Pass gameId for navigation
        return "matching-game/view-categories";  // JSP page to display categories
    }
    
 // Show the Add Category Form
    @GetMapping("/category/add/{gameId}")
    public String addCategoryForm(@PathVariable int gameId, Model model) {
        // Ensure the game exists
        RDMatchingGame game = matchingGameService.getGameById(gameId);
        if (game == null) {
            throw new IllegalStateException("Game not found.");
        }

        // Create a new form object and pre-set the game ID
        RDMatchingCategoryForm matchingCategoryForm = new RDMatchingCategoryForm();
        matchingCategoryForm.setGameId(gameId);

        model.addAttribute("matchingCategoryForm", matchingCategoryForm);
        return "matching-game/category-form"; // JSP for adding/editing a category
    }
    
 // Save the Category (Handles both Add and Edit)
    @PostMapping("/category/save")
    public String saveCategory(
            @ModelAttribute("matchingCategoryForm") RDMatchingCategoryForm matchingCategoryForm,
            BindingResult result,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            return "matching-game/category-form"; // Return to the form on validation errors
        }

        // Fetch or create a new RDMatchingCategory
        RDMatchingCategory category = (matchingCategoryForm.getCategoryId() > 0)
                ? matchingCategoryService.getCategoryById(matchingCategoryForm.getCategoryId())
                : new RDMatchingCategory();

        if (category == null && matchingCategoryForm.getCategoryId() > 0) {
            throw new IllegalStateException("Category not found for editing.");
        }

        // Fetch the associated game
        RDMatchingGame game = matchingGameService.getGameById(matchingCategoryForm.getGameId());
        if (game == null) {
            throw new IllegalStateException("Game not found.");
        }

        // Set category details
        category.setGame(game);
        category.setCategoryName(matchingCategoryForm.getCategoryName());

        // Handle image upload
        MultipartFile imageFile = matchingCategoryForm.getImageFile();
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String uploadDir = servletContext.getRealPath("/resources/assets/images/");
                File uploadDirFile = new File(uploadDir);
                if (!uploadDirFile.exists()) {
                    uploadDirFile.mkdirs();
                }
                String fileName = imageFile.getOriginalFilename();
                File destination = new File(uploadDir + fileName);
                imageFile.transferTo(destination);

                // Set the relative image path
                category.setImageName("assets/images/" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
                result.rejectValue("imageFile", "error.imageFile", "Failed to upload the image.");
                return "matching-game/category-form"; // Return to the form on error
            }
        }

        matchingCategoryService.saveCategory(category);
        redirectAttributes.addFlashAttribute("success", "Category saved successfully!");

        return "redirect:/matching-game/" + game.getGameId() + "/categories";
    }

    // View items for a specific category
    @GetMapping("/category/{categoryId}/items")
    public String viewItemsByCategory(@PathVariable int categoryId, Model model) {
        List<RDMatchingItem> items = matchingItemService.getItemsByCategoryId(categoryId);
        RDMatchingCategory category = matchingCategoryService.getCategoryById(categoryId);
        model.addAttribute("items", items);
        model.addAttribute("category", category);
        return "matching-game/view-items";  // JSP page to display items in a category
    }

 // Show the Add Item Form
    @GetMapping("/category/{categoryId}/item/add")
    public String addItemForm(@PathVariable int categoryId, Model model) {
        // Ensure the category exists
        RDMatchingCategory category = matchingCategoryService.getCategoryById(categoryId);
        if (category == null) {
            throw new IllegalStateException("Category not found.");
        }

        // Create a new form object and pre-set the category ID
        RDMatchingItemForm matchingItemForm = new RDMatchingItemForm();
        matchingItemForm.setCategoryId(categoryId);

        model.addAttribute("matchingItemForm", matchingItemForm);
        model.addAttribute("category", category);
        return "matching-game/item-form"; // JSP for adding/editing an item
    }

    // Save the Item (Handles both Add and Edit)
    @PostMapping("/item/save")
    public String saveItem(
            @ModelAttribute("matchingItemForm") RDMatchingItemForm matchingItemForm,
            BindingResult result,
            RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            return "matching-game/item-form"; // Return to the form on validation errors
        }

        // Fetch or create a new RDMatchingItem
        RDMatchingItem item = (matchingItemForm.getItemId() > 0)
                ? matchingItemService.getItemById(matchingItemForm.getItemId())
                : new RDMatchingItem();

        if (item == null && matchingItemForm.getItemId() > 0) {
            throw new IllegalStateException("Item not found for editing.");
        }

        // Fetch the associated category
        RDMatchingCategory category = matchingCategoryService.getCategoryById(matchingItemForm.getCategoryId());
        if (category == null) {
            throw new IllegalStateException("Category not found.");
        }

        // Set item details
        item.setCategory(category);
        item.setItemName(matchingItemForm.getItemName());
        item.setMatchingText(matchingItemForm.getMatchingText());

        // Handle image upload
        MultipartFile imageFile = matchingItemForm.getImageFile();
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String uploadDir = servletContext.getRealPath("/resources/assets/images/");
                File uploadDirFile = new File(uploadDir);
                if (!uploadDirFile.exists()) {
                    uploadDirFile.mkdirs();
                }
                String fileName = imageFile.getOriginalFilename();
                File destination = new File(uploadDir + fileName);
                imageFile.transferTo(destination);

                // Set the relative image path
                item.setImageName("assets/images/" + fileName);
            } catch (IOException e) {
                e.printStackTrace();
                result.rejectValue("imageFile", "error.imageFile", "Failed to upload the image.");
                return "matching-game/item-form"; // Return to the form on error
            }
        }

        matchingItemService.saveItem(item);
        redirectAttributes.addFlashAttribute("success", "Item saved successfully!");

        return "redirect:/matching-game/category/" + category.getCategoryId() + "/items";
    }
    
 
    @GetMapping("/category/{categoryId}/item/edit/{itemId}")
    public String showEditItemForm(
            @PathVariable int categoryId,
            @PathVariable int itemId,
            Model model) {

        // Fetch the item and category
        RDMatchingItem item = matchingItemService.getItemById(itemId);
        RDMatchingCategory category = matchingCategoryService.getCategoryById(categoryId);

        if (item == null || category == null) {
            throw new IllegalStateException("Item or Category not found.");
        }

        // Map RDMatchingItem to RDMatchingItemForm
        RDMatchingItemForm matchingItemForm = new RDMatchingItemForm();
        matchingItemForm.setItemId(item.getItemId());
        matchingItemForm.setCategoryId(category.getCategoryId());
        matchingItemForm.setItemName(item.getItemName());
        matchingItemForm.setMatchingText(item.getMatchingText());

        // Add the existing image path to the model for preview purposes
        model.addAttribute("existingImage", item.getImageName()); // Path to existing image
        model.addAttribute("matchingItemForm", matchingItemForm);
        model.addAttribute("category", category);

        return "matching-game/item-form"; // JSP for editing item
    }
    
    @GetMapping("/start/{courseSessionDetailId}")
    public String startMatchingGame(@PathVariable("courseSessionDetailId") int courseSessionDetailId, Model model) {
        RDMatchingGame game = matchingGameService.getGameByCourseSessionDetails(courseSessionDetailId);

        if (game == null) {
            model.addAttribute("error", "No matching game found for this course session detail.");
            return "error";
        }

        // Fetch the categories associated with the game
        List<RDMatchingCategory> categories = matchingCategoryService.getCategoriesByGameId(game.getGameId());

        // Fetch the items associated with the game
        List<RDMatchingItem> items = matchingItemService.getItemsByGameId(game.getGameId());
        
        model.addAttribute("game", game);
        
        model.addAttribute("categories", categories);
        model.addAttribute("items", items);
        
        return "matching-game/matching-game";
    }
    
    @GetMapping("/getGameDetailsBySessionDetail")
    @ResponseBody
    public RDMatchingGameResponseDTO getGameDetailsBySessionDetail(
            @RequestParam("sessionDetailId") int sessionDetailId) {

        RDMatchingGameResponseDTO response = new RDMatchingGameResponseDTO();

        RDMatchingGame game =
                matchingGameService.getGameByCourseSessionDetails(sessionDetailId);

        if (game == null) {
            response.setGame(null);
            response.setCategories(new ArrayList<>());
            return response;
        }

        // 1️⃣ Fetch categories
        List<RDMatchingCategory> categories =
                matchingCategoryService.getCategoriesByGameId(game.getGameId());

        // 2️⃣ Fetch items grouped by category
        Map<Integer, List<RDMatchingItem>> itemsByCategory = new HashMap<>();
        for (RDMatchingCategory c : categories) {
            itemsByCategory.put(
                    c.getCategoryId(),
                    matchingItemService.getItemsByCategoryId(c.getCategoryId())
            );
        }

        // 3️⃣ Use Mapper (single source of truth)
        RDMatchingGameDTO gameDTO =
                RDMatchingGameMapper.toDTO(game, categories, itemsByCategory);

        response.setGame(gameDTO);
        response.setCategories(gameDTO.getCategories());

        return response;
    }


}
