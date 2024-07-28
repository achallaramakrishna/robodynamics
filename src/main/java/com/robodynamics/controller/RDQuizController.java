package com.robodynamics.controller;

import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDResult;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDResultService;
import com.robodynamics.service.RDUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import javax.servlet.http.HttpSession;

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
    public String takeQuiz(Model model, HttpSession session) {
        List<RDQuiz> quizzes = quizService.getRDQuizes();
        model.addAttribute("quizzes", quizzes);
        model.addAttribute("currentQuiz", quizzes.get(0)); // Start with the first quiz question
        session.setAttribute("quizList", quizzes);
        session.setAttribute("currentQuizIndex", 0);
        return "takeQuiz";
    }

    @PostMapping("/submit")
    public String submitQuiz(@RequestParam("answer") String answer, HttpSession session, Model model) {
        int currentQuizIndex = (int) session.getAttribute("currentQuizIndex");
        List<RDQuiz> quizzes = (List<RDQuiz>) session.getAttribute("quizList");
        RDQuiz currentQuiz = quizzes.get(currentQuizIndex);
        
        // Retrieve the user from session or a default user for now
        RDUser user = (RDUser) session.getAttribute("rdUser");

        // Create a result object
        RDResult result = new RDResult();
        result.setUser(user);
        result.setQuiz(currentQuiz);
        result.setUserAnswer(answer);
        result.setCorrect(currentQuiz.getCorrectAnswer().equals(answer));

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
