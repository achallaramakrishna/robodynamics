package com.robodynamics.service.impl;

import com.robodynamics.dao.RDExamCutoffDao;
import com.robodynamics.model.RDExamCutoff;
import com.robodynamics.service.RDExamCutoffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDExamCutoffServiceImpl implements RDExamCutoffService {

    @Autowired
    private RDExamCutoffDao cutoffDao;

    @Override
    public void saveCutoff(RDExamCutoff cutoff) {
        cutoffDao.save(cutoff);
    }

    @Override
    public RDExamCutoff getCutoffById(int id) {
        return cutoffDao.findById(id);
    }

    @Override
    public List<RDExamCutoff> getCutoffsByExamId(int examId) {
        return cutoffDao.findByExamId(examId);
    }

    @Override
    public List<RDExamCutoff> getAllCutoffs() {
        return cutoffDao.findAll();
    }

    @Override
    public void updateCutoff(RDExamCutoff cutoff) {
        cutoffDao.update(cutoff);
    }

    @Override
    public void deleteCutoffById(int id) {
        cutoffDao.deleteById(id);
    }
}
