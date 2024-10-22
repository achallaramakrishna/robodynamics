package com.robodynamics.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/speech")
public class RDSpeechController {

	@GetMapping("/view")
	public String getSpeech(Model model) {
		
		return "speech/view";
	}
}
