package com.robodynamics.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompanyBrandingDao;
import com.robodynamics.dao.RDCompanyDao;
import com.robodynamics.dao.RDCompanySsoConfigDao;
import com.robodynamics.model.RDCompany;
import com.robodynamics.model.RDCompanyBranding;
import com.robodynamics.model.RDCompanySsoConfig;
import com.robodynamics.service.RDCompanyContextService;

@Service
public class RDCompanyContextServiceImpl implements RDCompanyContextService {

    @Autowired
    private RDCompanyDao companyDao;

    @Autowired
    private RDCompanyBrandingDao companyBrandingDao;

    @Autowired
    private RDCompanySsoConfigDao companySsoConfigDao;

    @Override
    @Transactional(readOnly = true)
    public RDCompany getActiveCompanyByCode(String companyCode) {
        RDCompany company = companyDao.findByCode(companyCode);
        if (company == null) {
            return null;
        }
        if (!"ACTIVE".equalsIgnoreCase(nz(company.getStatus()))) {
            return null;
        }
        return company;
    }

    @Override
    @Transactional(readOnly = true)
    public RDCompanyBranding getActiveBrandingByCompanyCode(String companyCode) {
        RDCompany company = getActiveCompanyByCode(companyCode);
        if (company == null) {
            return null;
        }
        return companyBrandingDao.findActiveByCompanyId(company.getCompanyId());
    }

    @Override
    @Transactional(readOnly = true)
    public RDCompanySsoConfig getActiveSsoConfigByCompanyCode(String companyCode) {
        RDCompany company = getActiveCompanyByCode(companyCode);
        if (company == null) {
            return null;
        }
        return companySsoConfigDao.findActiveByCompanyId(company.getCompanyId());
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }
}
