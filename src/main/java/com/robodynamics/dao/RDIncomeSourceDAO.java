package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDIncomeSource;

public interface RDIncomeSourceDAO {
    void save(RDIncomeSource incomeSource);
    void update(RDIncomeSource incomeSource);
    void delete(int id);
    RDIncomeSource getById(int id);
    List<RDIncomeSource> getAll();
}
