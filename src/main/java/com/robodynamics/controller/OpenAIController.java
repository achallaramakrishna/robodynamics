package com.robodynamics.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.service.OpenAIService;

@RestController
@RequestMapping("/api/ai")
public class OpenAIController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/ask")
    public String askAI(@RequestParam String prompt) {
        try {
            return openAIService.getResponseFromOpenAI(prompt);
        } catch (Exception e) {
        	e.printStackTrace();
            return "Error: Unable to process your request at the moment.";
        }
    }
}
