package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.robodynamics.dao.RDIncomeSourceDAO;
import com.robodynamics.model.RDIncomeSource;
import com.robodynamics.service.RDIncomeSourceService;

@Service
@Transactional
public class RDIncomeSourceServiceImpl implements RDIncomeSourceService {

    @Autowired
    private RDIncomeSourceDAO incomeSourceDAO;

    @Override
    public void save(RDIncomeSource incomeSource) {
        incomeSourceDAO.save(incomeSource);
    }

    @Override
    public void update(RDIncomeSource incomeSource) {
        incomeSourceDAO.update(incomeSource);
    }

    @Override
    public void delete(int id) {
        incomeSourceDAO.delete(id);
    }

    @Override
    public RDIncomeSource getById(int id) {
        return incomeSourceDAO.getById(id);
    }

    @Override
    public List<RDIncomeSource> getAll() {
        return incomeSourceDAO.getAll();
    }
}
