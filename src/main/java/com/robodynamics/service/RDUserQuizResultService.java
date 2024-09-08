package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDUserQuizResults;

public interface RDUserQuizResultService {

    // Save or update a quiz result
    void saveOrUpdate(RDUserQuizResults quizResult);
    
    // Find a quiz result by its ID
    RDUserQuizResults findById(int resultId);
    
    // Find all quiz results for a specific user
    List<RDUserQuizResults> findByUserId(int userId);
    
    // Find all quiz results for a specific quiz
    List<RDUserQuizResults> findByQuizId(int quizId);
    
    // Find all quiz results
    List<RDUserQuizResults> findAll();
    
    // Delete a quiz result
    void delete(RDUserQuizResults quizResult);
    
 // Find quiz results for a specific user and quiz
    List<RDUserQuizResults> findByUserIdAndQuizId(int userId, int quizId);
    
    RDUserQuizResults findLatestByUserIdAndQuizId(int userId, int quizId);
}
