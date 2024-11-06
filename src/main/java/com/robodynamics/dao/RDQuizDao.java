
package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.wrapper.ProjectGroup;

public interface RDQuizDao {

	List<RDQuiz> getPaginatedQuizzes(int pageNumber, int pageSize);
	
	long getTotalQuizzesCount();

    // Create or update a quiz
    void saveOrUpdate(RDQuiz quiz);

    // Find quiz by its ID
    RDQuiz findById(int quizId);

    // Find all available quizzes
    List<RDQuiz> findAll();

    // Delete a quiz
    void delete(RDQuiz quiz);
    
    List<RDQuiz> findQuizzesByFilters(Integer courseId, String status, String difficultyLevel);

	List<ProjectGroup<RDQuiz>> getQuizzesGroupedByCategory();
    
    List<ProjectGroup<RDQuiz>> getQuizzesGroupedByGradeRange();

    List<RDQuiz> getFeaturedQuizzes();
    
    List<RDQuiz> searchQuizzes(String query);

}
