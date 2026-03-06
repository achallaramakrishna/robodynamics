package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCIRoadmapEnrichmentJob;

public interface RDCIRoadmapEnrichmentJobService {

    boolean enqueue(String moduleCode,
                    String assessmentVersion,
                    String careerCode,
                    String planTier,
                    String gradeStage,
                    Long sourceSessionId,
                    Integer priority,
                    Integer maxAttempts,
                    String payloadJson);

    List<RDCIRoadmapEnrichmentJob> claimDueJobs(int limit, String workerId, int lockTtlMinutes);

    void markDone(Long jobId);

    void markRetryOrFailed(Long jobId, String error, int backoffBaseSeconds, int backoffMaxSeconds);
}
