package com.robodynamics.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestionAnswerForm;
import com.robodynamics.model.RDQuizResult;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDResultService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/quiz")
public class RDQuizController {
    @Autowired
    private RDQuizQuestionService quizQuestionService;
    
    @Autowired
    private RDQuizQuestionService quizService;
    
    
    @Autowired
    private RDResultService resultService;

    @Autowired
    private RDUserService userService;

    
    @GetMapping("/take")
    public String takeQuiz(Model model, @RequestParam("quiz_id") int quizId, HttpSession session) throws JsonProcessingException {
        List<RDQuizQuestion> quizQuestions = quizQuestionService.getRDQuizQuestions(quizId);
        model.addAttribute("quizQuestions", quizQuestions);
        model.addAttribute("currentQuizQuestion", quizQuestions.get(0)); // Start with the first quiz question
        session.setAttribute("quizQuestionsList", quizQuestions);
        session.setAttribute("currentQuizIndex", 0);
        
        ObjectMapper mapper = new ObjectMapper();
        String quizQuestionsJson = mapper.writeValueAsString(quizQuestions);
        model.addAttribute("quizQuestions", quizQuestionsJson); // Pass quizzes as JSON string
        // Add an empty QuizAnswerForm to the model
        model.addAttribute("quizQuestionAnswerForm", new RDQuizQuestionAnswerForm());
        return "takeQuiz";
    }

    @PostMapping("/submit")
    public String submitQuiz(@ModelAttribute("quizQuestionAnswerForm") RDQuizQuestionAnswerForm quizQuestionAnswerForm, HttpSession session, Model model) {
        
    	int currentQuizIndex = (int) session.getAttribute("currentQuizIndex");
        List<RDQuizQuestion> quizQuestionsList = (List<RDQuizQuestion>) session.getAttribute("quizQuestionsList");
        RDQuizQuestion quizQuestion = quizQuestionsList.get(currentQuizIndex);

        // Retrieve the user from session or a default user for now
        RDUser user = (RDUser) session.getAttribute("rdUser");

        // Create a result object
        RDQuizResult result = new RDQuizResult();
        result.setUser(user);
        result.setQuizQuestion(quizQuestion);
        result.setUserAnswer(quizQuestionAnswerForm.getUserAnswer());
        result.setCorrect(quizQuestion.getCorrectAnswer().equals(quizQuestionAnswerForm.getUserAnswer()));

        // Save the result
        resultService.saveRDResult(result);

        System.out.println("currentQuizIndex - " + currentQuizIndex);
        System.out.println("size minus 1 - " + (quizQuestionsList.size()));
        // Prepare for next quiz question
        if (currentQuizIndex < quizQuestionsList.size() - 1) {
        	System.out.println("hello 1 ");
            session.setAttribute("currentQuizIndex", currentQuizIndex + 1);
            
            model.addAttribute("currentQuizQuestion", quizQuestionsList.get(currentQuizIndex + 1));
            return "takeQuiz";
        } else {
            // If it's the last question, display results
        	System.out.println("hello 2 last question");
            return "redirect:/results/view";
        }
    }
    
    
    @GetMapping("/takeQuiz")
    public String takeQuiz(Model theModel) {
        List < RDQuizQuestion > quizQuestions = quizQuestionService.getRDQuizQuestions();
        System.out.println("Number of quizzes - " + quizQuestions.size());
        theModel.addAttribute("quiz question", quizQuestions);
        
        theModel.addAttribute("currentQuizQuestion", quizQuestions.get(0)); // Start with the first quiz question
        return "takeQuiz";
    }
    
    @GetMapping("/quizquesitons")
    @ResponseBody
    public List<RDQuizQuestion> getAllQuizQuestions() {
        return quizQuestionService.getRDQuizQuestions();
    }

	@PostMapping("/createQuizQuestion")
    @ResponseBody
    public void createQuizQuestion(@RequestBody RDQuizQuestion quizQuestion) {
        quizQuestionService.saveRDQuizQuestion(quizQuestion);
    }
}
