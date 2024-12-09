package com.robodynamics.service;

import com.robodynamics.model.RDTestQuestion;

import java.util.List;

public interface RDTestQuestionService {
    void saveTestQuestion(RDTestQuestion testQuestion);
    RDTestQuestion getTestQuestionById(int id);
    List<RDTestQuestion> getTestQuestionsByTestId(int testId);
    List<RDTestQuestion> getAllTestQuestions();
    void updateTestQuestion(RDTestQuestion testQuestion);
    void deleteTestQuestionById(int id);
}
