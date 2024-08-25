package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDFillInBlankQuestionService;
import com.robodynamics.service.RDSlideService;

@Controller
@RequestMapping("/fbquiz")
public class RDFillInBlankQuestionController {
	 	
		@Autowired
	    private RDFillInBlankQuestionService questionService;
		
		@Autowired
	    private RDSlideService slideService;

	    @GetMapping("/questions/{slideId}")
	    public String listQuestions(@PathVariable("slideId") int slideId, Model model) {
	        List<RDFillInBlankQuestion> questions = questionService.getQuestionsBySlideId(slideId);
	        model.addAttribute("questions", questions);
	        return "fbquiz/questions";
	    }

	    @GetMapping("/addQuestion/{slideId}")
	    public String addQuestionForm(@PathVariable("slideId") int slideId, Model model) {
	    	
	    	
	    	RDFillInBlankQuestion question = new RDFillInBlankQuestion();
	    	RDSlide slide = slideService.getSlideById(slideId);
	    	
	        question.setSlide(slide);
	        model.addAttribute("question", question);
	        return "fbquiz/addQuestion";
	    }

	    @PostMapping("/addQuestion")
	    public String addQuestion(@ModelAttribute("question") RDFillInBlankQuestion question) {
	        questionService.saveRDFillInBlankQuestion(question);
	        return "redirect:/fbquiz/questions/" + question.getSlide().getSlideId();
	    }

}
