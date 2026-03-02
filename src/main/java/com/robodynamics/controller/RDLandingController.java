package com.robodynamics.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class RDLandingController {

    @GetMapping("/exam-prep")
    public ModelAndView examPrepLanding() {
        return new ModelAndView("exam-prep");
    }

    @GetMapping("/tuition-on-demand")
    public ModelAndView tuitionOnDemand() {
        return new ModelAndView("tuition-on-demand");
    }

    @GetMapping("/aptipath/faq")
    public ModelAndView aptiPathFaq() {
        return new ModelAndView("aptipath-faq");
    }
}
