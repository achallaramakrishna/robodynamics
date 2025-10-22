package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDOtherIncome;

public interface RDOtherIncomeDao {
    void save(RDOtherIncome income);
    void update(RDOtherIncome income);
    void delete(Integer incomeId);
    RDOtherIncome findById(Integer incomeId);
    List<RDOtherIncome> findAll();
}
