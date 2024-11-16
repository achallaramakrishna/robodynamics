package com.robodynamics.controller;

import com.robodynamics.model.RDPastExamPaper;
import com.robodynamics.service.RDPastExamPaperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/pastexampapers")
public class RDPastExamPaperController {

    @Autowired
    private RDPastExamPaperService pastExamPaperService;

    @GetMapping("/managePastExamPapers")
    public String showManageAndUploadPage(@RequestParam(value = "year", required = false) Integer year,
                                          @RequestParam(value = "exam", required = false) Integer examId,
                                          Model model) {
        List<Integer> years = pastExamPaperService.getDistinctYears();
        List<String> exams = pastExamPaperService.getExamList();
        List<RDPastExamPaper> pastExamPapers = pastExamPaperService.findExamPapersByFilters(year, examId);

        model.addAttribute("years", years);
        model.addAttribute("exams", exams);
        model.addAttribute("pastExamPapers", pastExamPapers);
        return "pastexampapers/manageAndUploadPastExamPapers"; // Directly return view name without redirecting
    }

    @PostMapping("/upload")
    public String uploadPastExamPaper(@RequestParam("jsonFile") MultipartFile jsonFile, RedirectAttributes redirectAttributes) {
        try {
            pastExamPaperService.processJsonFile(jsonFile);
            redirectAttributes.addFlashAttribute("message", "File uploaded and processed successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error processing file: " + e.getMessage());
        }
        return "redirect:/pastexampapers/managePastExamPapers";
    }

    @GetMapping("/view")
    public String viewExamPaper(@RequestParam("examPaperId") int examPaperId, Model model) {
        RDPastExamPaper pastExamPaper = pastExamPaperService.findExamPaperById(examPaperId);
        model.addAttribute("pastExamPaper", pastExamPaper);
        return "pastexampapers/viewPastExamPaper";
    }
}
