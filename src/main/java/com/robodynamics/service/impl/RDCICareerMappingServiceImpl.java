package com.robodynamics.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCICareerAdjustmentDao;
import com.robodynamics.dao.RDCICareerCatalogDao;
import com.robodynamics.model.RDCICareerAdjustment;
import com.robodynamics.model.RDCICareerCatalog;
import com.robodynamics.service.RDCICareerMappingService;

@Service
public class RDCICareerMappingServiceImpl implements RDCICareerMappingService {

    @Autowired
    private RDCICareerCatalogDao careerCatalogDao;

    @Autowired
    private RDCICareerAdjustmentDao careerAdjustmentDao;

    @Override
    @Transactional(readOnly = true)
    public List<RDCICareerCatalog> getActiveCareerCatalog(String moduleCode, String assessmentVersion) {
        String normalizedModule = normalizeModule(moduleCode);
        String normalizedVersion = normalizeVersion(assessmentVersion);
        try {
            return careerCatalogDao.findActiveByModuleAndVersion(normalizedModule, normalizedVersion);
        } catch (RuntimeException ex) {
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCICareerAdjustment> getActiveAdjustments(String moduleCode, String assessmentVersion) {
        String normalizedModule = normalizeModule(moduleCode);
        String normalizedVersion = normalizeVersion(assessmentVersion);
        try {
            return careerAdjustmentDao.findActiveByModuleAndVersion(normalizedModule, normalizedVersion);
        } catch (RuntimeException ex) {
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCICareerCatalog> getCareerCatalog(String moduleCode, String assessmentVersion, boolean includeInactive) {
        String normalizedModule = normalizeModule(moduleCode);
        String normalizedVersion = normalizeVersion(assessmentVersion);
        try {
            List<RDCICareerCatalog> rows = includeInactive
                    ? careerCatalogDao.findByModuleAndVersion(normalizedModule, normalizedVersion)
                    : careerCatalogDao.findActiveByModuleAndVersion(normalizedModule, normalizedVersion);
            return rows == null ? List.of() : rows;
        } catch (RuntimeException ex) {
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCICareerAdjustment> getAdjustments(String moduleCode, String assessmentVersion, boolean includeInactive) {
        String normalizedModule = normalizeModule(moduleCode);
        String normalizedVersion = normalizeVersion(assessmentVersion);
        try {
            List<RDCICareerAdjustment> rows = includeInactive
                    ? careerAdjustmentDao.findByModuleAndVersion(normalizedModule, normalizedVersion)
                    : careerAdjustmentDao.findActiveByModuleAndVersion(normalizedModule, normalizedVersion);
            return rows == null ? List.of() : rows;
        } catch (RuntimeException ex) {
            return List.of();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RDCICareerCatalog getCareerCatalogById(Long id) {
        try {
            return careerCatalogDao.findById(id);
        } catch (RuntimeException ex) {
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RDCICareerAdjustment getCareerAdjustmentById(Long id) {
        try {
            return careerAdjustmentDao.findById(id);
        } catch (RuntimeException ex) {
            return null;
        }
    }

    @Override
    @Transactional
    public RDCICareerCatalog saveCareerCatalog(RDCICareerCatalog row) {
        if (row == null) {
            return null;
        }
        LocalDateTime now = LocalDateTime.now();
        if (row.getCiCareerCatalogId() == null) {
            row.setCreatedAt(now);
        }
        row.setModuleCode(normalizeModule(row.getModuleCode()));
        row.setAssessmentVersion(normalizeVersion(row.getAssessmentVersion()));
        row.setStatus(normalizeStatus(row.getStatus()));
        row.setUpdatedAt(now);
        careerCatalogDao.save(row);
        return row;
    }

    @Override
    @Transactional
    public RDCICareerAdjustment saveCareerAdjustment(RDCICareerAdjustment row) {
        if (row == null) {
            return null;
        }
        LocalDateTime now = LocalDateTime.now();
        if (row.getCiCareerAdjustmentId() == null) {
            row.setCreatedAt(now);
        }
        row.setModuleCode(normalizeModule(row.getModuleCode()));
        row.setAssessmentVersion(normalizeVersion(row.getAssessmentVersion()));
        row.setSignalType(nz(row.getSignalType()).trim().toUpperCase(Locale.ENGLISH));
        row.setSignalCode(nz(row.getSignalCode()).trim().toUpperCase(Locale.ENGLISH));
        row.setSignalBand(nz(row.getSignalBand()).trim().toUpperCase(Locale.ENGLISH));
        row.setStatus(normalizeStatus(row.getStatus()));
        row.setUpdatedAt(now);
        careerAdjustmentDao.save(row);
        return row;
    }

    @Override
    @Transactional
    public boolean updateCareerCatalogStatus(Long id, String status) {
        RDCICareerCatalog row = careerCatalogDao.findById(id);
        if (row == null) {
            return false;
        }
        row.setStatus(normalizeStatus(status));
        row.setUpdatedAt(LocalDateTime.now());
        careerCatalogDao.save(row);
        return true;
    }

    @Override
    @Transactional
    public boolean updateCareerAdjustmentStatus(Long id, String status) {
        RDCICareerAdjustment row = careerAdjustmentDao.findById(id);
        if (row == null) {
            return false;
        }
        row.setStatus(normalizeStatus(status));
        row.setUpdatedAt(LocalDateTime.now());
        careerAdjustmentDao.save(row);
        return true;
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

    private String normalizeStatus(String status) {
        String normalized = nz(status).trim().toUpperCase(Locale.ENGLISH);
        if (!"INACTIVE".equals(normalized)) {
            return "ACTIVE";
        }
        return normalized;
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }
}
