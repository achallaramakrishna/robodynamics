package com.robodynamics.dao;


import java.util.List;

import com.robodynamics.model.RDUserQuizAnswer;

public interface RDUserQuizAnswerDao {
    void saveRDUserQuizAnswer(RDUserQuizAnswer rdUserQuizAnswer);

    RDUserQuizAnswer getRDUserQuizAnswer(int answerId);
    
    List<RDUserQuizAnswer> getAnswersByUserAndQuiz(int userId, int quizId);
    
    void deleteRDUserQuizAnswer(int answerId);
}

