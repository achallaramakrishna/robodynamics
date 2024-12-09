package com.robodynamics.service;

import com.robodynamics.model.RDLearningPathTemplate;
import java.util.List;

public interface RDLearningPathTemplateService {
	void saveTemplate(RDLearningPathTemplate template);

	RDLearningPathTemplate getTemplateById(int templateId);

	List<RDLearningPathTemplate> getAllTemplates();

	void deleteTemplate(int templateId);

	List<RDLearningPathTemplate> getTemplatesByExamId(int examId);

}
