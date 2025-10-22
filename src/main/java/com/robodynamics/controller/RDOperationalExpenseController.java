package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDOperationalExpense;
import com.robodynamics.model.RDExpenseCategory;
import com.robodynamics.service.RDOperationalExpenseService;
import com.robodynamics.service.RDExpenseCategoryService;

@Controller
@RequestMapping("/finance/expenses")
public class RDOperationalExpenseController {

    @Autowired
    private RDOperationalExpenseService expenseService;

    @Autowired
    private RDExpenseCategoryService categoryService;

    @GetMapping
    public String listExpenses(Model model) {
        List<RDOperationalExpense> expenses = expenseService.findAll();
        List<RDExpenseCategory> categories = categoryService.findAll();

        model.addAttribute("expenses", expenses);
        model.addAttribute("categories", categories);
        model.addAttribute("newExpense", new RDOperationalExpense());
        return "finance/operational_expense_list";
    }

    @PostMapping("/save")
    public String saveExpense(@ModelAttribute("newExpense") RDOperationalExpense expense) {
        if (expense.getExpenseId() == null)
            expenseService.save(expense);
        else
            expenseService.update(expense);
        return "redirect:/finance/expenses";
    }

    @GetMapping("/edit")
    public String editExpense(@RequestParam("id") Integer id, Model model) {
        RDOperationalExpense expense = expenseService.findById(id);
        model.addAttribute("newExpense", expense);
        model.addAttribute("expenses", expenseService.findAll());
        model.addAttribute("categories", categoryService.findAll());
        return "finance/operational_expense_list";
    }

    @GetMapping("/delete")
    public String deleteExpense(@RequestParam("id") Integer id) {
        expenseService.delete(id);
        return "redirect:/finance/expenses";
    }
}
