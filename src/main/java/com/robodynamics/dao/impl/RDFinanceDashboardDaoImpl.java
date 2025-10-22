package com.robodynamics.dao.impl;

import java.util.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFinanceDashboardDao;

@Repository
@Transactional
public class RDFinanceDashboardDaoImpl implements RDFinanceDashboardDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Map<String, Double> getDashboardSummary() {
        Session session = sessionFactory.getCurrentSession();

        // --- Total Income ---
        Double totalIncome = (Double) session.createQuery(
            "SELECT COALESCE(SUM(amount), 0) FROM RDFinanceTransaction WHERE type = 'INCOME'"
        ).uniqueResult();
        if (totalIncome == null) totalIncome = 0.0;

        // --- Total Expense ---
        Double totalExpense = (Double) session.createQuery(
            "SELECT COALESCE(SUM(amount), 0) FROM RDFinanceTransaction WHERE type = 'EXPENSE'"
        ).uniqueResult();
        if (totalExpense == null) totalExpense = 0.0;

        // --- Net Profit ---
        double netProfit = totalIncome - totalExpense;

        Map<String, Double> summary = new LinkedHashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("netProfit", netProfit);

        return summary;
    }

    @Override
    public Map<String, Double> getIncomeBySource() {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> rows = session.createQuery(
            "SELECT s.sourceName, COALESCE(SUM(i.amount), 0) " +
            "FROM RDIncomeSource s LEFT JOIN RDFinanceTransaction i " +
            "ON i.relatedTable = 'rd_other_income' AND i.relatedId = s.sourceId " +
            "WHERE i.type = 'INCOME' GROUP BY s.sourceName"
        ).list();

        Map<String, Double> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String name = (String) row[0];
            Double total = (Double) row[1];
            result.put(name, total != null ? total : 0.0);
        }
        return result;
    }

    @Override
    public Map<String, Double> getExpenseByCategory() {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> rows = session.createQuery(
            "SELECT c.categoryName, COALESCE(SUM(e.amount), 0) " +
            "FROM RDExpenseCategory c LEFT JOIN RDFinanceTransaction e " +
            "ON e.relatedTable = 'rd_operational_expenses' AND e.relatedId = c.categoryId " +
            "WHERE e.type = 'EXPENSE' GROUP BY c.categoryName"
        ).list();

        Map<String, Double> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String name = (String) row[0];
            Double total = (Double) row[1];
            result.put(name, total != null ? total : 0.0);
        }
        return result;
    }

    @Override
    public Map<String, Double> getDashboardSummary(String month) {
        Session session = sessionFactory.getCurrentSession();
        String likePattern = month + "%";

        // 🟢 Student Fee Income
        Double studentIncome = session.createQuery(
            "SELECT COALESCE(SUM(p.amount),0) FROM RDStudentPayment p " +
            "WHERE p.status='RECEIVED' AND p.monthFor LIKE :month",
            Double.class)
            .setParameter("month", likePattern)
            .uniqueResult();

        // 🔵 Other Income (if table exists)
        Double otherIncome = 0.0;
        try {
            otherIncome = session.createQuery(
                "SELECT COALESCE(SUM(o.amount),0) FROM RDOtherIncome o WHERE o.incomeDate LIKE :month",
                Double.class)
                .setParameter("month", likePattern)
                .uniqueResult();
        } catch (Exception ex) {
            // ignore if RDOtherIncome is not implemented
        }

        double totalIncome = (studentIncome != null ? studentIncome : 0.0) + otherIncome;
        double totalExpense = 0.0; // Placeholder for future
        double netProfit = totalIncome; // since no expense yet
        double profitMargin = totalIncome > 0 ? 100.0 : 0.0;

        Map<String, Double> summary = new LinkedHashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("netProfit", netProfit);
        summary.put("profitMargin", profitMargin);

        return summary;
    }

    // -------------------------------------------------
    // 2️⃣ Income by Source (for Chart)
    // -------------------------------------------------
    @Override
    public Map<String, Double> getIncomeBySource(String month) {
        Session session = sessionFactory.getCurrentSession();
        Map<String, Double> incomeMap = new LinkedHashMap<>();
        String likePattern = month + "%";

        // 1️⃣ Student Fees
        Double studentFees = session.createQuery(
            "SELECT COALESCE(SUM(p.amount),0) FROM RDStudentPayment p " +
            "WHERE p.status='RECEIVED' AND p.monthFor LIKE :month",
            Double.class)
            .setParameter("month", likePattern)
            .uniqueResult();
        incomeMap.put("Student Fees", (studentFees != null) ? studentFees : 0.0);

        // 2️⃣ Optional: Other Incomes
        try {
            List<Object[]> otherIncomes = session.createQuery(
                "SELECT o.source.sourceName, SUM(o.amount) FROM RDOtherIncome o " +
                "WHERE o.incomeDate LIKE :month GROUP BY o.source.sourceName",
                Object[].class)
                .setParameter("month", likePattern)
                .list();

            for (Object[] row : otherIncomes) {
                incomeMap.put((String) row[0], (Double) row[1]);
            }
        } catch (Exception ex) {
            // Ignore if other income not yet implemented
        }

        return incomeMap;
    }

    // -----------------------------------------------------
    // 3️⃣ Expense by Category (for Chart) - Placeholder
    // -----------------------------------------------------
    @Override
    public Map<String, Double> getExpenseByCategory(String month) {
        // No expense module yet, return dummy map
        Map<String, Double> dummy = new LinkedHashMap<>();
        dummy.put("N/A", 0.0);
        return dummy;
    }
}
