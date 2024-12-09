package com.robodynamics.service;

import com.robodynamics.model.RDSchoolExamSubject;

import java.util.List;

public interface RDSchoolExamSubjectService {
    void saveExamSubject(RDSchoolExamSubject subject);
    RDSchoolExamSubject getExamSubjectById(int id);
    List<RDSchoolExamSubject> getExamSubjectsByExamId(int examId);
    List<RDSchoolExamSubject> getAllExamSubjects();
    void updateExamSubject(RDSchoolExamSubject subject);
    void deleteExamSubjectById(int id);
}
