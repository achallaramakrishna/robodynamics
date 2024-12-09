package com.robodynamics.service.impl;

import com.robodynamics.dao.RDTestQuestionDao;
import com.robodynamics.model.RDTestQuestion;
import com.robodynamics.service.RDTestQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDTestQuestionServiceImpl implements RDTestQuestionService {

    @Autowired
    private RDTestQuestionDao testQuestionDao;

    @Override
    public void saveTestQuestion(RDTestQuestion testQuestion) {
        testQuestionDao.save(testQuestion);
    }

    @Override
    public RDTestQuestion getTestQuestionById(int id) {
        return testQuestionDao.findById(id);
    }

    @Override
    public List<RDTestQuestion> getTestQuestionsByTestId(int testId) {
        return testQuestionDao.findByTestId(testId);
    }

    @Override
    public List<RDTestQuestion> getAllTestQuestions() {
        return testQuestionDao.findAll();
    }

    @Override
    public void updateTestQuestion(RDTestQuestion testQuestion) {
        testQuestionDao.update(testQuestion);
    }

    @Override
    public void deleteTestQuestionById(int id) {
        testQuestionDao.deleteById(id);
    }
}
