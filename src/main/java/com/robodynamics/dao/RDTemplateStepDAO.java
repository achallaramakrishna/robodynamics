package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDTemplateStep;

public interface RDTemplateStepDAO {

    // Existing methods
    void saveStep(RDTemplateStep step);
    RDTemplateStep getStepById(int stepId);
    List<RDTemplateStep> getStepsByTemplateId(int templateId);
    void deleteStepById(int stepId);

    // New methods
    List<RDTemplateStep> getStepsByCourseId(int courseId);
    List<RDTemplateStep> getStepsBySessionId(int sessionId);
    List<RDTemplateStep> getStepsByCourseAndTemplate(int courseId, int templateId);
}
