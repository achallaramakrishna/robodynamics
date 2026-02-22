package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCIQuestionBank;

public interface RDCIQuestionBankService {

    List<RDCIQuestionBank> getOrSeedActiveQuestions(String moduleCode, String assessmentVersion);

    RDCIQuestionBank getByModuleVersionAndQuestionCode(String moduleCode, String assessmentVersion, String questionCode);
}
