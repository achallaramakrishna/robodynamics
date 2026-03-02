package com.robodynamics.dao.impl;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMarketingConsentAuditDao;
import com.robodynamics.model.RDMarketingConsentAudit;

@Repository
@Transactional
public class RDMarketingConsentAuditDaoImpl implements RDMarketingConsentAuditDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDMarketingConsentAudit save(RDMarketingConsentAudit audit) {
        Session session = sessionFactory.getCurrentSession();
        session.save(audit);
        return audit;
    }
}
