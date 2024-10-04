package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDQuizQuestionMap;

public interface RDQuizQuestionMapDao {

    // Save a new quiz-question mapping
    void saveQuizQuestionMap(RDQuizQuestionMap quizQuestionMap);

    // Retrieve all mappings for a specific quiz
    List<RDQuizQuestionMap> getQuizQuestionMappingsByQuizId(int quizId);

    // Delete a mapping by quiz id and question id
    void deleteQuizQuestionMap(int quizId, int questionId);

    void addQuestionToQuiz(int quizId, int questionId);

	List<Integer> findQuestionIdsByQuizId(int quizId);
    

}