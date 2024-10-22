package com.robodynamics.service;

import com.robodynamics.model.RDQuestion;
import com.robodynamics.model.RDQuestion.DifficultyLevel;
import com.robodynamics.model.RDSlide;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface RDQuestionService {

    // Save or update a question
    void saveOrUpdate(RDQuestion question);

    // Find a question by its ID
    RDQuestion findById(int questionId);

    // Delete a question
    void delete(RDQuestion question);

    // Find random questions by course and difficulty levels
    List<RDQuestion> findRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit);

    // Find random questions by session and difficulty levels
    List<RDQuestion> findRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit);

    // Find random questions by session detail and difficulty levels
    List<RDQuestion> findRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit);

    // Find questions by their IDs
    List<RDQuestion> findQuestionsByIds(List<Integer> questionIds);
    
 // Method to get questions by slide ID and question type
    List<RDQuestion> getQuestionsBySlideId(int slideId, String questionType);
    
    List<RDQuestion> getQuestionsBySlideId(int slideId);
    
    public void processJson(MultipartFile file, int selectedCourseSessionDetailId) throws Exception;
    
    List<RDQuestion> getQuestionsByCourseSessionDetailId(int courseSessionDetailId);

	RDQuestion getRandomQuestion();



}
