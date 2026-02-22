package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCIQuestionBank;

public interface RDCIQuestionBankDao {

    void save(RDCIQuestionBank question);

    List<RDCIQuestionBank> findActiveByModuleAndVersion(String moduleCode, String assessmentVersion);

    RDCIQuestionBank findByModuleVersionAndQuestionCode(String moduleCode, String assessmentVersion, String questionCode);

    long countByModuleAndVersion(String moduleCode, String assessmentVersion);
}
