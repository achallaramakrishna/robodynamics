package com.robodynamics.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDTemplateStepDAO;
import com.robodynamics.model.RDTemplateStep;
import com.robodynamics.service.RDTemplateStepService;

@Service
@Transactional
public class RDTemplateStepServiceImpl implements RDTemplateStepService {

    @Autowired
    private RDTemplateStepDAO templateStepDAO;

    // Existing methods
    @Override
    public void saveStep(RDTemplateStep step) {
        templateStepDAO.saveStep(step);
    }

    @Override
    public RDTemplateStep getStepById(int stepId) {
        return templateStepDAO.getStepById(stepId);
    }

    @Override
    public List<RDTemplateStep> getStepsByTemplateId(int templateId) {
        return templateStepDAO.getStepsByTemplateId(templateId);
    }

    @Override
    public void deleteStepById(int stepId) {
        templateStepDAO.deleteStepById(stepId);
    }

    // New methods
    @Override
    public List<RDTemplateStep> getStepsByCourseId(int courseId) {
        return templateStepDAO.getStepsByCourseId(courseId);
    }

    @Override
    public List<RDTemplateStep> getStepsBySessionId(int sessionId) {
        return templateStepDAO.getStepsBySessionId(sessionId);
    }

    @Override
    public List<RDTemplateStep> getStepsByCourseAndTemplate(int courseId, int templateId) {
        return templateStepDAO.getStepsByCourseAndTemplate(courseId, templateId);
    }
}
