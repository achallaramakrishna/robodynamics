package com.robodynamics.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.service.RDFinanceDashboardService;

@Controller
public class RDFinanceDashboardController {

    @Autowired
    private RDFinanceDashboardService financeDashboardService;

    /**
     * Displays the Finance Dashboard for admins.
     * Shows total income, expenses, net profit,
     * and breakdown charts for income and expenses.
     */
    @GetMapping("/finance/dashboard")
    public String showFinanceDashboard(
            @RequestParam(value = "month", required = false) String month,
            Model model) {

        // ✅ Default to current month if not provided (e.g., "2025-10")
        if (month == null || month.isEmpty()) {
            java.time.LocalDate now = java.time.LocalDate.now();
            month = now.getYear() + "-" + String.format("%02d", now.getMonthValue());
        }

        // 1️⃣ Fetch core monthly summary (Income, Expense, Profit, Margin)
        Map<String, Double> summary = financeDashboardService.getDashboardSummary(month);
        model.addAttribute("summary", summary);

        // 2️⃣ Fetch chart breakdowns for that month
        Map<String, Double> incomeBySource = financeDashboardService.getIncomeBySource(month);
        Map<String, Double> expenseByCategory = financeDashboardService.getExpenseByCategory(month);

        model.addAttribute("incomeBySource", incomeBySource);
        model.addAttribute("expenseByCategory", expenseByCategory);

        // 3️⃣ Add selected month for JSP display and filtering
        model.addAttribute("month", month);
        model.addAttribute("title", "Finance Dashboard - Robo Dynamics");

        return "finance/finance_dashboard";
    }

}
