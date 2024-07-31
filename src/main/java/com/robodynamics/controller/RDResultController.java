package com.robodynamics.controller;

import com.robodynamics.model.RDResult;
import com.robodynamics.service.RDResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/results")
public class RDResultController {
    @Autowired
    private RDResultService resultService;

    @GetMapping("/results")
    @ResponseBody
    public List<RDResult> getAllResults() {
        return resultService.getRDResults();
    }
    
    @GetMapping("/view")
    public String viewResults(Model model) {
        List<RDResult> results = resultService.getRDResults();
        System.out.println(results);
        model.addAttribute("results", results);
        return "results";
    }

    @PostMapping("/createResult")
    @ResponseBody
    public void createResult(@RequestBody RDResult result) {
        resultService.saveRDResult(result);;
    }
}
