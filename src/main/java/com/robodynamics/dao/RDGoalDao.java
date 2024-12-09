package com.robodynamics.dao;

import com.robodynamics.model.RDGoal;

import java.util.List;

public interface RDGoalDao {
    RDGoal save(RDGoal goal);
    RDGoal findById(int id);
    List<RDGoal> findByLearningPathId(int learningPathId);
    List<RDGoal> findAll();
    void update(RDGoal goal);
    void deleteById(int id);
}
