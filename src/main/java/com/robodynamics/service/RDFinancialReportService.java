package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDFinancialReport;

public interface RDFinancialReportService {
    void generateMonthlyReport(String month);
    List<RDFinancialReport> findAll();
    RDFinancialReport findByMonth(String month);
    void delete(Integer reportId);
}
