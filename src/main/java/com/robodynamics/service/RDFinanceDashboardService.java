package com.robodynamics.service;

import java.util.Map;

/**
 * Finance Dashboard Service Interface
 * ------------------------------------
 * Provides summarized and categorized financial data
 * for the Finance Admin Dashboard in Robo Dynamics.
 */
public interface RDFinanceDashboardService {

    /**
     * Returns a summarized view of the financials:
     *  - Total Income
     *  - Total Expense
     *  - Net Profit
     *  - Profit Margin (optional)
     *
     * Example Output:
     * {
     *   "totalIncome": 125000.00,
     *   "totalExpense": 87500.00,
     *   "netProfit": 37500.00,
     *   "profitMargin": 30.0
     * }
     */
    Map<String, Double> getDashboardSummary();

    /**
     * Returns a breakdown of income grouped by source name.
     * e.g. Tuition Fee, Robotics Kit, Workshops, etc.
     *
     * Example Output:
     * {
     *   "Tuition Fee": 65000.00,
     *   "Robotics Kit": 30000.00,
     *   "Workshops": 25000.00
     * }
     */
    Map<String, Double> getIncomeBySource();

    /**
     * Returns a breakdown of expenses grouped by category name.
     * e.g. Rent, Salaries, Utilities, Marketing, etc.
     *
     * Example Output:
     * {
     *   "Salaries": 40000.00,
     *   "Rent": 25000.00,
     *   "Marketing": 10000.00
     * }
     */
    Map<String, Double> getExpenseByCategory();

	Map<String, Double> getDashboardSummary(String month);

	Map<String, Double> getIncomeBySource(String month);

	Map<String, Double> getExpenseByCategory(String month);
}
