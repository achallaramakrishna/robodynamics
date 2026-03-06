package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCICareerRoadmapDao;
import com.robodynamics.model.RDCICareerRoadmap;

@Repository
public class RDCICareerRoadmapDaoImpl implements RDCICareerRoadmapDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCICareerRoadmap row) {
        getCurrentSession().saveOrUpdate(row);
    }

    @Override
    public RDCICareerRoadmap findById(Long id) {
        if (id == null) {
            return null;
        }
        return getCurrentSession().get(RDCICareerRoadmap.class, id);
    }

    @Override
    public RDCICareerRoadmap findByNaturalKey(String moduleCode,
                                              String assessmentVersion,
                                              String careerCode,
                                              String planTier,
                                              String gradeStage,
                                              String sectionType,
                                              Integer itemOrder) {
        if (moduleCode == null || assessmentVersion == null
                || careerCode == null || planTier == null
                || gradeStage == null || sectionType == null
                || itemOrder == null) {
            return null;
        }
        return getCurrentSession().createQuery(
                "FROM RDCICareerRoadmap r " +
                        "WHERE r.moduleCode = :moduleCode " +
                        "AND r.assessmentVersion = :assessmentVersion " +
                        "AND r.careerCode = :careerCode " +
                        "AND r.planTier = :planTier " +
                        "AND r.gradeStage = :gradeStage " +
                        "AND r.sectionType = :sectionType " +
                        "AND r.itemOrder = :itemOrder",
                RDCICareerRoadmap.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .setParameter("careerCode", careerCode.trim().toUpperCase())
                .setParameter("planTier", planTier.trim().toUpperCase())
                .setParameter("gradeStage", gradeStage.trim().toUpperCase())
                .setParameter("sectionType", sectionType.trim().toUpperCase())
                .setParameter("itemOrder", itemOrder)
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public List<RDCICareerRoadmap> findActiveByCareerAndTierAndGrade(String moduleCode,
                                                                      String assessmentVersion,
                                                                      String careerCode,
                                                                      String planTier,
                                                                      String gradeStage) {
        if (moduleCode == null || assessmentVersion == null
                || careerCode == null || planTier == null || gradeStage == null) {
            return List.of();
        }
        return getCurrentSession().createQuery(
                "FROM RDCICareerRoadmap r " +
                        "WHERE r.moduleCode = :moduleCode " +
                        "AND r.assessmentVersion = :assessmentVersion " +
                        "AND r.careerCode = :careerCode " +
                        "AND r.planTier = :planTier " +
                        "AND r.status = 'ACTIVE' " +
                        "AND (r.gradeStage = :gradeStage OR r.gradeStage = 'ANY') " +
                        "ORDER BY CASE WHEN r.gradeStage = :gradeStage THEN 0 ELSE 1 END, " +
                        "r.sectionType ASC, r.itemOrder ASC, r.ciCareerRoadmapId ASC",
                RDCICareerRoadmap.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .setParameter("careerCode", careerCode.trim().toUpperCase())
                .setParameter("planTier", planTier.trim().toUpperCase())
                .setParameter("gradeStage", gradeStage.trim().toUpperCase())
                .getResultList();
    }
}
