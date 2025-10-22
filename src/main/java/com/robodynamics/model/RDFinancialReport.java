package com.robodynamics.model;

import java.sql.Timestamp;
import javax.persistence.*;

@Entity
@Table(name = "rd_financial_reports")
public class RDFinancialReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @Column(name = "report_month", nullable = false, length = 7)
    private String reportMonth; // e.g. "2025-10"

    @Column(name = "total_income")
    private Double totalIncome;

    @Column(name = "total_expense")
    private Double totalExpense;

    @Column(name = "net_profit")
    private Double netProfit;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // --- Getters & Setters ---
    public Integer getReportId() { return reportId; }
    public void setReportId(Integer reportId) { this.reportId = reportId; }

    public String getReportMonth() { return reportMonth; }
    public void setReportMonth(String reportMonth) { this.reportMonth = reportMonth; }

    public Double getTotalIncome() { return totalIncome; }
    public void setTotalIncome(Double totalIncome) { this.totalIncome = totalIncome; }

    public Double getTotalExpense() { return totalExpense; }
    public void setTotalExpense(Double totalExpense) { this.totalExpense = totalExpense; }

    public Double getNetProfit() { return netProfit; }
    public void setNetProfit(Double netProfit) { this.netProfit = netProfit; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
