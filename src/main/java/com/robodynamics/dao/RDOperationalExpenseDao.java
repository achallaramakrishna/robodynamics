package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDOperationalExpense;

public interface RDOperationalExpenseDao {
    void save(RDOperationalExpense expense);
    void update(RDOperationalExpense expense);
    void delete(Integer expenseId);
    RDOperationalExpense findById(Integer expenseId);
    List<RDOperationalExpense> findAll();
}
