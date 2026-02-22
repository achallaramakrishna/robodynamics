package com.robodynamics.dao;

import com.robodynamics.model.RDCompanyBranding;

public interface RDCompanyBrandingDao {

    RDCompanyBranding findActiveByCompanyId(Long companyId);
}
