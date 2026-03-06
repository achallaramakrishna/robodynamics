package com.robodynamics.dao;

import java.time.LocalDateTime;
import java.util.List;

import com.robodynamics.model.RDCIRoadmapEnrichmentJob;

public interface RDCIRoadmapEnrichmentJobDao {

    void save(RDCIRoadmapEnrichmentJob row);

    RDCIRoadmapEnrichmentJob findById(Long id);

    RDCIRoadmapEnrichmentJob findByNaturalKey(String moduleCode,
                                              String assessmentVersion,
                                              String careerCode,
                                              String planTier,
                                              String gradeStage);

    List<RDCIRoadmapEnrichmentJob> findDueJobs(LocalDateTime now, int limit);

    int claimJob(Long jobId, LocalDateTime now, LocalDateTime staleBefore, String workerId);
}
