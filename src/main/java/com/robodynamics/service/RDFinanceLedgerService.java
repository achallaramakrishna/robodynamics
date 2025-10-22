package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDFinanceLedger;

public interface RDFinanceLedgerService {
    void save(RDFinanceLedger ledger);
    void update(RDFinanceLedger ledger);
    void delete(Integer ledgerId);
    RDFinanceLedger findById(Integer ledgerId);
    List<RDFinanceLedger> findAll();
    double calculateTotalBalance();
}
