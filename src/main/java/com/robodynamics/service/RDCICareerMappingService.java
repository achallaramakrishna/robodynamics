package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCICareerAdjustment;
import com.robodynamics.model.RDCICareerCatalog;

public interface RDCICareerMappingService {

    List<RDCICareerCatalog> getActiveCareerCatalog(String moduleCode, String assessmentVersion);

    List<RDCICareerAdjustment> getActiveAdjustments(String moduleCode, String assessmentVersion);

    List<RDCICareerCatalog> getCareerCatalog(String moduleCode, String assessmentVersion, boolean includeInactive);

    List<RDCICareerAdjustment> getAdjustments(String moduleCode, String assessmentVersion, boolean includeInactive);

    RDCICareerCatalog getCareerCatalogById(Long id);

    RDCICareerAdjustment getCareerAdjustmentById(Long id);

    RDCICareerCatalog saveCareerCatalog(RDCICareerCatalog row);

    RDCICareerAdjustment saveCareerAdjustment(RDCICareerAdjustment row);

    boolean updateCareerCatalogStatus(Long id, String status);

    boolean updateCareerAdjustmentStatus(Long id, String status);
}
