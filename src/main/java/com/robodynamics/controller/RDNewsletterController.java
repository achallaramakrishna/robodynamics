package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.robodynamics.model.RDNewsletterIssue;
import com.robodynamics.service.RDContentRadarService;

@Controller
public class RDNewsletterController {

    @Autowired
    private RDContentRadarService contentRadarService;

    @GetMapping("/newsletter/issue/{issueId}")
    public String viewIssue(@PathVariable("issueId") Long issueId, Model model) {
        RDNewsletterIssue issue = contentRadarService.getNewsletterIssue(issueId);
        if (issue == null) {
            return "redirect:/blog";
        }
        model.addAttribute("issue", issue);
        model.addAttribute("title", issue.getTitle());
        return "newsletter-issue";
    }

    @GetMapping("/newsletter/latest")
    public String latestIssue() {
        List<RDNewsletterIssue> issues = contentRadarService.getLatestNewsletterIssues(1);
        if (issues == null || issues.isEmpty() || issues.get(0) == null || issues.get(0).getIssueId() == null) {
            return "redirect:/blog";
        }
        return "redirect:/newsletter/issue/" + issues.get(0).getIssueId();
    }
}
