package com.robodynamics.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.*;
import com.robodynamics.service.*;
import com.robodynamics.wrapper.CourseSessionDetailJson;
import com.robodynamics.wrapper.CourseSessionJson;

@Controller
@RequestMapping("/quizzes")
public class RDQuizController {

    // ------------------------------------------------
    // SERVICE INJECTIONS
    // ------------------------------------------------
    @Autowired private RDCourseService courseService;
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;

    @Autowired private RDQuizService quizService;
    @Autowired private RDQuizQuestionService quizQuestionService;
    @Autowired private RDQuizQuestionMapService quizQuestionMapService;

    @Autowired private RDUserService userService;
    @Autowired private RDUserQuizResultService quizResultService;
    @Autowired private RDUserQuizAnswerService userQuizAnswerService;
    @Autowired private RDUserPointsService userPointsService;


    // ------------------------------------------------
    // QUIZ START
    // ------------------------------------------------
    @GetMapping("/start/{quizId}")
    public String startQuiz(
            @PathVariable int quizId,
            HttpSession session,
            HttpServletRequest request,
            Model model,
            @RequestParam(value = "currentPage", defaultValue = "0") int currentPage,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(value = "mode", defaultValue = "practice") String mode,
            @RequestParam(value = "showHeaderFooter", defaultValue = "false") boolean showHeaderFooter
    ) {

        // Ensure user is logged in
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            session.setAttribute("redirectUrl", request.getRequestURI());
            return "redirect:/login";
        }

        RDQuiz quiz = quizService.findById(quizId);
        List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);
        List<RDQuizQuestion> allQuestions = quizQuestionService.findQuestionsByIds(questionIds);

        if (allQuestions.isEmpty()) {
            model.addAttribute("message", "No questions found.");
            return "quizzes/error";
        }

        // Pagination
        int totalQuestions = allQuestions.size();
        int totalPages = (int) Math.ceil((double) totalQuestions / pageSize);

        int start = currentPage * pageSize;
        int end = Math.min(start + pageSize, totalQuestions);

        List<RDQuizQuestion> pageQuestions = allQuestions.subList(start, end);

        // View
        model.addAttribute("quiz", quiz);
        model.addAttribute("questions", pageQuestions);
        model.addAttribute("currentPage", currentPage);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("pageSize", pageSize);
        model.addAttribute("mode", mode);
        model.addAttribute("showHeaderFooter", showHeaderFooter);

        return "quizzes/take";
    }



    // ------------------------------------------------
    // QUIZ NAVIGATION (NEXT / PREVIOUS / SUBMIT)
    // ------------------------------------------------
    @PostMapping("/navigate")
    public String navigateQuiz(
            @RequestParam("quizId") int quizId,
            @RequestParam("currentPage") int currentPage,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam("action") String action,
            @RequestParam Map<String, String> answers,
            @RequestParam(value = "mode", defaultValue = "practice") String mode,
            @RequestParam(value = "showHeaderFooter", defaultValue = "false") boolean showHeaderFooter,
            HttpSession session,
            Model model
    ) {

        // Ensure user logged in
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) return "redirect:/login";

        // Load quiz + questions
        RDQuiz quiz = quizService.findById(quizId);
        List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);
        List<RDQuizQuestion> allQuestions = quizQuestionService.findQuestionsByIds(questionIds);

        // Always load existing selectedAnswers
        Map<Integer, String> selectedAnswers =
                (Map<Integer, String>) session.getAttribute("selectedAnswers");

        if (selectedAnswers == null)
            selectedAnswers = new HashMap<>();

        // ⭐ Save answers from current page (before ANY action)
        for (Integer qId : questionIds) {
            String key = "question_" + qId + "_answer";
            if (answers.containsKey(key)) {
                selectedAnswers.put(qId, answers.get(key));
            }
        }

        session.setAttribute("selectedAnswers", selectedAnswers);

        // SUBMIT QUIZ
        if ("submit".equals(action)) {
            answers.put("quizId", String.valueOf(quizId)); // important!
            return submitQuiz(answers, model, session);
        }

        // NEXT / PREVIOUS
        if ("next".equals(action)) currentPage++;
        if ("previous".equals(action)) currentPage--;

        // Pagination
        int totalQuestions = allQuestions.size();
        int totalPages = (int) Math.ceil((double) totalQuestions / pageSize);

        if (currentPage < 0) currentPage = 0;
        if (currentPage >= totalPages) currentPage = totalPages - 1;

        int start = currentPage * pageSize;
        int end = Math.min(start + pageSize, totalQuestions);

        List<RDQuizQuestion> pageQuestions = allQuestions.subList(start, end);

        model.addAttribute("quiz", quiz);
        model.addAttribute("questions", pageQuestions);
        model.addAttribute("currentPage", currentPage);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("pageSize", pageSize);
        model.addAttribute("selectedAnswers", selectedAnswers);
        model.addAttribute("mode", mode);
        model.addAttribute("showHeaderFooter", showHeaderFooter);

        return "quizzes/take";
    }



    // ------------------------------------------------
    // SUBMIT QUIZ — SCORE + ANALYSIS + SAVE RESULTS
    // ------------------------------------------------
    @PostMapping("/submit")
    public String submitQuiz(
            @RequestParam Map<String, String> answers,
            Model model,
            HttpSession session
    ) {

        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        int quizId = Integer.parseInt(answers.get("quizId"));

        RDQuiz quiz = quizService.findById(quizId);
        List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);
        List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);

        Map<Integer, String> selectedAnswers =
                (Map<Integer, String>) session.getAttribute("selectedAnswers");

        if (selectedAnswers == null)
            selectedAnswers = new HashMap<>();

        int correctCount = 0;
        int pointsEarned = 0;
        int pointsPerCorrect = 10;

        List<Map<String, Object>> questionAnalysis = new ArrayList<>();

        // =====================================================
        // Evaluate Quiz
        // =====================================================
        for (RDQuizQuestion q : quizQuestions) {

            String chosen = selectedAnswers.get(q.getQuestionId());

            boolean isCorrect = false;
            String correctAnswerText = q.getCorrectAnswer();

            String selectedAnswerText = "Not Attempted";   // UI
            String selectedAnswerToStore = null;            // DB

            // -------------------------------------------------
            // UNATTEMPTED
            // -------------------------------------------------
            if (chosen == null || chosen.trim().isEmpty()) {

                RDUserQuizAnswer ua = new RDUserQuizAnswer();
                ua.setQuizId(quizId);
                ua.setUserId(currentUser.getUserID());
                ua.setQuestionId(q.getQuestionId());
                ua.setUserAnswer(null);
                ua.setCorrect(false);
                ua.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                userQuizAnswerService.saveOrUpdate(ua);

                Map<String, Object> entry = new HashMap<>();
                entry.put("question", q.getQuestionText());
                entry.put("selectedAnswer", selectedAnswerText);
                entry.put("correctAnswer", correctAnswerText);
                entry.put("isCorrect", false);
                questionAnalysis.add(entry);

                continue;
            }

            // -------------------------------------------------
            // ATTEMPTED
            // -------------------------------------------------
            switch (q.getQuestionType()) {

                // ===================== MCQ =====================
                case "multiple_choice":

                    int selectedOptionId = Integer.parseInt(chosen);
                    selectedAnswerToStore = chosen; // ✅ store optionId

                    RDQuizOption correctOption = q.getOptions()
                            .stream()
                            .filter(RDQuizOption::isCorrect)
                            .findFirst()
                            .orElse(null);

                    if (correctOption != null) {
                        isCorrect = correctOption.getOptionId() == selectedOptionId;
                        correctAnswerText = correctOption.getOptionText();
                    }

                    RDQuizOption selectedOption = q.getOptions()
                            .stream()
                            .filter(op -> op.getOptionId() == selectedOptionId)
                            .findFirst()
                            .orElse(null);

                    if (selectedOption != null) {
                        selectedAnswerText = selectedOption.getOptionText();
                    }

                    break;

                // ===================== TEXT =====================
                case "true_false":
                case "fill_in_the_blank":
                case "short_answer":

                    selectedAnswerToStore = chosen;
                    selectedAnswerText = chosen;

                    if (q.getCorrectAnswer() != null) {
                        isCorrect = chosen.trim()
                                .equalsIgnoreCase(q.getCorrectAnswer().trim());
                    }
                    break;

                // ===================== LONG =====================
                case "long_answer":

                    selectedAnswerToStore = chosen;
                    selectedAnswerText = chosen;
                    isCorrect = true; // manual evaluation later
                    break;
            }

            if (isCorrect) {
                correctCount++;
                pointsEarned += pointsPerCorrect;
            }

            // -------------------------------------------------
            // Save answer
            // -------------------------------------------------
            RDUserQuizAnswer ua = new RDUserQuizAnswer();
            ua.setQuizId(quizId);
            ua.setUserId(currentUser.getUserID());
            ua.setQuestionId(q.getQuestionId());
            ua.setUserAnswer(selectedAnswerToStore);
            ua.setCorrect(isCorrect);
            ua.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            userQuizAnswerService.saveOrUpdate(ua);

            // -------------------------------------------------
            // Review data
            // -------------------------------------------------
            Map<String, Object> entry = new HashMap<>();
            entry.put("question", q.getQuestionText());
            entry.put("selectedAnswer", selectedAnswerText);
            entry.put("correctAnswer", correctAnswerText);
            entry.put("isCorrect", isCorrect);
            questionAnalysis.add(entry);
        }

        // =====================================================
        // SAVE RESULT
        // =====================================================
        boolean passed = ((double) correctCount / quizQuestions.size()) >= 0.7;

        RDUserQuizResults result = new RDUserQuizResults();
        result.setQuiz(quiz);
        result.setUser(currentUser);
        result.setScore(correctCount);
        result.setPassed(passed);
        result.setPointsEarned(pointsEarned);
        result.setStartTime(LocalDateTime.now());
        result.setEndTime(LocalDateTime.now());
        result.setCompletionTime(0);

        quizResultService.saveOrUpdate(result);

        // Reward points
        userPointsService.addPoints(currentUser, pointsEarned);

        // Refresh session user
        currentUser = userService.getRDUser(currentUser.getUserID());
        session.setAttribute("rdUser", currentUser);

        // =====================================================
        // UI Stats
        // =====================================================
        int totalQ = quizQuestions.size();
        double percentage = Math.round((correctCount * 100.0 / totalQ) * 10.0) / 10.0;

        model.addAttribute("correctAnswers", correctCount);
        model.addAttribute("totalQuestions", totalQ);
        model.addAttribute("percentage", percentage);
        model.addAttribute("passed", passed);
        model.addAttribute("pointsEarned", pointsEarned);
        model.addAttribute("questionAnalysis", questionAnalysis);
        model.addAttribute("quizResult", result);
        model.addAttribute("isReview", false); // 🔴 IMPORTANT


        session.removeAttribute("selectedAnswers");

        return "quizzes/result";
    }


}
