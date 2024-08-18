package com.robodynamics.controller;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizTest;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDAssetCategoryService;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDQuizTestService;
import com.robodynamics.service.RDResultService;

import java.util.*;

@Controller
@RequestMapping("/quiztest")
public class RDQuizTestController {

	@Autowired
    private RDQuizQuestionService quizQuestionService;
	
	@Autowired
    private RDQuizService quizService;

    @Autowired
    private RDQuizTestService quizTestService;
    
    @Autowired
    private RDResultService resultService;
    
    @GetMapping("/start")
    public String showQuizDetails(@RequestParam("quiz_id") int quizId, 
    		Model model, HttpSession session) {
    	
    	
       RDQuiz quiz = quizService.getRDQuiz(quizId);
       
       
        model.addAttribute("quiz", quiz);
        return "startQuiz";
    }
    
    @PostMapping("/{quizId}/start")
    public String startQuiz(@PathVariable int quizId,
    		Model model, HttpSession session) {
        // Insert a new record into rd_quiz_test
    	
    	RDUser user = null;
		if (session.getAttribute("rdUser") != null) {
			user = (RDUser) session.getAttribute("rdUser");
		}

		System.out.println("user - " + user);

		
        RDQuizTest quizTest = new RDQuizTest();
        
        RDQuiz quiz = quizService.getRDQuiz(quizId);

        quizTest.setQuiz(quiz);
        quizTest.setCreationDate(new Date());
        quizTest.setActive(1);
        quizTestService.saveRDQuizTest(quizTest);
        
        resultService.updatePreviousTestResults(quizId, user.getUserID());
        
        
        
        // Redirect to the quiz question page
        return "redirect:/quiz/test/" + quizTest.getQuizTestId();
    }
    
    @GetMapping("/quiz/tests")
    public String manageTests(Model model) {
        List<RDQuizTest> tests = quizTestService.getRDQuizTests();
        model.addAttribute("tests", tests);
        return "manageTests";
    }
    
       
}
