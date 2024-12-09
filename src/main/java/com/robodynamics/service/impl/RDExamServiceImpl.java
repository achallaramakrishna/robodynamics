package com.robodynamics.service.impl;

import com.robodynamics.dao.RDExamDao;
import com.robodynamics.model.RDExam;
import com.robodynamics.service.RDExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import javax.transaction.Transactional;

@Service
public class RDExamServiceImpl implements RDExamService {

    @Autowired
    private RDExamDao examDao;

    @Override
    @Transactional
    public void saveExam(RDExam exam) {
        examDao.save(exam);
    }

    @Override
    @Transactional
    public RDExam getExamById(int id) {
        return examDao.findById(id);
    }

    @Override
    @Transactional
    public List<RDExam> getAllExams() {
        return examDao.findAll();
    }

    @Override
    @Transactional
    public List<RDExam> getExamsByYear(int examYear) {
        return examDao.findByYear(examYear);
    }

    @Override
    @Transactional
    public void updateExam(RDExam exam) {
        examDao.update(exam);
    }

    @Override
    @Transactional
    public void deleteExamById(int id) {
        examDao.deleteById(id);
    }

	@Override
	@Transactional
	public List<RDExam> getAllExamsWithTargetDates() {
        return examDao.findAllWithTargetDates();

	}
}
