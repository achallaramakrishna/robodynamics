package com.robodynamics.dao;

import java.util.Map;

public interface RDFinanceDashboardDao {

    /**
     * Returns summarized financial metrics for the dashboard:
     * - total income
     * - total expense
     * - net profit
     */
    Map<String, Double> getDashboardSummary();

    /**
     * Returns income by category or source for charts.
     */
    Map<String, Double> getIncomeBySource();

    /**
     * Returns expense by category for charts.
     */
    Map<String, Double> getExpenseByCategory();

	Map<String, Double> getExpenseByCategory(String month);

	Map<String, Double> getIncomeBySource(String month);

	Map<String, Double> getDashboardSummary(String month);
}
