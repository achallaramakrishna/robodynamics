package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDExpenseCategory;

public interface RDExpenseCategoryService {
    void save(RDExpenseCategory category);
    void update(RDExpenseCategory category);
    void delete(Integer categoryId);
    RDExpenseCategory findById(Integer categoryId);
    List<RDExpenseCategory> findAll();
}
