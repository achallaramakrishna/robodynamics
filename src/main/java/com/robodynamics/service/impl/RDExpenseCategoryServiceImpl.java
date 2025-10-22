package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDExpenseCategoryDao;
import com.robodynamics.model.RDExpenseCategory;
import com.robodynamics.service.RDExpenseCategoryService;

@Service
@Transactional
public class RDExpenseCategoryServiceImpl implements RDExpenseCategoryService {

    @Autowired
    private RDExpenseCategoryDao expenseCategoryDao;

    @Override
    public void save(RDExpenseCategory category) {
        expenseCategoryDao.save(category);
    }

    @Override
    public void update(RDExpenseCategory category) {
        expenseCategoryDao.update(category);
    }

    @Override
    public void delete(Integer categoryId) {
        expenseCategoryDao.delete(categoryId);
    }

    @Override
    public RDExpenseCategory findById(Integer categoryId) {
        return expenseCategoryDao.findById(categoryId);
    }

    @Override
    public List<RDExpenseCategory> findAll() {
        return expenseCategoryDao.findAll();
    }
}
