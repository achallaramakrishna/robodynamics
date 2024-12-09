package com.robodynamics.service.impl;

import com.robodynamics.dao.RDSchoolExamDao;
import com.robodynamics.model.RDSchoolExam;
import com.robodynamics.service.RDSchoolExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDSchoolExamServiceImpl implements RDSchoolExamService {

    @Autowired
    private RDSchoolExamDao schoolExamDao;

    @Override
    public void saveSchoolExam(RDSchoolExam schoolExam) {
        schoolExamDao.save(schoolExam);
    }

    @Override
    public RDSchoolExam getSchoolExamById(int id) {
        return schoolExamDao.findById(id);
    }

    @Override
    public List<RDSchoolExam> getSchoolExamsByGradeLevel(int gradeLevel) {
        return schoolExamDao.findByGradeLevel(gradeLevel);
    }

    @Override
    public List<RDSchoolExam> getSchoolExamsByBoard(String board) {
        return schoolExamDao.findByBoard(board);
    }

    @Override
    public List<RDSchoolExam> getAllSchoolExams() {
        return schoolExamDao.findAll();
    }

    @Override
    public void updateSchoolExam(RDSchoolExam schoolExam) {
        schoolExamDao.update(schoolExam);
    }

    @Override
    public void deleteSchoolExamById(int id) {
        schoolExamDao.deleteById(id);
    }
}
