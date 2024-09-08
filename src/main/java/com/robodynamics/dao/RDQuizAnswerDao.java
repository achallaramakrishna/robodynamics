package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizAnswer;

public interface RDQuizAnswerDao {

    // Create or update a quiz answer (multiple-choice or fill-in-the-blank)
    void saveOrUpdate(RDQuizAnswer quizAnswer);

    // Find all answers by result ID
    List<RDQuizAnswer> findByResultId(int resultId);

    // Find a specific answer by its ID
    RDQuizAnswer findById(int answerId);

    // Delete a quiz answer
    void delete(RDQuizAnswer quizAnswer);
}
