package com.robodynamics.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDMatchingCategory;
import com.robodynamics.model.RDMatchingGame;
import com.robodynamics.model.RDMatchingItem;
import com.robodynamics.service.RDMatchingGameService;

/**
 * -------------------------------------------------
 * STUDENT MATCHING GAME CONTROLLER
 * -------------------------------------------------
 * Handles:
 * 1. Listing matching games for a course session
 * 2. Playing a selected matching game
 *
 * Pattern mirrors:
 * - Student Quiz Controller
 * - Student Session Dashboard flow
 */
@Controller
@RequestMapping("/student/matching-game")
public class RDStudentMatchingGameController {

    @Autowired
    private RDMatchingGameService matchingGameService;

    /* -------------------------------------------------
     * LIST MATCHING GAMES FOR A SESSION
     * -------------------------------------------------
     * URL:
     * /student/matching-game/list?sessionId=1&enrollmentId=10
     */
    @GetMapping("/list")
    public String listMatchingGames(
            @RequestParam("sessionId") int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        // Fetch games mapped to the session
        List<RDMatchingGame> games =
                matchingGameService.getGamesBySessionId(sessionId);

        model.addAttribute("games", games);
        model.addAttribute("sessionId", sessionId);
        model.addAttribute("enrollmentId", enrollmentId);

        return "matching-game/matching_game_list";
    }

    /* -------------------------------------------------
     * PLAY MATCHING GAME
     * -------------------------------------------------
     * URL:
     * /student/matching-game/play?gameId=5&enrollmentId=10
     */
    @GetMapping("/play")
    public String playMatchingGame(
            @RequestParam("gameId") int gameId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        // Fetch full game with categories + items
        RDMatchingGame game =
                matchingGameService.getGameWithCategories(gameId);

        if (game == null) {
            model.addAttribute("error",
                    "Matching game not found or not available.");
            return "matching-game/matching_game_play";
        }

        // -------------------------------------------------
        // VERY IMPORTANT: Extract categories and items
        // -------------------------------------------------
        List<RDMatchingCategory> categories =
                new ArrayList<>(game.getCategories());

        List<RDMatchingItem> items = new ArrayList<>();
        for (RDMatchingCategory category : categories) {
            if (category.getItems() != null) {
                items.addAll(category.getItems());
            }
        }

        int courseId =
                game.getCourseSessionDetail()
                    .getCourseSession()
                    .getCourse()
                    .getCourseId();
        // -------------------------------------------------
        // Send all required data to JSP
        // -------------------------------------------------
        model.addAttribute("game", game);
        model.addAttribute("courseId", courseId);

        model.addAttribute("categories", categories);
        model.addAttribute("items", items);
        model.addAttribute("enrollmentId", enrollmentId);

        return "matching-game/matching_game_play";
    }

}
