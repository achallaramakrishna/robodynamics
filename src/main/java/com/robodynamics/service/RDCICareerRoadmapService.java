package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCICareerRoadmap;

public interface RDCICareerRoadmapService {

    List<RDCICareerRoadmap> getActiveRoadmap(String moduleCode,
                                             String assessmentVersion,
                                             String careerCode,
                                             String planTier,
                                             String gradeStage);

    RDCICareerRoadmap saveRoadmap(RDCICareerRoadmap row);
}
