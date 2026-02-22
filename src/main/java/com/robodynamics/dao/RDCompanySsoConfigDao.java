package com.robodynamics.dao;

import com.robodynamics.model.RDCompanySsoConfig;

public interface RDCompanySsoConfigDao {

    RDCompanySsoConfig findActiveByCompanyId(Long companyId);
}
