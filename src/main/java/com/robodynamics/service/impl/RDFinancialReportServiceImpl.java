package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFinancialReportDao;
import com.robodynamics.dao.RDFinanceLedgerDao;
import com.robodynamics.model.RDFinanceLedger;
import com.robodynamics.model.RDFinancialReport;
import com.robodynamics.service.RDFinancialReportService;

@Service
@Transactional
public class RDFinancialReportServiceImpl implements RDFinancialReportService {

    @Autowired
    private RDFinancialReportDao reportDao;

    @Autowired
    private RDFinanceLedgerDao ledgerDao;

    @Override
    public void generateMonthlyReport(String month) {
        List<RDFinanceLedger> entries = ledgerDao.findAll();

        double totalIncome = 0.0;
        double totalExpense = 0.0;

        for (RDFinanceLedger l : entries) {
            if (l.getTransactionDate() != null && l.getTransactionDate().toString().startsWith(month)) {
                if ("INCOME".equalsIgnoreCase(l.getType()))
                    totalIncome += l.getAmount();
                else
                    totalExpense += l.getAmount();
            }
        }

        double netProfit = totalIncome - totalExpense;

        RDFinancialReport existing = reportDao.findByMonth(month);
        if (existing == null) {
            RDFinancialReport newReport = new RDFinancialReport();
            newReport.setReportMonth(month);
            newReport.setTotalIncome(totalIncome);
            newReport.setTotalExpense(totalExpense);
            newReport.setNetProfit(netProfit);
            reportDao.save(newReport);
        } else {
            existing.setTotalIncome(totalIncome);
            existing.setTotalExpense(totalExpense);
            existing.setNetProfit(netProfit);
            reportDao.update(existing);
        }
    }

    @Override
    public List<RDFinancialReport> findAll() {
        return reportDao.findAll();
    }

    @Override
    public RDFinancialReport findByMonth(String month) {
        return reportDao.findByMonth(month);
    }

    @Override
    public void delete(Integer reportId) {
        reportDao.delete(reportId);
    }
}
