package com.robodynamics.service;

import com.robodynamics.model.RDGoal;
import com.robodynamics.model.RDLearningPath;

import java.util.List;

public interface RDGoalService {
    void saveGoal(RDGoal goal);
    RDGoal getGoalById(int id);
    List<RDGoal> getGoalsByLearningPathId(int learningPathId);
    List<RDGoal> getAllGoals();
    void updateGoal(RDGoal goal);
    void deleteGoalById(int id);
    
   
    boolean generateGoalsForLearningPath(RDLearningPath learningPath);

}
