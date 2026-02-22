package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDLabManual;
import com.robodynamics.service.RDLabManualService;

@Controller("rdLabManualController")
@RequestMapping("/admin/labmanual")
public class RDLabManualController {

    @Autowired
    private RDLabManualService labManualService;

    // Show upload form
    @GetMapping("/upload-form")
    public String uploadForm(@RequestParam(required = false) Integer sessionDetailId,
                             Model model) {
        model.addAttribute("sessionDetailId", sessionDetailId);
        return "admin/labmanual/upload";
    }

    // Upload JSON Lab Manual
    @PostMapping("/upload")
    public String upload(
            @RequestParam("labManualJson") String labManualJson,
            @RequestParam("createdBy") Integer createdBy
    ) {

        Integer labManualId = labManualService.uploadLabManual(labManualJson, createdBy);

        return "redirect:/admin/labmanual/view?labManualId=" + labManualId;
    }

    // View
    @GetMapping("/view")
    public String view(@RequestParam Integer labManualId,
                       Model model) {

        RDLabManual manual = labManualService.getById(labManualId);
        model.addAttribute("manual", manual);

        return "admin/labmanual/view";
    }

    // List by sessionDetail
    @GetMapping("/list")
    public String list(@RequestParam Integer sessionDetailId,
                       Model model) {

        List<RDLabManual> manuals =
                labManualService.listBySessionDetail(sessionDetailId);

        model.addAttribute("manuals", manuals);
        model.addAttribute("sessionDetailId", sessionDetailId);

        return "admin/labmanual/list";
    }

    // Delete
    @PostMapping("/delete")
    public String delete(@RequestParam Integer labManualId,
                         @RequestParam Integer sessionDetailId) {

        labManualService.delete(labManualId);
        return "redirect:/admin/labmanual/list?sessionDetailId=" + sessionDetailId;
    }
}
