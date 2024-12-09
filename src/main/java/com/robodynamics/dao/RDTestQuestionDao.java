package com.robodynamics.dao;

import com.robodynamics.model.RDTestQuestion;

import java.util.List;

public interface RDTestQuestionDao {
    void save(RDTestQuestion testQuestion);
    RDTestQuestion findById(int id);
    List<RDTestQuestion> findByTestId(int testId);
    List<RDTestQuestion> findAll();
    void update(RDTestQuestion testQuestion);
    void deleteById(int id);
}
