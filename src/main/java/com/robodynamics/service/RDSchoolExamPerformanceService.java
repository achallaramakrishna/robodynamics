package com.robodynamics.service;

import com.robodynamics.model.RDSchoolExamPerformance;

import java.util.List;

public interface RDSchoolExamPerformanceService {
    void saveExamPerformance(RDSchoolExamPerformance performance);
    RDSchoolExamPerformance getExamPerformanceById(int id);
    List<RDSchoolExamPerformance> getExamPerformancesByStudentId(int studentId);
    List<RDSchoolExamPerformance> getExamPerformancesByExamId(int examId);
    List<RDSchoolExamPerformance> getAllExamPerformances();
    void updateExamPerformance(RDSchoolExamPerformance performance);
    void deleteExamPerformanceById(int id);
}
