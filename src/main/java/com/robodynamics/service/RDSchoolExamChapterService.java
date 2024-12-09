package com.robodynamics.service;

import com.robodynamics.model.RDSchoolExamChapter;

import java.util.List;

public interface RDSchoolExamChapterService {
    void saveSchoolExamChapter(RDSchoolExamChapter chapter);
    RDSchoolExamChapter getSchoolExamChapterById(int id);
    List<RDSchoolExamChapter> getSchoolExamChaptersBySubjectId(int subjectId);
    List<RDSchoolExamChapter> getAllSchoolExamChapters();
    void updateSchoolExamChapter(RDSchoolExamChapter chapter);
    void deleteSchoolExamChapterById(int id);
}
