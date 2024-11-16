package com.robodynamics.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/math")
public class MathController {

	@GetMapping("/explorer")
    public String showExplorer() {
        return "maths/mathExplorer"; // Returns the name of the JSP file (mathExplorer.jsp)
    }
	
	@GetMapping("/lesson")
    public String showLesson() {
        return "maths/wholeNumber"; // Returns the name of the JSP file (mathExplorer.jsp)
    }
	
	@GetMapping("/test")
    public String showVoices() {
        return "maths/numberExploration"; // Returns the name of the JSP file (mathExplorer.jsp)
    }
	
	@GetMapping("/concept")
    public String showConcept() {
        return "maths/mathConcept"; // Returns the name of the JSP file (mathExplorer.jsp)
    }
	
	@GetMapping("/scene1")
    public String showScene1() {
        return "maths/scene_1"; // Returns the name of the JSP file (mathExplorer.jsp)
    }
}
