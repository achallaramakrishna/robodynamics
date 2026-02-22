package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCICareerCatalog;

public interface RDCICareerCatalogDao {

    void save(RDCICareerCatalog row);

    RDCICareerCatalog findById(Long id);

    List<RDCICareerCatalog> findByModuleAndVersion(String moduleCode, String assessmentVersion);

    List<RDCICareerCatalog> findActiveByModuleAndVersion(String moduleCode, String assessmentVersion);
}
