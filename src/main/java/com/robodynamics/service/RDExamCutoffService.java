package com.robodynamics.service;

import com.robodynamics.model.RDExamCutoff;

import java.util.List;

public interface RDExamCutoffService {
    void saveCutoff(RDExamCutoff cutoff);
    RDExamCutoff getCutoffById(int id);
    List<RDExamCutoff> getCutoffsByExamId(int examId);
    List<RDExamCutoff> getAllCutoffs();
    void updateCutoff(RDExamCutoff cutoff);
    void deleteCutoffById(int id);
}
