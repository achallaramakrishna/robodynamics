package com.robodynamics.dao;

import com.robodynamics.model.RDPrepTest;

import java.util.List;

public interface RDPrepTestDao {
    void save(RDPrepTest prepTest);
    RDPrepTest findById(int id);
    List<RDPrepTest> findByLearningPathId(int learningPathId);
    List<RDPrepTest> findAll();
    void update(RDPrepTest prepTest);
    void deleteById(int id);
}
