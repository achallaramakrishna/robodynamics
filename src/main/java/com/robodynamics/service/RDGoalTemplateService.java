package com.robodynamics.service;

import com.robodynamics.model.RDGoalTemplate;

import java.util.List;

public interface RDGoalTemplateService {
    RDGoalTemplate getGoalTemplateById(int id);
    List<RDGoalTemplate> getGoalTemplatesByExamType(String examType);
    List<RDGoalTemplate> getAllGoalTemplates();
    void saveGoalTemplate(RDGoalTemplate goalTemplate);
    void updateGoalTemplate(RDGoalTemplate goalTemplate);
    void deleteGoalTemplateById(int id);
}
