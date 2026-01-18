package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.dto.RDStudentQuizSummary;
import com.robodynamics.model.RDUserQuizResults;

public interface RDUserQuizResultDao {
    
    // Save or update a quiz result
    void saveOrUpdate(RDUserQuizResults quizResult);
    
    // Find a quiz result by its ID
    RDUserQuizResults findById(int resultId);
    
    // Find all quiz results for a specific user
    List<RDUserQuizResults> findByUserId(int userId);
    
    // Find all quiz results for a specific quiz
    List<RDUserQuizResults> findByQuizId(int quizId);
    
    // Delete a quiz result
    void delete(RDUserQuizResults quizResult);
    
    // Find all quiz results
    List<RDUserQuizResults> findAll();
    
 // Find quiz results for a specific user and quiz
    List<RDUserQuizResults> findByUserIdAndQuizId(int userId, int quizId);

 // Method to count quizzes taken by a specific user
    public int countQuizzesTakenByUser(int userId);
    
    List<RDStudentQuizSummary> getQuizSummaryByUserAndCourse(
            int userId, int courseId);

	RDUserQuizResults findLatestByUserAndQuiz(Integer userID, int quizId);
    
}
