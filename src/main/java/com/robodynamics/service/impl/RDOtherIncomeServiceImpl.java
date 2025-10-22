package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDOtherIncomeDao;
import com.robodynamics.model.RDOtherIncome;
import com.robodynamics.service.RDOtherIncomeService;

@Service
@Transactional
public class RDOtherIncomeServiceImpl implements RDOtherIncomeService {

    @Autowired
    private RDOtherIncomeDao otherIncomeDao;

    @Override
    public void save(RDOtherIncome income) {
        otherIncomeDao.save(income);
    }

    @Override
    public void update(RDOtherIncome income) {
        otherIncomeDao.update(income);
    }

    @Override
    public void delete(Integer incomeId) {
        otherIncomeDao.delete(incomeId);
    }

    @Override
    public RDOtherIncome findById(Integer incomeId) {
        return otherIncomeDao.findById(incomeId);
    }

    @Override
    public List<RDOtherIncome> findAll() {
        return otherIncomeDao.findAll();
    }
}
