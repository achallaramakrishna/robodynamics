package com.robodynamics.dao;

import com.robodynamics.model.RDSchoolExam;

import java.util.List;

public interface RDSchoolExamDao {
    void save(RDSchoolExam schoolExam);
    RDSchoolExam findById(int id);
    List<RDSchoolExam> findByGradeLevel(int gradeLevel);
    List<RDSchoolExam> findByBoard(String board);
    List<RDSchoolExam> findAll();
    void update(RDSchoolExam schoolExam);
    void deleteById(int id);
}
