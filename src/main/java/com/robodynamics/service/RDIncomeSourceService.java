package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDIncomeSource;

public interface RDIncomeSourceService {
    void save(RDIncomeSource incomeSource);
    void update(RDIncomeSource incomeSource);
    void delete(int id);
    RDIncomeSource getById(int id);
    List<RDIncomeSource> getAll();
}
