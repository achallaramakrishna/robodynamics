package com.robodynamics.service;

import com.robodynamics.model.RDCompany;
import com.robodynamics.model.RDCompanyBranding;
import com.robodynamics.model.RDCompanySsoConfig;

public interface RDCompanyContextService {

    RDCompany getActiveCompanyByCode(String companyCode);

    RDCompanyBranding getActiveBrandingByCompanyCode(String companyCode);

    RDCompanySsoConfig getActiveSsoConfigByCompanyCode(String companyCode);
}
