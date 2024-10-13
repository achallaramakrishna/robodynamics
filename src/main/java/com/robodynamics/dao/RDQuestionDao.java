package com.robodynamics.dao;

import com.robodynamics.model.RDQuestion;
import com.robodynamics.model.RDQuestion.DifficultyLevel;
import com.robodynamics.model.RDQuizOption;

import java.util.List;

public interface RDQuestionDao {

    // Save or update a question
    void saveOrUpdate(RDQuestion question);

    // Find a question by its ID
    RDQuestion findById(int questionId);

    // Delete a question
    void delete(RDQuestion question);

    // Find random questions by course and difficulty levels, limited to a specific number
    List<RDQuestion> findRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit);

    // Find random questions by session and difficulty levels
    List<RDQuestion> findRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit);

    // Find random questions by session detail and difficulty levels
    List<RDQuestion> findRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit);

    // Find questions by their IDs
    List<RDQuestion> findQuestionsByIds(List<Integer> questionIds);
    
    // Method to fetch questions by slide ID and question type
    List<RDQuestion> findQuestionsBySlideIdAndType(int slideId, String questionType);
    
    void saveAll(List<RDQuestion> questions);  // Add bulk save method
    
    List<RDQuestion> findBySlideId(int slideId);
    
    List<RDQuizOption> getOptionsForQuestion(int questionId);  // New method for fetching options
    
    public RDQuestion findBySlideIdAndQuestionNumber(int slideId, int questionNumber);

	List<RDQuestion> getQuestionsByCourseSessionDetailId(int courseSessionDetailId);




    
}
