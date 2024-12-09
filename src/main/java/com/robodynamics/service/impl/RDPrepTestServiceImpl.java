package com.robodynamics.service.impl;

import com.robodynamics.dao.RDPrepTestDao;
import com.robodynamics.model.RDPrepTest;
import com.robodynamics.service.RDPrepTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDPrepTestServiceImpl implements RDPrepTestService {

    @Autowired
    private RDPrepTestDao prepTestDao;

    @Override
    public void savePrepTest(RDPrepTest prepTest) {
        prepTestDao.save(prepTest);
    }

    @Override
    public RDPrepTest getPrepTestById(int id) {
        return prepTestDao.findById(id);
    }

    @Override
    public List<RDPrepTest> getPrepTestsByLearningPathId(int learningPathId) {
        return prepTestDao.findByLearningPathId(learningPathId);
    }

    @Override
    public List<RDPrepTest> getAllPrepTests() {
        return prepTestDao.findAll();
    }

    @Override
    public void updatePrepTest(RDPrepTest prepTest) {
        prepTestDao.update(prepTest);
    }

    @Override
    public void deletePrepTestById(int id) {
        prepTestDao.deleteById(id);
    }
}
