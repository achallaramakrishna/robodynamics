package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDSalaryPayout;

public interface RDSalaryPayoutService {
    void save(RDSalaryPayout payout);
    void update(RDSalaryPayout payout);
    void delete(Integer salaryId);
    RDSalaryPayout findById(Integer salaryId);
    List<RDSalaryPayout> findAll();
}
