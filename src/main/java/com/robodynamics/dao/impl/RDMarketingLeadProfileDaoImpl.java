package com.robodynamics.dao.impl;

import java.util.Optional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMarketingLeadProfileDao;
import com.robodynamics.model.RDMarketingLeadProfile;

@Repository
@Transactional
public class RDMarketingLeadProfileDaoImpl implements RDMarketingLeadProfileDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDMarketingLeadProfile saveOrUpdate(RDMarketingLeadProfile profile) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(profile);
        return profile;
    }

    @Override
    public Optional<RDMarketingLeadProfile> findByLeadId(Long leadId) {
        Session session = sessionFactory.getCurrentSession();
        RDMarketingLeadProfile profile = session
                .createQuery("from RDMarketingLeadProfile p where p.lead.id = :leadId", RDMarketingLeadProfile.class)
                .setParameter("leadId", leadId)
                .setMaxResults(1)
                .uniqueResult();
        return Optional.ofNullable(profile);
    }
}
