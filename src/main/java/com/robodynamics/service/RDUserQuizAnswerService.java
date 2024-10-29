package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDUserQuizAnswer;

public interface RDUserQuizAnswerService {

	void saveRDUserQuizAnswer(RDUserQuizAnswer rdUserQuizAnswer);

	RDUserQuizAnswer getRDUserQuizAnswer(int answerId);

	List<RDUserQuizAnswer> getAnswersByUserAndQuiz(int userId, int quizId);

	void deleteRDUserQuizAnswer(int answerId);

	void saveOrUpdate(RDUserQuizAnswer rdUserQuizAnswer);

}
