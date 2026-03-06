package com.robodynamics.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCICareerRoadmapDao;
import com.robodynamics.model.RDCICareerRoadmap;
import com.robodynamics.service.RDCICareerRoadmapService;

@Service
public class RDCICareerRoadmapServiceImpl implements RDCICareerRoadmapService {

    @Autowired
    private RDCICareerRoadmapDao careerRoadmapDao;

    @Override
    @Transactional(readOnly = true)
    public List<RDCICareerRoadmap> getActiveRoadmap(String moduleCode,
                                                    String assessmentVersion,
                                                    String careerCode,
                                                    String planTier,
                                                    String gradeStage) {
        try {
            return careerRoadmapDao.findActiveByCareerAndTierAndGrade(
                    normalizeModule(moduleCode),
                    normalizeVersion(assessmentVersion),
                    normalizeCode(careerCode),
                    normalizeCode(planTier),
                    normalizeCode(gradeStage));
        } catch (RuntimeException ex) {
            return List.of();
        }
    }

    @Override
    @Transactional
    public RDCICareerRoadmap saveRoadmap(RDCICareerRoadmap row) {
        if (row == null) {
            return null;
        }
        LocalDateTime now = LocalDateTime.now();
        row.setModuleCode(normalizeModule(row.getModuleCode()));
        row.setAssessmentVersion(normalizeVersion(row.getAssessmentVersion()));
        row.setCareerCode(normalizeCode(row.getCareerCode()));
        row.setPlanTier(normalizeCode(row.getPlanTier()));
        row.setGradeStage(normalizeCode(row.getGradeStage()));
        row.setSectionType(normalizeCode(row.getSectionType()));
        if (row.getItemOrder() == null || row.getItemOrder().intValue() < 1) {
            row.setItemOrder(1);
        }
        row.setStatus(normalizeStatus(row.getStatus()));
        RDCICareerRoadmap existing = careerRoadmapDao.findByNaturalKey(
                row.getModuleCode(),
                row.getAssessmentVersion(),
                row.getCareerCode(),
                row.getPlanTier(),
                row.getGradeStage(),
                row.getSectionType(),
                row.getItemOrder());
        if (existing != null) {
            row.setCiCareerRoadmapId(existing.getCiCareerRoadmapId());
            if (row.getCreatedAt() == null) {
                row.setCreatedAt(existing.getCreatedAt());
            }
        }
        if (row.getCreatedAt() == null) {
            row.setCreatedAt(now);
        }
        row.setUpdatedAt(now);
        careerRoadmapDao.save(row);
        return row;
    }

    private String normalizeModule(String moduleCode) {
        String normalized = moduleCode == null ? "" : moduleCode.trim();
        if (normalized.isEmpty()) {
            normalized = "APTIPATH";
        }
        return normalized.toUpperCase(Locale.ENGLISH);
    }

    private String normalizeVersion(String assessmentVersion) {
        String normalized = assessmentVersion == null ? "" : assessmentVersion.trim();
        if (normalized.isEmpty()) {
            normalized = "v3";
        }
        return normalized;
    }

    private String normalizeCode(String value) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isEmpty()) {
            normalized = "ANY";
        }
        return normalized.toUpperCase(Locale.ENGLISH);
    }

    private String normalizeStatus(String status) {
        String normalized = status == null ? "" : status.trim().toUpperCase(Locale.ENGLISH);
        if (!"INACTIVE".equals(normalized)) {
            return "ACTIVE";
        }
        return normalized;
    }
}
