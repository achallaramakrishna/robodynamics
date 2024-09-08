package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizResult;

public interface RDQuizResultDao {

    // Create or update a quiz result (record start, end, and score)
    void saveOrUpdate(RDQuizResult quizResult);

    // Find quiz result by its ID
    RDQuizResult findById(int resultId);

    // Find all quiz results for a specific user
    List<RDQuizResult> findByUserId(int userId);

    // Find all quiz results for a specific quiz
    List<RDQuizResult> findByQuizId(int quizId);

    // Delete a quiz result
    void delete(RDQuizResult quizResult);
}
