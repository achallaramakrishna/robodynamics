package com.robodynamics.service;
import java.util.List;
import java.util.Map;

import com.robodynamics.dto.RDStudentQuizSummary;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.wrapper.ProjectGroup;

public interface RDQuizService {
	
	List<RDQuiz> getPaginatedQuizzes(int page, int size);

	long getTotalQuizzesCount();

    // Create or update a quiz
    void saveOrUpdate(RDQuiz quiz);

    // Find quiz by its ID
    RDQuiz findById(int quizId);

    // Find all available quizzes
    List<RDQuiz> findAll();

    // Delete a quiz
    void delete(RDQuiz quiz);
    
    // Process submitted answers (map question IDs to selected option IDs)
    Map<Integer, Integer> processAnswers(Map<String, String> answers, List<RDQuizQuestion> quizQuestions);

    // Evaluate the quiz and return whether the user passed or not
    boolean evaluateQuiz(int quizId, Map<Integer, Integer> selectedAnswers);

	int calculatePoints(List<RDQuizQuestion> quizQuestions, Map<Integer, Integer> selectedAnswers);
    
    void addQuestionToQuiz(int quizId, int questionId);
    
    List<RDQuiz> getQuizzesFiltered(Integer courseId, String status, String difficultyLevel);

    List<ProjectGroup<RDQuiz>> getQuizzesGroupedByCategory();
    
    List<ProjectGroup<RDQuiz>> getQuizzesGroupedByGradeRange();
    
    List<RDQuiz> getFeaturedQuizzes();
    
    List<RDQuiz> searchQuizzes(String query);

    
    List<RDQuiz> findQuizzesByCreator(int userId); // Quizzes created by the user
    
    List<RDQuiz> findQuizzesForStudent(int studentId); // Quizzes visible to a student

	List<RDQuiz> findByFilters(Integer courseId, Integer sessionId, Integer sessionDetailId);

	List<RDStudentQuizSummary> getQuizSummaryByUserAndCourse(Integer userID, int courseId);

	List<RDQuiz> findByCourseSession(int courseSessionId);
	

}
