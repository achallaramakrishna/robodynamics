package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamAttemptAnswer;

public interface RDExamAttemptAnswerDao {

    void saveOrUpdate(RDExamAttemptAnswer attemptAnswer);

    RDExamAttemptAnswer getById(int attemptAnswerId);

    RDExamAttemptAnswer findByAttemptAndQuestion(
            int attemptId,
            int examSectionQuestionId,
            int questionId
    );

    List<RDExamAttemptAnswer> findByAttemptId(int attemptId);

    List<RDExamAttemptAnswer> findByQuestionId(int questionId);

    void updateScore(int attemptAnswerId, double score);

    void deleteByAttemptId(int attemptId);
}
