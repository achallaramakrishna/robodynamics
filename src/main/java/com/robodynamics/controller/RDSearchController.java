package com.robodynamics.controller;

import com.robodynamics.dto.RDSearchResultDTO;
import com.robodynamics.service.RDSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class RDSearchController {

    @Autowired
    private RDSearchService searchService;

    // ✅ 1. Show Search Page
    @GetMapping("/search")
    public String searchPage(Model model) {
        model.addAttribute("grades", Arrays.asList("4", "5", "6", "7", "8", "9", "10"));
        return "search";
    }

    // ✅ 2. Process Search Results
    @GetMapping("/search/results")
    public String searchResults(@RequestParam Map<String, String> filters, Model model) {
        List<RDSearchResultDTO> results = searchService.advancedSearch(filters);
        model.addAttribute("results", results);
        model.addAttribute("grades", Arrays.asList("4", "5", "6", "7", "8", "9", "10"));
        return "search"; // Reuse same JSP to show results
    }
}
