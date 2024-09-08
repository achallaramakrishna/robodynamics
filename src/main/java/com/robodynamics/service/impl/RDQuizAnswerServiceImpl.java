package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizAnswerDao;
import com.robodynamics.model.RDQuizAnswer;
import com.robodynamics.service.RDQuizAnswerService;

@Service
public class RDQuizAnswerServiceImpl implements RDQuizAnswerService {

    @Autowired
    private RDQuizAnswerDao rdQuizAnswerDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDQuizAnswer quizAnswer) {
        rdQuizAnswerDao.saveOrUpdate(quizAnswer);
    }

    @Override
    @Transactional
    public List<RDQuizAnswer> findByResultId(int resultId) {
        return rdQuizAnswerDao.findByResultId(resultId);
    }

    @Override
    @Transactional
    public RDQuizAnswer findById(int answerId) {
        return rdQuizAnswerDao.findById(answerId);
    }

    @Override
    @Transactional
    public void delete(RDQuizAnswer quizAnswer) {
        rdQuizAnswerDao.delete(quizAnswer);
    }
}
