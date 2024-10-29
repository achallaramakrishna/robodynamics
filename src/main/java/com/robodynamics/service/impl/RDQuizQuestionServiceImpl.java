package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;
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
    public void delete(RDQuizQuestion question) {
        rdQuizQuestionDao.delete(question);
    }

    @Override
    public List<RDQuizQuestion> getRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit) {
        return rdQuizQuestionDao.findRandomQuestionsBySessionDetailAndDifficultyLevels(sessionDetailId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuizQuestion> getRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit) {
        return rdQuizQuestionDao.findRandomQuestionsBySessionAndDifficultyLevels(sessionId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuizQuestion> getRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit) {
        return rdQuizQuestionDao.findRandomQuestionsByCourseAndDifficultyLevels(courseId, difficultyLevels, limit);
    }

	@Override
	public List<RDQuizQuestion> findQuestionsByIds(List<Integer> questionIds) {
		// TODO Auto-generated method stub
		return rdQuizQuestionDao.findQuestionsByIds(questionIds);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> findAll() {
		// TODO Auto-generated method stub
		return rdQuizQuestionDao.findAll();
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> findPaginated(int page, int size) {
		return rdQuizQuestionDao.findPaginated(page, size);
	}

	@Override
	@Transactional
	public long countQuestions() {
		return rdQuizQuestionDao.countQuestions();
	}

	@Override
	public List<RDQuizQuestion> getQuestionsBySlideId(int slideId, String questionType) {
		return rdQuizQuestionDao.getQuestionsBySlideId(slideId, questionType);
	}
}
