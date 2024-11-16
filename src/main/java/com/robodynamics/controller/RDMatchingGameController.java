package com.robodynamics.controller;

import com.robodynamics.model.RDMatchingGame;
import com.robodynamics.model.RDMatchingCategory;
import com.robodynamics.model.RDMatchingItem;
import com.robodynamics.service.RDMatchingGameService;
import com.robodynamics.service.RDMatchingCategoryService;
import com.robodynamics.service.RDMatchingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/matching-game")
public class RDMatchingGameController {

    @Autowired
    private RDMatchingGameService matchingGameService;

    @Autowired
    private RDMatchingCategoryService matchingCategoryService;

    @Autowired
    private RDMatchingItemService matchingItemService;

    // View all matching games
    @GetMapping("/all")
    public String viewAllGames(Model model) {
        List<RDMatchingGame> games = matchingGameService.getAllGames();
        model.addAttribute("games", games);
        return "matching-game/all-games";  // JSP page to list all games
    }

    // View a specific matching game by ID
    @GetMapping("/{gameId}")
    public String viewGameById(@PathVariable Long gameId, Model model) {
        RDMatchingGame game = matchingGameService.getGameById(gameId);
        if (game == null) {
            return "error/no-game-found";  // Error page if no game is found
        }

        List<RDMatchingCategory> categories = matchingCategoryService.getCategoriesByGameId(gameId);
        List<RDMatchingItem> items = matchingItemService.getItemsByGameId(gameId);

        model.addAttribute("game", game);
        model.addAttribute("categories", categories);
        model.addAttribute("items", items);

        return "matching-game/view-game";  // JSP page to display a game with categories and items
    }

    // Display form to create a new game
    @GetMapping("/new")
    public String createGameForm(Model model) {
        model.addAttribute("game", new RDMatchingGame());
        return "matching-game/create-game";  // JSP page for creating a new game
    }

    // Save or update a matching game
    @PostMapping("/save")
    public String saveGame(@ModelAttribute("game") RDMatchingGame game) {
        matchingGameService.saveGame(game);
        return "redirect:/matching-game/all";  // Redirect to view all games
    }

    // View categories for a specific game
    @GetMapping("/{gameId}/categories")
    public String viewCategoriesByGame(@PathVariable Long gameId, Model model) {
        List<RDMatchingCategory> categories = matchingCategoryService.getCategoriesByGameId(gameId);
        model.addAttribute("categories", categories);
        return "matching-game/view-categories";  // JSP page to display categories
    }

    // View items for a specific category
    @GetMapping("/category/{categoryId}/items")
    public String viewItemsByCategory(@PathVariable Long categoryId, Model model) {
        List<RDMatchingItem> items = matchingItemService.getItemsByCategoryId(categoryId);
        model.addAttribute("items", items);
        return "matching-game/view-items";  // JSP page to display items in a category
    }

    // Display form to create a new category for a specific game
    @GetMapping("/{gameId}/category/new")
    public String createCategoryForm(@PathVariable Long gameId, Model model) {
        RDMatchingCategory category = new RDMatchingCategory();
        category.setGame(matchingGameService.getGameById(gameId));
        model.addAttribute("category", category);
        return "matching-game/create-category";  // JSP page for creating a new category
    }

    // Save or update a category
    @PostMapping("/category/save")
    public String saveCategory(@ModelAttribute("category") RDMatchingCategory category) {
        matchingCategoryService.saveCategory(category);
        return "redirect:/matching-game/" + category.getGame().getGameId() + "/categories";
    }

    // Display form to create a new item for a specific category
    @GetMapping("/category/{categoryId}/item/new")
    public String createItemForm(@PathVariable Long categoryId, Model model) {
        RDMatchingItem item = new RDMatchingItem();
        item.setCategory(matchingCategoryService.getCategoryById(categoryId));
        model.addAttribute("item", item);
        return "matching-game/create-item";  // JSP page for creating a new item
    }

    // Save or update an item
    @PostMapping("/item/save")
    public String saveItem(@ModelAttribute("item") RDMatchingItem item) {
        matchingItemService.saveItem(item);
        return "redirect:/matching-game/category/" + item.getCategory().getCategoryId() + "/items";
    }
}
