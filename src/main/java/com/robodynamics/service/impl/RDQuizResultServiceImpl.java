package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizResultDao;
import com.robodynamics.model.RDQuizResult;
import com.robodynamics.service.RDQuizResultService;

@Service
public class RDQuizResultServiceImpl implements RDQuizResultService {

    @Autowired
    private RDQuizResultDao rdQuizResultDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDQuizResult quizResult) {
        rdQuizResultDao.saveOrUpdate(quizResult);
    }

    @Override
    @Transactional
    public RDQuizResult findById(int resultId) {
        return rdQuizResultDao.findById(resultId);
    }

    @Override
    @Transactional
    public List<RDQuizResult> findByUserId(int userId) {
        return rdQuizResultDao.findByUserId(userId);
    }

    @Override
    @Transactional
    public List<RDQuizResult> findByQuizId(int quizId) {
        return rdQuizResultDao.findByQuizId(quizId);
    }

    @Override
    @Transactional
    public void delete(RDQuizResult quizResult) {
        rdQuizResultDao.delete(quizResult);
    }
    
    
}
