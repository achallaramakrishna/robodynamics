package com.robodynamics.dao.impl;


import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDTemplateStepDAO;
import com.robodynamics.model.RDTemplateStep;

@Repository
public class RDTemplateStepDAOImpl implements RDTemplateStepDAO {

    @Autowired
    private SessionFactory sessionFactory;

    // Existing methods
    @Override
    public void saveStep(RDTemplateStep step) {
        sessionFactory.getCurrentSession().saveOrUpdate(step);
    }

    @Override
    public RDTemplateStep getStepById(int stepId) {
        return sessionFactory.getCurrentSession().get(RDTemplateStep.class, stepId);
    }

    @Override
    public List<RDTemplateStep> getStepsByTemplateId(int templateId) {
        String hql = "FROM RDTemplateStep WHERE template.templateId = :templateId ORDER BY sequence ASC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDTemplateStep.class)
                .setParameter("templateId", templateId)
                .getResultList();
    }

    @Override
    public void deleteStepById(int stepId) {
        RDTemplateStep step = getStepById(stepId);
        if (step != null) {
            sessionFactory.getCurrentSession().delete(step);
        }
    }

    // New methods
    @Override
    public List<RDTemplateStep> getStepsByCourseId(int courseId) {
        String hql = "FROM RDTemplateStep WHERE course.courseId = :courseId ORDER BY sequence ASC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDTemplateStep.class)
                .setParameter("courseId", courseId)
                .getResultList();
    }

    @Override
    public List<RDTemplateStep> getStepsBySessionId(int sessionId) {
        String hql = "FROM RDTemplateStep WHERE session.sessionId = :sessionId ORDER BY sequence ASC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDTemplateStep.class)
                .setParameter("sessionId", sessionId)
                .getResultList();
    }

    @Override
    public List<RDTemplateStep> getStepsByCourseAndTemplate(int courseId, int templateId) {
        String hql = "FROM RDTemplateStep WHERE course.courseId = :courseId AND template.templateId = :templateId ORDER BY sequence ASC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDTemplateStep.class)
                .setParameter("courseId", courseId)
                .setParameter("templateId", templateId)
                .getResultList();
    }
}
