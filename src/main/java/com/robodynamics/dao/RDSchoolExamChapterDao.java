package com.robodynamics.dao;

import com.robodynamics.model.RDSchoolExamChapter;

import java.util.List;

public interface RDSchoolExamChapterDao {
    void save(RDSchoolExamChapter chapter);
    RDSchoolExamChapter findById(int id);
    List<RDSchoolExamChapter> findBySubjectId(int subjectId);
    List<RDSchoolExamChapter> findAll();
    void update(RDSchoolExamChapter chapter);
    void deleteById(int id);
}
