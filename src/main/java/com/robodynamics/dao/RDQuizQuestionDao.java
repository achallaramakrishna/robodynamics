package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;

import java.util.List;

public interface RDQuizQuestionDao {

	
    List<RDQuizQuestion> getQuestionsBySlideId(int slideId, String questionType);

    
    // Create or update a quiz question
    void saveOrUpdate(RDQuizQuestion question);

    // Find question by its ID
    RDQuizQuestion findById(int questionId);

    // Delete a question
    void delete(RDQuizQuestion question);

    List<RDQuizQuestion> findRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit);
    
    List<RDQuizQuestion> findRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit);
    
    List<RDQuizQuestion> findRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit);

    List<RDQuizQuestion> findQuestionsByIds(List<Integer> questionIds);

	List<RDQuizQuestion> findAll();

	List<RDQuizQuestion> findPaginated(int page, int size);

	long countQuestions();

    List<RDQuizQuestion> findByTierLevel(RDQuizQuestion.TierLevel tierLevel);

    List<RDQuizQuestion> findByTierLevelAndDifficulty(RDQuizQuestion.TierLevel tierLevel, String difficultyLevel);
    
    List<RDQuizQuestion> findByTierLevelOrderedByTierOrder(RDQuizQuestion.TierLevel tierLevel);

}
