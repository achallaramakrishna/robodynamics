package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDOtherIncome;
import com.robodynamics.model.RDIncomeSource;
import com.robodynamics.service.RDOtherIncomeService;
import com.robodynamics.service.RDIncomeSourceService;

@Controller
@RequestMapping("/finance/other-income")
public class RDOtherIncomeController {

    @Autowired
    private RDOtherIncomeService otherIncomeService;

    @Autowired
    private RDIncomeSourceService incomeSourceService;

    @GetMapping
    public String listOtherIncomes(Model model) {
        List<RDOtherIncome> incomes = otherIncomeService.findAll();
        List<RDIncomeSource> sources = incomeSourceService.getAll();

        model.addAttribute("incomes", incomes);
        model.addAttribute("sources", sources);
        model.addAttribute("newIncome", new RDOtherIncome());
        return "finance/other_income_list";
    }

    @PostMapping("/save")
    public String saveOtherIncome(@ModelAttribute("newIncome") RDOtherIncome income) {
        if (income.getIncomeId() == null) {
            otherIncomeService.save(income);
        } else {
            otherIncomeService.update(income);
        }
        return "redirect:/finance/other-income";
    }

    @GetMapping("/edit")
    public String editIncome(@RequestParam("id") Integer id, Model model) {
        RDOtherIncome income = otherIncomeService.findById(id);
        model.addAttribute("newIncome", income);
        model.addAttribute("incomes", otherIncomeService.findAll());
        model.addAttribute("sources", incomeSourceService.getAll());
        return "finance/other_income_list";
    }

    @GetMapping("/delete")
    public String deleteIncome(@RequestParam("id") Integer id) {
        otherIncomeService.delete(id);
        return "redirect:/finance/other-income";
    }
}
