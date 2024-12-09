package com.robodynamics.service.impl;

import com.robodynamics.dao.RDSchoolExamSubjectDao;
import com.robodynamics.model.RDSchoolExamSubject;
import com.robodynamics.service.RDSchoolExamSubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDSchoolExamSubjectServiceImpl implements RDSchoolExamSubjectService {

    @Autowired
    private RDSchoolExamSubjectDao subjectDao;

    @Override
    public void saveExamSubject(RDSchoolExamSubject subject) {
        subjectDao.save(subject);
    }

    @Override
    public RDSchoolExamSubject getExamSubjectById(int id) {
        return subjectDao.findById(id);
    }

    @Override
    public List<RDSchoolExamSubject> getExamSubjectsByExamId(int examId) {
        return subjectDao.findByExamId(examId);
    }

    @Override
    public List<RDSchoolExamSubject> getAllExamSubjects() {
        return subjectDao.findAll();
    }

    @Override
    public void updateExamSubject(RDSchoolExamSubject subject) {
        subjectDao.update(subject);
    }

    @Override
    public void deleteExamSubjectById(int id) {
        subjectDao.deleteById(id);
    }
}
