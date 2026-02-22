package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCompanySsoConfigDao;
import com.robodynamics.model.RDCompanySsoConfig;

@Repository
public class RDCompanySsoConfigDaoImpl implements RDCompanySsoConfigDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDCompanySsoConfig findActiveByCompanyId(Long companyId) {
        if (companyId == null) {
            return null;
        }
        List<RDCompanySsoConfig> rows = sessionFactory.getCurrentSession()
                .createQuery(
                        "FROM RDCompanySsoConfig c WHERE c.company.companyId = :companyId AND c.status = :status",
                        RDCompanySsoConfig.class)
                .setParameter("companyId", companyId)
                .setParameter("status", "ACTIVE")
                .setMaxResults(1)
                .getResultList();
        return rows.isEmpty() ? null : rows.get(0);
    }
}
