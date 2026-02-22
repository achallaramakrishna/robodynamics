package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCICareerCatalogDao;
import com.robodynamics.model.RDCICareerCatalog;

@Repository
public class RDCICareerCatalogDaoImpl implements RDCICareerCatalogDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCICareerCatalog row) {
        getCurrentSession().saveOrUpdate(row);
    }

    @Override
    public RDCICareerCatalog findById(Long id) {
        if (id == null) {
            return null;
        }
        return getCurrentSession().get(RDCICareerCatalog.class, id);
    }

    @Override
    public List<RDCICareerCatalog> findByModuleAndVersion(String moduleCode, String assessmentVersion) {
        if (moduleCode == null || assessmentVersion == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCICareerCatalog c " +
                        "WHERE c.moduleCode = :moduleCode " +
                        "AND c.assessmentVersion = :assessmentVersion " +
                        "ORDER BY c.sortOrder ASC, c.ciCareerCatalogId ASC",
                RDCICareerCatalog.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .getResultList();
    }

    @Override
    public List<RDCICareerCatalog> findActiveByModuleAndVersion(String moduleCode, String assessmentVersion) {
        if (moduleCode == null || assessmentVersion == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCICareerCatalog c " +
                        "WHERE c.moduleCode = :moduleCode " +
                        "AND c.assessmentVersion = :assessmentVersion " +
                        "AND c.status = 'ACTIVE' " +
                        "ORDER BY c.sortOrder ASC, c.ciCareerCatalogId ASC",
                RDCICareerCatalog.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .getResultList();
    }
}
