
package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuiz;

public interface RDQuizDao {
	
	public void saveRDQuiz(RDQuiz rdQuiz);

	public RDQuiz getRDQuiz(int quizId);
	
	public List < RDQuiz > getRDQuizzes();
	
    public void deleteRDQuiz(int id);

}
