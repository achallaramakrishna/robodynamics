package com.robodynamics.service.impl;

import com.robodynamics.dao.RDGoalTemplateDao;
import com.robodynamics.model.RDGoalTemplate;
import com.robodynamics.service.RDGoalTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RDGoalTemplateServiceImpl implements RDGoalTemplateService {

    @Autowired
    private RDGoalTemplateDao goalTemplateDao;

    @Override
    public RDGoalTemplate getGoalTemplateById(int id) {
        return goalTemplateDao.findById(id);
    }

    @Override
    public List<RDGoalTemplate> getGoalTemplatesByExamType(String examType) {
        return goalTemplateDao.findByExamType(examType);
    }

    @Override
    public List<RDGoalTemplate> getAllGoalTemplates() {
        return goalTemplateDao.findAll();
    }

    @Override
    public void saveGoalTemplate(RDGoalTemplate goalTemplate) {
        goalTemplateDao.save(goalTemplate);
    }

    @Override
    public void updateGoalTemplate(RDGoalTemplate goalTemplate) {
        goalTemplateDao.update(goalTemplate);
    }

    @Override
    public void deleteGoalTemplateById(int id) {
        goalTemplateDao.deleteById(id);
    }
}
