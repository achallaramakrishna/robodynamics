package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserQuizAnswerDao;
import com.robodynamics.model.RDUserQuizAnswer;
import com.robodynamics.service.RDUserQuizAnswerService;

@Service
@Transactional
public class RDUserQuizAnswerServiceImpl implements RDUserQuizAnswerService {

    @Autowired
    private RDUserQuizAnswerDao answerDao;

    @Override
    public void saveRDUserQuizAnswer(RDUserQuizAnswer rdUserQuizAnswer) {
        answerDao.saveRDUserQuizAnswer(rdUserQuizAnswer);
    }

    @Override
    public RDUserQuizAnswer getRDUserQuizAnswer(int answerId) {
        return answerDao.getRDUserQuizAnswer(answerId);
    }

    @Override
    public List<RDUserQuizAnswer> getAnswersByUserAndQuiz(int userId, int quizId) {
        return answerDao.getAnswersByUserAndQuiz(userId, quizId);
    }

    @Override
    public void deleteRDUserQuizAnswer(int answerId) {
        answerDao.deleteRDUserQuizAnswer(answerId);
    }

	@Override
	public void saveOrUpdate(RDUserQuizAnswer rdUserQuizAnswer) {
	      // Assuming answerId is the primary key; if it's zero or absent, we save a new record, otherwise update.
        if (rdUserQuizAnswer.getAnswerId() == 0) {
            answerDao.saveRDUserQuizAnswer(rdUserQuizAnswer);
        } else {
            // Existing record, update the details
            RDUserQuizAnswer existingAnswer = answerDao.getRDUserQuizAnswer(rdUserQuizAnswer.getAnswerId());
            if (existingAnswer != null) {
                existingAnswer.setQuizId(rdUserQuizAnswer.getQuizId());
                existingAnswer.setUserId(rdUserQuizAnswer.getUserId());
                existingAnswer.setQuestionId(rdUserQuizAnswer.getQuestionId());
                existingAnswer.setUserAnswer(rdUserQuizAnswer.getUserAnswer());
                existingAnswer.setCorrect(rdUserQuizAnswer.isCorrect());
                existingAnswer.setCreatedAt(rdUserQuizAnswer.getCreatedAt());

                // Save the updated record
                answerDao.saveRDUserQuizAnswer(existingAnswer);
            } else {
                // If not found, save as a new record
                answerDao.saveRDUserQuizAnswer(rdUserQuizAnswer);
            }
        }
    }
		
}

