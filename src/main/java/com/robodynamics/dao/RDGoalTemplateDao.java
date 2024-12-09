package com.robodynamics.dao;

import com.robodynamics.model.RDGoalTemplate;

import java.util.List;

public interface RDGoalTemplateDao {
    RDGoalTemplate findById(int id);
    List<RDGoalTemplate> findByExamType(String examType);
    List<RDGoalTemplate> findAll();
    void save(RDGoalTemplate goalTemplate);
    void update(RDGoalTemplate goalTemplate);
    void deleteById(int id);
}
