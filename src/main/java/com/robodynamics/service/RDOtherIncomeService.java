package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDOtherIncome;

public interface RDOtherIncomeService {
    void save(RDOtherIncome income);
    void update(RDOtherIncome income);
    void delete(Integer incomeId);
    RDOtherIncome findById(Integer incomeId);
    List<RDOtherIncome> findAll();
}
