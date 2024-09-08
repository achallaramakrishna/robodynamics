package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.service.RDQuizQuestionService;

@Service
public class RDQuizQuestionServiceImpl implements RDQuizQuestionService {

    @Autowired
    private RDQuizQuestionDao rdQuizQuestionDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDQuizQuestion question) {
        rdQuizQuestionDao.saveOrUpdate(question);
    }

    @Override
    @Transactional
    public RDQuizQuestion findById(int questionId) {
        return rdQuizQuestionDao.findById(questionId);
    }

    @Override
    @Transactional
    public List<RDQuizQuestion> findByQuizId(int quizId) {
        return rdQuizQuestionDao.findByQuizId(quizId);
    }

    @Override
    @Transactional
    public void delete(RDQuizQuestion question) {
        rdQuizQuestionDao.delete(question);
    }
}
