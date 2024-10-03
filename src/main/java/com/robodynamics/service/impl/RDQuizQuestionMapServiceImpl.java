package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizQuestionMapDao;
import com.robodynamics.model.RDQuizQuestionMap;
import com.robodynamics.service.RDQuizQuestionMapService;

@Service
@Transactional
public class RDQuizQuestionMapServiceImpl implements RDQuizQuestionMapService {

    @Autowired
    private RDQuizQuestionMapDao quizQuestionMapDao;

    @Override
    public void saveQuizQuestionMap(RDQuizQuestionMap quizQuestionMap) {
        quizQuestionMapDao.saveQuizQuestionMap(quizQuestionMap);
    }

    @Override
    public List<RDQuizQuestionMap> getQuizQuestionMappingsByQuizId(int quizId) {
        return quizQuestionMapDao.getQuizQuestionMappingsByQuizId(quizId);
    }

    @Override
    public void deleteQuizQuestionMap(int quizId, int questionId) {
        quizQuestionMapDao.deleteQuizQuestionMap(quizId, questionId);
    }

	@Override
	public List<Integer> findQuestionIdsByQuizId(int quizId) {
		return quizQuestionMapDao.findQuestionIdsByQuizId(quizId);
	}
}
