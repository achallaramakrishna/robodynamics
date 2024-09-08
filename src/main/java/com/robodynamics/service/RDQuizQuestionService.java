package com.robodynamics.service;
import java.util.List;
import com.robodynamics.model.RDQuizQuestion;

public interface RDQuizQuestionService {

    // Create or update a quiz question
    void saveOrUpdate(RDQuizQuestion question);

    // Find question by its ID
    RDQuizQuestion findById(int questionId);

    // Find all questions for a specific quiz
    List<RDQuizQuestion> findByQuizId(int quizId);

    // Delete a question
    void delete(RDQuizQuestion question);
}
