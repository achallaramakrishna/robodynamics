package com.robodynamics.dao;

import com.robodynamics.model.RDCompany;

public interface RDCompanyDao {

    RDCompany findById(Long companyId);

    RDCompany findByCode(String companyCode);
}
