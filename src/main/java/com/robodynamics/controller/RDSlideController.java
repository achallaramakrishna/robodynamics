package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDSlideService;

@Controller
@RequestMapping("/slide")
public class RDSlideController {
	@Autowired
    private RDSlideService slideService;

    @GetMapping("/list")
    public String listSlides(Model model) {
        List<RDSlide> slides = slideService.getAllSlides();
        model.addAttribute("slides", slides);
        return "slide/list";
    }

    @GetMapping("/view/{id}")
    public String viewSlide(@PathVariable("id") int id, Model model) {
    	RDSlide slide = slideService.getSlideById(id);
        model.addAttribute("slide", slide);
        return "slide/view";
    }

    @GetMapping("/add")
    public String addSlideForm(Model model) {
        model.addAttribute("slide", new RDSlide());
        return "slide/add";
    }

    @PostMapping("/add")
    public String addSlide(@ModelAttribute("slide") RDSlide slide) {
        slideService.saveRDSlide(slide);
        return "redirect:/slide/list";
    }

}
