package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCICareerRoadmap;

public interface RDCICareerRoadmapDao {

    void save(RDCICareerRoadmap row);

    RDCICareerRoadmap findById(Long id);

    RDCICareerRoadmap findByNaturalKey(String moduleCode,
                                       String assessmentVersion,
                                       String careerCode,
                                       String planTier,
                                       String gradeStage,
                                       String sectionType,
                                       Integer itemOrder);

    List<RDCICareerRoadmap> findActiveByCareerAndTierAndGrade(String moduleCode,
                                                               String assessmentVersion,
                                                               String careerCode,
                                                               String planTier,
                                                               String gradeStage);
}
