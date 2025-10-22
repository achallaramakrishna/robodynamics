package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFinanceLedgerDao;
import com.robodynamics.model.RDFinanceLedger;
import com.robodynamics.service.RDFinanceLedgerService;

@Service
@Transactional
public class RDFinanceLedgerServiceImpl implements RDFinanceLedgerService {

    @Autowired
    private RDFinanceLedgerDao ledgerDao;

    @Override
    public void save(RDFinanceLedger ledger) {
        ledgerDao.save(ledger);
    }

    @Override
    public void update(RDFinanceLedger ledger) {
        ledgerDao.update(ledger);
    }

    @Override
    public void delete(Integer ledgerId) {
        ledgerDao.delete(ledgerId);
    }

    @Override
    public RDFinanceLedger findById(Integer ledgerId) {
        return ledgerDao.findById(ledgerId);
    }

    @Override
    public List<RDFinanceLedger> findAll() {
        return ledgerDao.findAll();
    }

    @Override
    public double calculateTotalBalance() {
        List<RDFinanceLedger> all = ledgerDao.findAll();
        double total = 0.0;
        for (RDFinanceLedger l : all) {
            total += "INCOME".equalsIgnoreCase(l.getType()) ? l.getAmount() : -l.getAmount();
        }
        return total;
    }
}
