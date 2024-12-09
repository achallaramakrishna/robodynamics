package com.robodynamics.service.impl;

import com.robodynamics.dao.RDSchoolExamPerformanceDao;
import com.robodynamics.model.RDSchoolExamPerformance;
import com.robodynamics.service.RDSchoolExamPerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDSchoolExamPerformanceServiceImpl implements RDSchoolExamPerformanceService {

    @Autowired
    private RDSchoolExamPerformanceDao performanceDao;

    @Override
    public void saveExamPerformance(RDSchoolExamPerformance performance) {
        performanceDao.save(performance);
    }

    @Override
    public RDSchoolExamPerformance getExamPerformanceById(int id) {
        return performanceDao.findById(id);
    }

    @Override
    public List<RDSchoolExamPerformance> getExamPerformancesByStudentId(int studentId) {
        return performanceDao.findByStudentId(studentId);
    }

    @Override
    public List<RDSchoolExamPerformance> getExamPerformancesByExamId(int examId) {
        return performanceDao.findByExamId(examId);
    }

    @Override
    public List<RDSchoolExamPerformance> getAllExamPerformances() {
        return performanceDao.findAll();
    }

    @Override
    public void updateExamPerformance(RDSchoolExamPerformance performance) {
        performanceDao.update(performance);
    }

    @Override
    public void deleteExamPerformanceById(int id) {
        performanceDao.deleteById(id);
    }
}
