package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDOperationalExpenseDao;
import com.robodynamics.model.RDOperationalExpense;
import com.robodynamics.service.RDOperationalExpenseService;

@Service
@Transactional
public class RDOperationalExpenseServiceImpl implements RDOperationalExpenseService {

    @Autowired
    private RDOperationalExpenseDao expenseDao;

    @Override
    public void save(RDOperationalExpense expense) {
        expenseDao.save(expense);
    }

    @Override
    public void update(RDOperationalExpense expense) {
        expenseDao.update(expense);
    }

    @Override
    public void delete(Integer expenseId) {
        expenseDao.delete(expenseId);
    }

    @Override
    public RDOperationalExpense findById(Integer expenseId) {
        return expenseDao.findById(expenseId);
    }

    @Override
    public List<RDOperationalExpense> findAll() {
        return expenseDao.findAll();
    }
}
