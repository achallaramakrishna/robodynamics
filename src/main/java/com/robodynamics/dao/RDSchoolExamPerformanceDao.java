package com.robodynamics.dao;

import com.robodynamics.model.RDSchoolExamPerformance;

import java.util.List;

public interface RDSchoolExamPerformanceDao {
    void save(RDSchoolExamPerformance performance);
    RDSchoolExamPerformance findById(int id);
    List<RDSchoolExamPerformance> findByStudentId(int studentId);
    List<RDSchoolExamPerformance> findByExamId(int examId);
    List<RDSchoolExamPerformance> findAll();
    void update(RDSchoolExamPerformance performance);
    void deleteById(int id);
}
