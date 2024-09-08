package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizQuestion;

import java.util.List;

public interface RDQuizQuestionDao {

    // Create or update a quiz question
    void saveOrUpdate(RDQuizQuestion question);

    // Find question by its ID
    RDQuizQuestion findById(int questionId);

    // Find all questions for a specific quiz
    List<RDQuizQuestion> findByQuizId(int quizId);

    // Delete a question
    void delete(RDQuizQuestion question);
}
