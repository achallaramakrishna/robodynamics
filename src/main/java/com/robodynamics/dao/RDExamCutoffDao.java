package com.robodynamics.dao;

import com.robodynamics.model.RDExamCutoff;

import java.util.List;

public interface RDExamCutoffDao {
    void save(RDExamCutoff cutoff);
    RDExamCutoff findById(int id);
    List<RDExamCutoff> findByExamId(int examId);
    List<RDExamCutoff> findAll();
    void update(RDExamCutoff cutoff);
    void deleteById(int id);
}
