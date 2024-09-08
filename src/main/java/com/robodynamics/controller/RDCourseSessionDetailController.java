package com.robodynamics.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDSlideService;
import com.robodynamics.service.RDFillInBlankQuestionService;

@Controller
@RequestMapping("/sessiondetail")
public class RDCourseSessionDetailController {

    @Autowired
    private RDSlideService slideService;

    @Autowired
    private RDFillInBlankQuestionService questionService;

    @GetMapping("/start/{sessionDetailId}")
    public String startSession(@PathVariable("sessionDetailId") int sessionDetailId, Model model) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);
        if (!slides.isEmpty()) {
            return showSlide(model, slides, 0, sessionDetailId);
        } else {
            // Handle the case where there are no slides
            model.addAttribute("message", "No slides available for this session.");
            return "error";
        }
    }

    @PostMapping("/navigate")
    public String navigateSlides(@RequestParam("currentSlide") int currentSlide,
                                 @RequestParam("direction") String direction,
                                 @RequestParam("sessionDetailId") int sessionDetailId,
                                 Model model) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);
        if ("next".equals(direction) && currentSlide < slides.size() - 1) {
            currentSlide++;
        } else if ("prev".equals(direction) && currentSlide > 0) {
            currentSlide--;
        }

        return showSlide(model, slides, currentSlide, sessionDetailId);
    }
    
    private String showSlide(Model model, List<RDSlide> slides, int currentSlideIndex, int sessionDetailId) {
        RDSlide slide = slides.get(currentSlideIndex);
        List<RDFillInBlankQuestion> fillInBlankQuestions = questionService.getQuestionsBySlideId(slide.getSlideId());
        System.out.println(fillInBlankQuestions);
        model.addAttribute("slide", slide);
        model.addAttribute("fillInBlankQuestions", fillInBlankQuestions);
        model.addAttribute("currentSlide", currentSlideIndex);
        model.addAttribute("slideCount", slides.size());
        model.addAttribute("sessionDetailId", sessionDetailId);

        return "slideShow";  // JSP name where the slide is displayed
    }
    

    @PostMapping("/submitAnswers")
    public String submitAnswers(@RequestParam Map<String, String> allParams,
                                @RequestParam("slideId") int slideId,
                                @RequestParam("sessionDetailId") int sessionDetailId,
                                Model model) {
        List<RDFillInBlankQuestion> fillInBlankQuestions = questionService.getQuestionsBySlideId(slideId);
        Map<Integer, Boolean> correctness = new HashMap<>();
        Map<Integer, String> submittedAnswers = new HashMap<>();

        for (RDFillInBlankQuestion question : fillInBlankQuestions) {
            String submittedAnswer = allParams.get("answers[" + question.getQuestionId() + "]");
            submittedAnswers.put(question.getQuestionId(), submittedAnswer);
            correctness.put(question.getQuestionId(), question.getAnswer().equalsIgnoreCase(submittedAnswer));
        }

        RDSlide slide = slideService.getSlideById(slideId);

        model.addAttribute("slide", slide);
        model.addAttribute("fillInBlankQuestions", fillInBlankQuestions);
        model.addAttribute("correctness", correctness);
        model.addAttribute("submittedAnswers", submittedAnswers);
        model.addAttribute("sessionDetailId", sessionDetailId);
        model.addAttribute("currentSlide", Integer.parseInt(allParams.get("currentSlide")));
        model.addAttribute("slideCount", slideService.getSlidesBySessionDetailId(sessionDetailId).size());

        return "slideShow";
    }
}
