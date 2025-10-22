package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDOperationalExpense;

public interface RDOperationalExpenseService {
    void save(RDOperationalExpense expense);
    void update(RDOperationalExpense expense);
    void delete(Integer expenseId);
    RDOperationalExpense findById(Integer expenseId);
    List<RDOperationalExpense> findAll();
}
