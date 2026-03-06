package com.robodynamics.dao.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCIRoadmapEnrichmentJobDao;
import com.robodynamics.model.RDCIRoadmapEnrichmentJob;

@Repository
public class RDCIRoadmapEnrichmentJobDaoImpl implements RDCIRoadmapEnrichmentJobDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDCIRoadmapEnrichmentJob row) {
        getCurrentSession().saveOrUpdate(row);
    }

    @Override
    public RDCIRoadmapEnrichmentJob findById(Long id) {
        if (id == null) {
            return null;
        }
        return getCurrentSession().get(RDCIRoadmapEnrichmentJob.class, id);
    }

    @Override
    public RDCIRoadmapEnrichmentJob findByNaturalKey(String moduleCode,
                                                     String assessmentVersion,
                                                     String careerCode,
                                                     String planTier,
                                                     String gradeStage) {
        if (moduleCode == null || assessmentVersion == null || careerCode == null
                || planTier == null || gradeStage == null) {
            return null;
        }
        return getCurrentSession().createQuery(
                "FROM RDCIRoadmapEnrichmentJob j " +
                        "WHERE j.moduleCode = :moduleCode " +
                        "AND j.assessmentVersion = :assessmentVersion " +
                        "AND j.careerCode = :careerCode " +
                        "AND j.planTier = :planTier " +
                        "AND j.gradeStage = :gradeStage",
                RDCIRoadmapEnrichmentJob.class)
                .setParameter("moduleCode", moduleCode.trim().toUpperCase())
                .setParameter("assessmentVersion", assessmentVersion.trim())
                .setParameter("careerCode", careerCode.trim().toUpperCase())
                .setParameter("planTier", planTier.trim().toUpperCase())
                .setParameter("gradeStage", gradeStage.trim().toUpperCase())
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public List<RDCIRoadmapEnrichmentJob> findDueJobs(LocalDateTime now, int limit) {
        int maxRows = Math.max(1, Math.min(limit, 100));
        LocalDateTime effectiveNow = now == null ? LocalDateTime.now() : now;
        return getCurrentSession().createQuery(
                "FROM RDCIRoadmapEnrichmentJob j " +
                        "WHERE (j.status = 'PENDING' AND j.nextAttemptAt <= :now) " +
                        "   OR j.status = 'RUNNING' " +
                        "ORDER BY j.priority ASC, j.nextAttemptAt ASC, j.createdAt ASC",
                RDCIRoadmapEnrichmentJob.class)
                .setParameter("now", effectiveNow)
                .setMaxResults(maxRows)
                .getResultList();
    }

    @Override
    public int claimJob(Long jobId, LocalDateTime now, LocalDateTime staleBefore, String workerId) {
        if (jobId == null || now == null || staleBefore == null || workerId == null || workerId.trim().isEmpty()) {
            return 0;
        }
        return getCurrentSession().createQuery(
                "UPDATE RDCIRoadmapEnrichmentJob j " +
                        "SET j.status = 'RUNNING', " +
                        "    j.lockOwner = :workerId, " +
                        "    j.lockedAt = :now, " +
                        "    j.updatedAt = :now " +
                        "WHERE j.ciRoadmapEnrichmentJobId = :jobId " +
                        "AND ( (j.status = 'PENDING' AND j.nextAttemptAt <= :now) " +
                        "   OR (j.status = 'RUNNING' AND j.lockedAt <= :staleBefore) )")
                .setParameter("workerId", workerId.trim())
                .setParameter("now", now)
                .setParameter("staleBefore", staleBefore)
                .setParameter("jobId", jobId)
                .executeUpdate();
    }
}
