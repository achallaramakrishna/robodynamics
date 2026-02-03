package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamAnswerKey;

public interface RDExamAnswerKeyDao {

    void saveOrUpdate(RDExamAnswerKey answerKey);

    RDExamAnswerKey getById(int answerKeyId);

    RDExamAnswerKey findBySectionQuestionId(int examSectionQuestionId);

    RDExamAnswerKey findByExamAndQuestion(
            int examPaperId,
            int examSectionQuestionId,
            int questionId
    );

    List<RDExamAnswerKey> findByExamPaperId(int examPaperId);

    List<RDExamAnswerKey> findByQuestionId(int questionId);

    void deleteByExamPaperId(int examPaperId);
}
