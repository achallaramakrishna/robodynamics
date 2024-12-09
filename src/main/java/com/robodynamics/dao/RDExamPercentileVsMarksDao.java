package com.robodynamics.dao;

import com.robodynamics.model.RDExamPercentileVsMarks;

import java.util.List;

public interface RDExamPercentileVsMarksDao {
    void save(RDExamPercentileVsMarks percentileVsMarks);
    RDExamPercentileVsMarks findById(int id);
    List<RDExamPercentileVsMarks> findByExamId(int examId);
    List<RDExamPercentileVsMarks> findAll();
    void update(RDExamPercentileVsMarks percentileVsMarks);
    void deleteById(int id);
}
