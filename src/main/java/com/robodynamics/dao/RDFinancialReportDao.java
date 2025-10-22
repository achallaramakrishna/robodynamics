package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDFinancialReport;

public interface RDFinancialReportDao {
    void save(RDFinancialReport report);
    void update(RDFinancialReport report);
    void delete(Integer reportId);
    RDFinancialReport findById(Integer reportId);
    List<RDFinancialReport> findAll();
    RDFinancialReport findByMonth(String reportMonth);
}
