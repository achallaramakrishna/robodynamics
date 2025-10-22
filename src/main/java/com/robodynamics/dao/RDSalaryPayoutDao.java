package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDSalaryPayout;

public interface RDSalaryPayoutDao {
    void save(RDSalaryPayout payout);
    void update(RDSalaryPayout payout);
    void delete(Integer salaryId);
    RDSalaryPayout findById(Integer salaryId);
    List<RDSalaryPayout> findAll();
}
