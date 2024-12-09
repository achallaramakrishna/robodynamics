package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDLearningPathTemplateDAO;
import com.robodynamics.model.RDLearningPathTemplate;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDLearningPathTemplateDAOImpl implements RDLearningPathTemplateDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public void saveTemplate(RDLearningPathTemplate template) {
		sessionFactory.getCurrentSession().saveOrUpdate(template);
	}

	@Override
	public RDLearningPathTemplate getTemplateById(int templateId) {
		return sessionFactory.getCurrentSession().get(RDLearningPathTemplate.class, templateId);
	}

	@Override
	public List<RDLearningPathTemplate> getAllTemplates() {
		Query<RDLearningPathTemplate> query = sessionFactory.getCurrentSession()
				.createQuery("from RDLearningPathTemplate", RDLearningPathTemplate.class);
		return query.getResultList();
	}

	@Override
	public void deleteTemplate(int templateId) {
		RDLearningPathTemplate template = getTemplateById(templateId);
		if (template != null) {
			sessionFactory.getCurrentSession().delete(template);
		}
	}

	@Override
    public List<RDLearningPathTemplate> getTemplatesByExamId(int examId) {
        String hql = "FROM RDLearningPathTemplate WHERE exam.id = :examId";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDLearningPathTemplate.class)
                .setParameter("examId", examId)
                .getResultList();
    }

}
