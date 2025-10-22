package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDFinanceLedger;

public interface RDFinanceLedgerDao {
    void save(RDFinanceLedger ledger);
    void update(RDFinanceLedger ledger);
    void delete(Integer ledgerId);
    RDFinanceLedger findById(Integer ledgerId);
    List<RDFinanceLedger> findAll();
}
