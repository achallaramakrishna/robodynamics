package com.robodynamics.service;
import java.util.List;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;

public interface RDQuizQuestionService {

    // Create or update a quiz question
    void saveOrUpdate(RDQuizQuestion question);

    // Find question by its ID
    RDQuizQuestion findById(int questionId);

    // Delete a question
    void delete(RDQuizQuestion question);

    // Fetch random questions by session detail and difficulty levels
    List<RDQuizQuestion> getRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit);

    // Fetch random questions by session and difficulty levels
    List<RDQuizQuestion> getRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit);

    // Fetch random questions by course and difficulty levels
    List<RDQuizQuestion> getRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit);

    List<RDQuizQuestion> findQuestionsByIds(List<Integer> questionIds);

}
