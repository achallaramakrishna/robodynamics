package com.robodynamics.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ui.Model;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.robodynamics.model.RDQuizAnswerForm;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDResult;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDResultService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/quiz")
public class RDQuizController {
    @Autowired
    private RDQuizService quizService;
    
    @Autowired
    private RDResultService resultService;

    @Autowired
    private RDUserService userService;

    @GetMapping("/take")
    public String takeQuiz(Model model, HttpSession session) throws JsonProcessingException {
        List<RDQuiz> quizzes = quizService.getRDQuizes();
        model.addAttribute("quizzes", quizzes);
        model.addAttribute("currentQuiz", quizzes.get(0)); // Start with the first quiz question
        session.setAttribute("quizList", quizzes);
        session.setAttribute("currentQuizIndex", 0);
        
        ObjectMapper mapper = new ObjectMapper();
        String quizzesJson = mapper.writeValueAsString(quizzes);
        model.addAttribute("quizzes", quizzesJson); // Pass quizzes as JSON string
        // Add an empty QuizAnswerForm to the model
        model.addAttribute("quizAnswerForm", new RDQuizAnswerForm());
        return "takeQuiz";
    }

    @PostMapping("/submit")
    public String submitQuiz(@ModelAttribute("quizAnswerForm") RDQuizAnswerForm quizAnswerForm, HttpSession session, Model model) {
        int currentQuizIndex = (int) session.getAttribute("currentQuizIndex");
        List<RDQuiz> quizzes = (List<RDQuiz>) session.getAttribute("quizList");
        RDQuiz quiz = quizzes.get(currentQuizIndex);

        // Retrieve the user from session or a default user for now
        RDUser user = (RDUser) session.getAttribute("rdUser");

        // Create a result object
        RDResult result = new RDResult();
        result.setUser(user);
        result.setQuiz(quiz);
        result.setUserAnswer(quizAnswerForm.getUserAnswer());
        result.setCorrect(quiz.getCorrectAnswer().equals(quizAnswerForm.getUserAnswer()));

        // Save the result
        resultService.saveRDResult(result);

        // Prepare for next quiz question
        if (currentQuizIndex < quizzes.size() - 1) {
            session.setAttribute("currentQuizIndex", currentQuizIndex + 1);
            model.addAttribute("currentQuiz", quizzes.get(currentQuizIndex + 1));
            return "takeQuiz";
        } else {
            // If it's the last question, display results
            return "redirect:/results/view";
        }
    }
    
    
    @GetMapping("/takeQuiz")
    public String takeQuiz(Model theModel) {
        List < RDQuiz > quizzes = quizService.getRDQuizes();
        System.out.println("Number of quizzes - " + quizzes.size());
        theModel.addAttribute("quizzes", quizzes);
        
        theModel.addAttribute("currentQuiz", quizzes.get(0)); // Start with the first quiz question
        return "takeQuiz";
    }
    
    @GetMapping("/quizzes")
    @ResponseBody
    public List<RDQuiz> getAllQuizzes() {
        return quizService.getRDQuizes();
    }

	@PostMapping("/createQuiz")
    @ResponseBody
    public void createQuiz(@RequestBody RDQuiz quiz) {
        quizService.saveRDQuiz(quiz);
    }
}
