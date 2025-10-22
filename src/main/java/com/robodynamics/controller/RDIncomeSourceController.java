package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.robodynamics.model.RDIncomeSource;
import com.robodynamics.service.RDIncomeSourceService;

@Controller
@RequestMapping("/finance/income-source")
public class RDIncomeSourceController {

    @Autowired
    private RDIncomeSourceService incomeSourceService;

    // 1️⃣ List all sources
    @GetMapping
    public String listSources(Model model) {
        List<RDIncomeSource> sources = incomeSourceService.getAll();
        model.addAttribute("sources", sources);
        model.addAttribute("title", "Income Sources");
        return "finance/income_source_list";  // JSP name
    }

    // 2️⃣ Show new form
    @GetMapping("/new")
    public String showNewForm(Model model) {
        model.addAttribute("incomeSource", new RDIncomeSource());
        model.addAttribute("title", "Add Income Source");
        return "finance/income_source_form";
    }

    // 3️⃣ Save new source
    @PostMapping("/save")
    public String saveSource(@ModelAttribute RDIncomeSource incomeSource, RedirectAttributes redirect) {
        incomeSourceService.save(incomeSource);
        redirect.addFlashAttribute("success", "Income source added successfully!");
        return "redirect:/finance/income-source";
    }

    // 4️⃣ Edit existing
    @GetMapping("/edit/{id}")
    public String editSource(@PathVariable("id") int id, Model model) {
        RDIncomeSource source = incomeSourceService.getById(id);
        model.addAttribute("incomeSource", source);
        model.addAttribute("title", "Edit Income Source");
        return "finance/income_source_form";
    }

    // 5️⃣ Delete
    @GetMapping("/delete/{id}")
    public String deleteSource(@PathVariable("id") int id, RedirectAttributes redirect) {
        incomeSourceService.delete(id);
        redirect.addFlashAttribute("success", "Income source deleted successfully!");
        return "redirect:/finance/income-source";
    }
}
