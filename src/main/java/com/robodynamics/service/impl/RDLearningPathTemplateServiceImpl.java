package com.robodynamics.service.impl;

import com.robodynamics.dao.RDLearningPathTemplateDAO;
import com.robodynamics.model.RDLearningPathTemplate;
import com.robodynamics.service.RDLearningPathTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RDLearningPathTemplateServiceImpl implements RDLearningPathTemplateService {

    @Autowired
    private RDLearningPathTemplateDAO templateDAO;

    @Override
    public void saveTemplate(RDLearningPathTemplate template) {
        templateDAO.saveTemplate(template);
    }

    @Override
    public RDLearningPathTemplate getTemplateById(int templateId) {
        return templateDAO.getTemplateById(templateId);
    }

    @Override
    public List<RDLearningPathTemplate> getAllTemplates() {
        return templateDAO.getAllTemplates();
    }
    
    @Override
    public void deleteTemplate(int templateId) {
        templateDAO.deleteTemplate(templateId);
    }

	@Override
	public List<RDLearningPathTemplate> getTemplatesByExamId(int examId) {
		return templateDAO.getTemplatesByExamId(examId);
	}

    
}
