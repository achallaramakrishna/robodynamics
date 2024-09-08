package com.robodynamics.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDQuest;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserQuest;
import com.robodynamics.model.RDUserQuizResults;
import com.robodynamics.service.*;

@Controller
@RequestMapping("/quizzes")
public class RDQuizController {

    @Autowired
    private RDQuizService quizService;

    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @Autowired
    private RDUserQuizResultService quizResultService;

    @Autowired
    private RDUserPointsService userPointsService;

    @Autowired
    private RDUserQuestService userQuestService;

    @Autowired
    private RDQuestService questService;

    // List available quizzes
    @GetMapping
    public String listQuizzes(Model model) {
        List<RDQuiz> quizzes = quizService.findAll();
        model.addAttribute("quizzes", quizzes);
        return "quizzes/list";  // list.jsp to display the available quizzes
    }

    // Start a quiz
    @GetMapping("/start/{quizId}")
    public String startQuiz(@PathVariable int quizId, Model model) {
        RDQuiz quiz = quizService.findById(quizId);
        List<RDQuizQuestion> quizQuestions = quizQuestionService.findByQuizId(quizId);

        if (quizQuestions.isEmpty()) {
            model.addAttribute("message", "No questions available for this quiz.");
            return "quizzes/error";
        }

        model.addAttribute("quiz", quiz);
        model.addAttribute("questions", quizQuestions);
        return "quizzes/take";  // take.jsp to display quiz questions
    }

    @PostMapping("/submit")
    public String submitQuiz(@RequestParam Map<String, String> answers,
    		Model model, HttpSession session) {
        // Extract the quiz ID and user details
        int quizId = Integer.parseInt(answers.get("quizId"));
     

        RDUser currentUser = null;  // Replace with actual logic to get the logged-in user
        if (session.getAttribute("rdUser") != null) {
        	currentUser = (RDUser) session.getAttribute("rdUser");
		}
        RDQuiz quiz = quizService.findById(quizId);
        List<RDQuizQuestion> quizQuestions = quizQuestionService.findByQuizId(quizId);

        if (quizQuestions.isEmpty()) {
            model.addAttribute("message", "No questions available for this quiz.");
            return "quizzes/error";
        }

     // Parse the ISO format startTime from the form
        String startTimeString = answers.get("startTime");
        LocalDateTime localDateTime = LocalDateTime.parse(startTimeString, DateTimeFormatter.ISO_DATE_TIME);
        Timestamp startTime = Timestamp.valueOf(localDateTime);

        // Prepare to store the user's selected answers
        Map<Integer, Integer> selectedAnswers = new HashMap<>();  // Map questionId -> selectedOptionId
        for (RDQuizQuestion question : quizQuestions) {
            String paramName = "question_" + question.getQuestionId();
            if (answers.containsKey(paramName)) {
                try {
                    int selectedOptionId = Integer.parseInt(answers.get(paramName));
                    selectedAnswers.put(question.getQuestionId(), selectedOptionId);
                } catch (NumberFormatException e) {
                    System.out.println("Invalid option selected for question " + question.getQuestionId());
                }
            }
        }

        // Evaluate the quiz and calculate the score
        int correctAnswersCount = 0;
        int pointsEarned = 0;
        int pointsPerCorrectAnswer = 10;  // Adjust this based on your points system

        for (RDQuizQuestion question : quizQuestions) {
            int selectedOptionId = selectedAnswers.getOrDefault(question.getQuestionId(), -1);
            if (question.getCorrectOption().getOptionId() == selectedOptionId) {
                correctAnswersCount++;
                pointsEarned += pointsPerCorrectAnswer;
            }
        }

        // Determine if the user passed (70% threshold)
        boolean passed = (double) correctAnswersCount / quizQuestions.size() >= 0.7;

        // Calculate completion time
        Timestamp endTime = new Timestamp(System.currentTimeMillis());  // Get the current time as end time
        int completionTime = (int) ((endTime.getTime() - startTime.getTime()) / 1000);  // Calculate completion time in seconds

        // Save the quiz result
        RDUserQuizResults quizResult = new RDUserQuizResults();
        quizResult.setUser(currentUser);
        quizResult.setQuiz(quiz);
        quizResult.setScore(correctAnswersCount);
        quizResult.setPassed(passed);
        quizResult.setPointsEarned(pointsEarned);
        quizResult.setStartTime(startTime);  // Track the start time
        quizResult.setEndTime(endTime);  // Track the end time
        quizResult.setCompletionTime(completionTime);  // Track the total time taken to complete the quiz
        quizResult.setCompletedAt(endTime);  // Set the completedAt time
        quizResultService.saveOrUpdate(quizResult);

        // Reward points for completing the quiz
        userPointsService.addPoints(currentUser, pointsEarned);

        // Check for and complete any applicable quests
        completeUserQuests(currentUser, quiz);

        // Pass the result to the view
        model.addAttribute("quizResult", quizResult);
        model.addAttribute("points", pointsEarned);
        model.addAttribute("passed", passed);

        return "quizzes/result";  // Display the quiz result page
    }

    

    // Complete any relevant user quests after submitting the quiz
    private void completeUserQuests(RDUser user, RDQuiz quiz) {
        List<RDQuest> allQuests = questService.findAll();
        for (RDQuest quest : allQuests) {
            boolean isQuestCompleted = false;

            // Example quest conditions (extend this with more specific logic):
            switch (quest.getName()) {
                case "First Quiz Completion":
                    // Check if the user has completed their first quiz
                    isQuestCompleted = userQuestService.findByUserId(user.getUserID()).isEmpty();
                    break;

                case "Five Quizzes Milestone":
                    // Check if the user has completed 5 quizzes
                    int totalQuizzesCompleted = userQuestService.countQuizzesCompletedByUser(user.getUserID());
                    isQuestCompleted = (totalQuizzesCompleted >= 5);
                    break;

                case "Perfect Scorer":
                    // Check if the user scored 100% on this quiz
                    RDUserQuizResults quizResult = quizResultService.findLatestByUserIdAndQuizId(user.getUserID(), quiz.getQuizId());
                    isQuestCompleted = (quizResult.getScore() == quiz.getQuizQuestions().size());
                    break;

                // Add more quest conditions as needed
            }

            // If the user has completed the quest and it's not already marked as completed
            if (isQuestCompleted && !userQuestService.isQuestCompletedByUser(user.getUserID(), quest.getId())) {
                // Mark the quest as completed and reward points
                RDUserQuest userQuest = new RDUserQuest();
                userQuest.setUser(user);
                userQuest.setQuest(quest);
                userQuest.setCompletedAt(new Timestamp(System.currentTimeMillis()));
                userQuestService.saveOrUpdate(userQuest);

                // Reward points for completing the quest
                userPointsService.addPoints(user, quest.getPointsReward());
            }
        }
    }
}
