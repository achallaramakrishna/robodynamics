package com.robodynamics.service;

import com.robodynamics.model.RDSchoolExam;

import java.util.List;

public interface RDSchoolExamService {
    void saveSchoolExam(RDSchoolExam schoolExam);
    RDSchoolExam getSchoolExamById(int id);
    List<RDSchoolExam> getSchoolExamsByGradeLevel(int gradeLevel);
    List<RDSchoolExam> getSchoolExamsByBoard(String board);
    List<RDSchoolExam> getAllSchoolExams();
    void updateSchoolExam(RDSchoolExam schoolExam);
    void deleteSchoolExamById(int id);
}
