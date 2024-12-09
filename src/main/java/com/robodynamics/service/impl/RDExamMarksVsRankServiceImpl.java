package com.robodynamics.service.impl;

import com.robodynamics.dao.RDExamMarksVsRankDao;
import com.robodynamics.model.RDExamMarksVsRank;
import com.robodynamics.service.RDExamMarksVsRankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDExamMarksVsRankServiceImpl implements RDExamMarksVsRankService {

    @Autowired
    private RDExamMarksVsRankDao marksVsRankDao;

    @Override
    public void saveMarksVsRank(RDExamMarksVsRank marksVsRank) {
        marksVsRankDao.save(marksVsRank);
    }

    @Override
    public RDExamMarksVsRank getMarksVsRankById(int id) {
        return marksVsRankDao.findById(id);
    }

    @Override
    public List<RDExamMarksVsRank> getMarksVsRankByExamId(int examId) {
        return marksVsRankDao.findByExamId(examId);
    }

    @Override
    public List<RDExamMarksVsRank> getAllMarksVsRank() {
        return marksVsRankDao.findAll();
    }

    @Override
    public void updateMarksVsRank(RDExamMarksVsRank marksVsRank) {
        marksVsRankDao.update(marksVsRank);
    }

    @Override
    public void deleteMarksVsRankById(int id) {
        marksVsRankDao.deleteById(id);
    }
}
