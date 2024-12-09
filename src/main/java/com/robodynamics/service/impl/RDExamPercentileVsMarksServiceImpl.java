package com.robodynamics.service.impl;

import com.robodynamics.dao.RDExamPercentileVsMarksDao;
import com.robodynamics.model.RDExamPercentileVsMarks;
import com.robodynamics.service.RDExamPercentileVsMarksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDExamPercentileVsMarksServiceImpl implements RDExamPercentileVsMarksService {

    @Autowired
    private RDExamPercentileVsMarksDao percentileVsMarksDao;

    @Override
    public void savePercentileVsMarks(RDExamPercentileVsMarks percentileVsMarks) {
        percentileVsMarksDao.save(percentileVsMarks);
    }

    @Override
    public RDExamPercentileVsMarks getPercentileVsMarksById(int id) {
        return percentileVsMarksDao.findById(id);
    }

    @Override
    public List<RDExamPercentileVsMarks> getPercentileVsMarksByExamId(int examId) {
        return percentileVsMarksDao.findByExamId(examId);
    }

    @Override
    public List<RDExamPercentileVsMarks> getAllPercentileVsMarks() {
        return percentileVsMarksDao.findAll();
    }

    @Override
    public void updatePercentileVsMarks(RDExamPercentileVsMarks percentileVsMarks) {
        percentileVsMarksDao.update(percentileVsMarks);
    }

    @Override
    public void deletePercentileVsMarksById(int id) {
        percentileVsMarksDao.deleteById(id);
    }
}
