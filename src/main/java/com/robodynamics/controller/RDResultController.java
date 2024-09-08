package com.robodynamics.controller;

import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizResult;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/results")
public class RDResultController {
    @Autowired
    private RDResultService resultService;

    @GetMapping("/results")
    @ResponseBody
    public List<RDQuizResult> getAllResults() {
        return resultService.getRDResults();
    }
    
    @GetMapping("/view")
    public String viewResults(Model model, HttpSession session) {
    	
    	RDUser rdUser = null;
    	RDQuiz quiz = null;	
        
        System.out.println("hello 111");
		if (session.getAttribute("rdUser") != null) 
			rdUser = (RDUser) session.getAttribute("rdUser");
			
		System.out.println("hello 111");
			if (session.getAttribute("quiz") != null) 
				quiz = (RDQuiz) session.getAttribute("quiz");
			
        List<RDQuizResult> results = 
        		resultService.getUserResultsForQuiz(quiz.getQuizId(), rdUser.getUserID(), 0);
        System.out.println(results);
        model.addAttribute("results", results);
        return "results";
    }
    

    @PostMapping("/createResult")
    @ResponseBody
    public void createResult(@RequestBody RDQuizResult result) {
        resultService.saveRDResult(result);;
    }
}
