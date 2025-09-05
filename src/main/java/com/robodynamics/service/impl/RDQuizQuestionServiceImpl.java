package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;
import com.robodynamics.model.RDQuizQuestion.TierLevel;
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
	@Transactional
	public List<RDQuizQuestion> getQuestionsBySlideId(int slideId, String questionType) {
		return rdQuizQuestionDao.getQuestionsBySlideId(slideId, questionType);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> getQuestionsByTierLevel(TierLevel tierLevel) {
		return rdQuizQuestionDao.findByTierLevel(tierLevel);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> getQuestionsByTierLevelAndDifficulty(TierLevel tierLevel, String difficultyLevel) {
		return rdQuizQuestionDao.findByTierLevelAndDifficulty(tierLevel, difficultyLevel);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> getQuestionsByTierLevelOrdered(TierLevel tierLevel) {
		return rdQuizQuestionDao.findByTierLevelOrderedByTierOrder(tierLevel);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> findQuestionsByQuizId(int quizId) {
		
		return rdQuizQuestionDao.findQuestionsByQuizId(quizId);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> findQuestionsByCriteria(Integer courseId, List<Integer> courseSessionIds,
			List<String> questionTypes, List<String> difficultyLevels, int limit) {
		
		return rdQuizQuestionDao.findQuestionsByCriteria(courseId, courseSessionIds, questionTypes, difficultyLevels, limit);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> findByFilters(Integer courseId, Integer sessionId, Integer sessionDetailId,
			Integer quizId) {
		  // implement with HQL or Criteria based on what filters are provided
	    // start broad and narrow down
	    // e.g. if quizId != null → filter by quiz
	    // else if sessionDetailId != null → filter by sessionDetail
	    // else if sessionId != null → filter by session
	    // else if courseId != null → filter by course
	    return rdQuizQuestionDao.findByFilters(courseId, sessionId, sessionDetailId, quizId);
	}

	@Override
	@Transactional
	public List<RDQuizQuestion> findByFilters(Integer courseId, Integer sessionId, Integer sessionDetailId,
			Integer quizId, int limit, int offset) {
        return rdQuizQuestionDao.findByFilters(courseId, sessionId, sessionDetailId, quizId, limit, offset);

	}

	@Override
	@Transactional
	public long countByFilters(Integer courseId, Integer sessionId, Integer sessionDetailId, Integer quizId) {
        return rdQuizQuestionDao.countByFilters(courseId, sessionId, sessionDetailId, quizId);

	}

	

	
}
