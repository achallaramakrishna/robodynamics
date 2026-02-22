package com.robodynamics.controller;

import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDLabManual;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDLabManualService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/student/labmanual")
public class RDLabManualStudentController {

    @Autowired
    private RDLabManualService labManualService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    /** List all lab manuals for a course session */
    @GetMapping("/session/{sessionId}")
    public String listForSession(@PathVariable Integer sessionId,
                                 @RequestParam(required = false) Integer enrollmentId,
                                 Model model) {
        List<RDLabManual> manuals = labManualService.listBySessionId(sessionId);

        // If no DB-backed lab manuals, check for JSON-backed CMS content
        if (manuals == null || manuals.isEmpty()) {
            List<RDCourseSessionDetail> jsonDetails =
                    courseSessionDetailService.getBySessionAndType(sessionId, "labmanual");
            boolean hasJsonLab = jsonDetails.stream()
                    .anyMatch(d -> d.getFile() != null && !d.getFile().trim().isEmpty());
            if (hasJsonLab) {
                return "redirect:/student/content/list/" + sessionId
                        + "/labmanual?enrollmentId=" + enrollmentId;
            }
        }

        model.addAttribute("manuals", manuals);
        model.addAttribute("sessionId", sessionId);
        model.addAttribute("enrollmentId", enrollmentId);
        return "student/lab-manual-list";
    }

    /** View a single lab manual */
    @GetMapping("/{labManualId}")
    public String view(@PathVariable Integer labManualId,
                       @RequestParam(required = false) Integer enrollmentId,
                       Model model) {
        RDLabManual manual = labManualService.getById(labManualId);
        if (manual == null) {
            model.addAttribute("error", "Lab manual not found.");
            return "error";
        }
        model.addAttribute("manual", manual);
        model.addAttribute("enrollmentId", enrollmentId);
        return "student/lab-manual-view";
    }
}
