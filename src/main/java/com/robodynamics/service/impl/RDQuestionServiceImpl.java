package com.robodynamics.service.impl;

import com.robodynamics.dao.RDQuestionDao;
import com.robodynamics.model.RDQuestion;
import com.robodynamics.model.RDQuestion.DifficultyLevel;
import com.robodynamics.service.RDQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RDQuestionServiceImpl implements RDQuestionService {

    @Autowired
    private RDQuestionDao questionDao;

    @Override
    public void saveOrUpdate(RDQuestion question) {
        questionDao.saveOrUpdate(question);
    }

    @Override
    public RDQuestion findById(int questionId) {
        return questionDao.findById(questionId);
    }

    @Override
    public void delete(RDQuestion question) {
        questionDao.delete(question);
    }

    @Override
    public List<RDQuestion> findRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit) {
        return questionDao.findRandomQuestionsByCourseAndDifficultyLevels(courseId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuestion> findRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit) {
        return questionDao.findRandomQuestionsBySessionAndDifficultyLevels(sessionId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuestion> findRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit) {
        return questionDao.findRandomQuestionsBySessionDetailAndDifficultyLevels(sessionDetailId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuestion> findQuestionsByIds(List<Integer> questionIds) {
        return questionDao.findQuestionsByIds(questionIds);
    }
    
    @Override
    public List<RDQuestion> getQuestionsBySlideId(int slideId, String questionType) {
        // Call the DAO method to get the questions filtered by slide ID and question type
        return questionDao.findQuestionsBySlideIdAndType(slideId, questionType);
    }
}
