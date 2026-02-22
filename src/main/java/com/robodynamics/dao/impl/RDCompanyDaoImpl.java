package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCompanyDao;
import com.robodynamics.model.RDCompany;

@Repository
public class RDCompanyDaoImpl implements RDCompanyDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDCompany findById(Long companyId) {
        if (companyId == null) {
            return null;
        }
        return sessionFactory.getCurrentSession().get(RDCompany.class, companyId);
    }

    @Override
    public RDCompany findByCode(String companyCode) {
        if (companyCode == null || companyCode.trim().isEmpty()) {
            return null;
        }
        List<RDCompany> rows = sessionFactory.getCurrentSession()
                .createQuery("FROM RDCompany c WHERE c.companyCode = :companyCode", RDCompany.class)
                .setParameter("companyCode", companyCode.trim())
                .setMaxResults(1)
                .getResultList();
        return rows.isEmpty() ? null : rows.get(0);
    }
}
