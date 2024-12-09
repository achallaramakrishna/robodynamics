package com.robodynamics.dao;

import com.robodynamics.model.RDSchoolExamSubject;

import java.util.List;

public interface RDSchoolExamSubjectDao {
    void save(RDSchoolExamSubject subject);
    RDSchoolExamSubject findById(int id);
    List<RDSchoolExamSubject> findByExamId(int examId);
    List<RDSchoolExamSubject> findAll();
    void update(RDSchoolExamSubject subject);
    void deleteById(int id);
}
