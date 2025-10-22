package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDExpenseCategory;

public interface RDExpenseCategoryDao {
    void save(RDExpenseCategory category);
    void update(RDExpenseCategory category);
    void delete(Integer categoryId);
    RDExpenseCategory findById(Integer categoryId);
    List<RDExpenseCategory> findAll();
}
