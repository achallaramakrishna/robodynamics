package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCICareerAdjustmentDao;
import com.robodynamics.model.RDCICareerAdjustment;

@Repository
public class RDCICareerAdjustmentDaoImpl implements RDCICareerAdjustmentDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCICareerAdjustment row) {
        getCurrentSession().saveOrUpdate(row);
    }

    @Override
    public RDCICareerAdjustment findById(Long id) {
        if (id == null) {
            return null;
        }
        return getCurrentSession().get(RDCICareerAdjustment.class, id);
    }

    @Override
    public List<RDCICareerAdjustment> findByModuleAndVersion(String moduleCode, String assessmentVersion) {
        if (moduleCode == null || assessmentVersion == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCICareerAdjustment a " +
                        "WHERE a.moduleCode = :moduleCode " +
                        "AND a.assessmentVersion = :assessmentVersion " +
                        "ORDER BY a.sortOrder ASC, a.ciCareerAdjustmentId ASC",
                RDCICareerAdjustment.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .getResultList();
    }

    @Override
    public List<RDCICareerAdjustment> findActiveByModuleAndVersion(String moduleCode, String assessmentVersion) {
        if (moduleCode == null || assessmentVersion == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCICareerAdjustment a " +
                        "WHERE a.moduleCode = :moduleCode " +
                        "AND a.assessmentVersion = :assessmentVersion " +
                        "AND a.status = 'ACTIVE' " +
                        "ORDER BY a.sortOrder ASC, a.ciCareerAdjustmentId ASC",
                RDCICareerAdjustment.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .getResultList();
    }
}
