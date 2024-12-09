package com.robodynamics.service.impl;

import com.robodynamics.dao.RDSchoolExamChapterDao;
import com.robodynamics.model.RDSchoolExamChapter;
import com.robodynamics.service.RDSchoolExamChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDSchoolExamChapterServiceImpl implements RDSchoolExamChapterService {

    @Autowired
    private RDSchoolExamChapterDao chapterDao;

    @Override
    public void saveSchoolExamChapter(RDSchoolExamChapter chapter) {
        chapterDao.save(chapter);
    }

    @Override
    public RDSchoolExamChapter getSchoolExamChapterById(int id) {
        return chapterDao.findById(id);
    }

    @Override
    public List<RDSchoolExamChapter> getSchoolExamChaptersBySubjectId(int subjectId) {
        return chapterDao.findBySubjectId(subjectId);
    }

    @Override
    public List<RDSchoolExamChapter> getAllSchoolExamChapters() {
        return chapterDao.findAll();
    }

    @Override
    public void updateSchoolExamChapter(RDSchoolExamChapter chapter) {
        chapterDao.update(chapter);
    }

    @Override
    public void deleteSchoolExamChapterById(int id) {
        chapterDao.deleteById(id);
    }
}
