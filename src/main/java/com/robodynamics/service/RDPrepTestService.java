package com.robodynamics.service;

import com.robodynamics.model.RDPrepTest;

import java.util.List;

public interface RDPrepTestService {
    void savePrepTest(RDPrepTest prepTest);
    RDPrepTest getPrepTestById(int id);
    List<RDPrepTest> getPrepTestsByLearningPathId(int learningPathId);
    List<RDPrepTest> getAllPrepTests();
    void updatePrepTest(RDPrepTest prepTest);
    void deletePrepTestById(int id);
}
