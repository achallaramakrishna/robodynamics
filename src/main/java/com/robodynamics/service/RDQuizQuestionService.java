package com.robodynamics.service;
import java.util.List;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;

public interface RDQuizQuestionService {

    List<RDQuizQuestion> getQuestionsBySlideId(int slideId, String questionType);

    
	List<RDQuizQuestion> findPaginated(int page, int size);
	
    List<RDQuizQuestion> findQuestionsByQuizId(int quizId);

	long countQuestions(); 
	
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

    List<RDQuizQuestion> findAll();
    
    List<RDQuizQuestion> getQuestionsByTierLevel(RDQuizQuestion.TierLevel tierLevel);

    List<RDQuizQuestion> getQuestionsByTierLevelAndDifficulty(RDQuizQuestion.TierLevel tierLevel, String difficultyLevel);
    
    List<RDQuizQuestion> getQuestionsByTierLevelOrdered(RDQuizQuestion.TierLevel tierLevel);


   // List<RDQuizQuestion> findQuestionsByCriteria(Integer courseId, Integer courseSessionId, List<String> questionTypes, List<String> difficultyLevels, int limit);
    List<RDQuizQuestion> findQuestionsByCriteria(
	        Integer courseId, 
	        List<Integer> courseSessionIds, 
	        List<String> questionTypes, 
	        List<String> difficultyLevels, 
	        int limit);
    
    public List<RDQuizQuestion> findByFilters(Integer courseId, Integer sessionId, Integer sessionDetailId, Integer quizId);

    List<RDQuizQuestion> findByFilters(Integer courseId,
            Integer sessionId,
            Integer sessionDetailId,
            Integer quizId,
            int limit,
            int offset);

	long countByFilters(Integer courseId,
		Integer sessionId,
		Integer sessionDetailId,
		Integer quizId);

}
