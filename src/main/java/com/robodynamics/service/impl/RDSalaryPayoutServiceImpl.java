package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDSalaryPayoutDao;
import com.robodynamics.model.RDSalaryPayout;
import com.robodynamics.service.RDSalaryPayoutService;

@Service
@Transactional
public class RDSalaryPayoutServiceImpl implements RDSalaryPayoutService {

    @Autowired
    private RDSalaryPayoutDao salaryDao;

    @Override
    public void save(RDSalaryPayout payout) {
        double base = payout.getBaseSalary() != null ? payout.getBaseSalary() : 0;
        double bonus = payout.getBonus() != null ? payout.getBonus() : 0;
        double deductions = payout.getDeductions() != null ? payout.getDeductions() : 0;
        payout.setNetSalary(base + bonus - deductions);
        salaryDao.save(payout);
    }

    @Override
    public void update(RDSalaryPayout payout) {
        double base = payout.getBaseSalary() != null ? payout.getBaseSalary() : 0;
        double bonus = payout.getBonus() != null ? payout.getBonus() : 0;
        double deductions = payout.getDeductions() != null ? payout.getDeductions() : 0;
        payout.setNetSalary(base + bonus - deductions);
        salaryDao.update(payout);
    }

    @Override
    public void delete(Integer salaryId) {
        salaryDao.delete(salaryId);
    }

    @Override
    public RDSalaryPayout findById(Integer salaryId) {
        return salaryDao.findById(salaryId);
    }

    @Override
    public List<RDSalaryPayout> findAll() {
        return salaryDao.findAll();
    }
}
