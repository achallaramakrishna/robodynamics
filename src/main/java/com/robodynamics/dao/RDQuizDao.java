
package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuiz;

public interface RDQuizDao {

    // Create or update a quiz
    void saveOrUpdate(RDQuiz quiz);

    // Find quiz by its ID
    RDQuiz findById(int quizId);

    // Find all available quizzes
    List<RDQuiz> findAll();

    // Delete a quiz
    void delete(RDQuiz quiz);
}
