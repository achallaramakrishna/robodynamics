package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDExpenseCategory;
import com.robodynamics.service.RDExpenseCategoryService;

@Controller
@RequestMapping("/finance/expense-categories")
public class RDExpenseCategoryController {

    @Autowired
    private RDExpenseCategoryService expenseCategoryService;

    @GetMapping
    public String listCategories(Model model) {
        List<RDExpenseCategory> categories = expenseCategoryService.findAll();
        model.addAttribute("categories", categories);
        model.addAttribute("newCategory", new RDExpenseCategory());
        return "finance/expense_category_list";
    }

    @PostMapping("/save")
    public String saveCategory(@ModelAttribute("newCategory") RDExpenseCategory category) {
        if (category.getCategoryId() == null)
            expenseCategoryService.save(category);
        else
            expenseCategoryService.update(category);
        return "redirect:/finance/expense-categories";
    }

    @GetMapping("/edit")
    public String editCategory(@RequestParam("id") Integer id, Model model) {
        RDExpenseCategory cat = expenseCategoryService.findById(id);
        model.addAttribute("newCategory", cat);
        model.addAttribute("categories", expenseCategoryService.findAll());
        return "finance/expense_category_list";
    }

    @GetMapping("/delete")
    public String deleteCategory(@RequestParam("id") Integer id) {
        expenseCategoryService.delete(id);
        return "redirect:/finance/expense-categories";
    }
}
