package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDParentNeedDao;
import com.robodynamics.model.RDParentNeed;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RDParentNeedDaoImpl implements RDParentNeedDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDParentNeed need) {
        getCurrentSession().saveOrUpdate(need);
    }

    @Override
    public RDParentNeed findByLeadId(Long leadId) {
        String hql = "FROM RDParentNeed p WHERE p.leadId = :leadId";
        return (RDParentNeed) getCurrentSession()
                .createQuery(hql, RDParentNeed.class)
                .setParameter("leadId", leadId)
                .uniqueResult();
    }
}
