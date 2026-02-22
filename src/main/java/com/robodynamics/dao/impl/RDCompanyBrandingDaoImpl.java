package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCompanyBrandingDao;
import com.robodynamics.model.RDCompanyBranding;

@Repository
public class RDCompanyBrandingDaoImpl implements RDCompanyBrandingDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDCompanyBranding findActiveByCompanyId(Long companyId) {
        if (companyId == null) {
            return null;
        }
        List<RDCompanyBranding> rows = sessionFactory.getCurrentSession()
                .createQuery(
                        "FROM RDCompanyBranding b WHERE b.company.companyId = :companyId AND b.status = :status",
                        RDCompanyBranding.class)
                .setParameter("companyId", companyId)
                .setParameter("status", "ACTIVE")
                .setMaxResults(1)
                .getResultList();
        return rows.isEmpty() ? null : rows.get(0);
    }
}
