package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCICareerAdjustment;

public interface RDCICareerAdjustmentDao {

    void save(RDCICareerAdjustment row);

    RDCICareerAdjustment findById(Long id);

    List<RDCICareerAdjustment> findByModuleAndVersion(String moduleCode, String assessmentVersion);

    List<RDCICareerAdjustment> findActiveByModuleAndVersion(String moduleCode, String assessmentVersion);
}
