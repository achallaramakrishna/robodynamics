package com.robodynamics.controller;

import com.robodynamics.model.RDResult;
import com.robodynamics.service.RDResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/result")
public class RDResultController {
    @Autowired
    private RDResultService resultService;

    @GetMapping("/results")
    @ResponseBody
    public List<RDResult> getAllResults() {
        return resultService.getRDResults();
    }

    @PostMapping("/createResult")
    @ResponseBody
    public void createResult(@RequestBody RDResult result) {
        resultService.saveRDResult(result);;
    }
}
