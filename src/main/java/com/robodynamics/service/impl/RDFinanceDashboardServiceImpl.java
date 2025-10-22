package com.robodynamics.service.impl;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFinanceDashboardDao;
import com.robodynamics.service.RDFinanceDashboardService;

/**
 * Service layer for Robo Dynamics Finance Dashboard.
 * Fetches summarized income, expense, and profit data,
 * along with income/expense breakdowns for charts.
 */
@Service
@Transactional
public class RDFinanceDashboardServiceImpl implements RDFinanceDashboardService {

    @Autowired
    private RDFinanceDashboardDao financeDashboardDao;

    /**
     * Returns summarized financial metrics:
     * total income, total expense, and net profit.
     */
    @Override
    public Map<String, Double> getDashboardSummary() {
        Map<String, Double> summary = new LinkedHashMap<>();
        try {
            summary = financeDashboardDao.getDashboardSummary();
        } catch (Exception e) {
            System.err.println("⚠️ Error fetching dashboard summary: " + e.getMessage());
            summary.put("totalIncome", 0.0);
            summary.put("totalExpense", 0.0);
            summary.put("netProfit", 0.0);
        }
        return summary;
    }

    /**
     * Returns aggregated income grouped by source name
     * for charts or financial summaries.
     */
    @Override
    public Map<String, Double> getIncomeBySource() {
        try {
            return financeDashboardDao.getIncomeBySource();
        } catch (Exception e) {
            System.err.println("⚠️ Error fetching income by source: " + e.getMessage());
            return new LinkedHashMap<>();
        }
    }

    /**
     * Returns aggregated expense grouped by category name
     * for charts or breakdown visualization.
     */
    @Override
    public Map<String, Double> getExpenseByCategory() {
        try {
            return financeDashboardDao.getExpenseByCategory();
        } catch (Exception e) {
            System.err.println("⚠️ Error fetching expense by category: " + e.getMessage());
            return new LinkedHashMap<>();
        }
    }

	@Override
	public Map<String, Double> getDashboardSummary(String month) {
		
		return financeDashboardDao.getDashboardSummary(month);
	}

	@Override
	public Map<String, Double> getIncomeBySource(String month) {
		return financeDashboardDao.getIncomeBySource(month);
	}

	@Override
	public Map<String, Double> getExpenseByCategory(String month) {
		return financeDashboardDao.getExpenseByCategory(month);
	}
}
