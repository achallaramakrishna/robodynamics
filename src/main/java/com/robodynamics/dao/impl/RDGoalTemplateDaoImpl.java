package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDGoalTemplateDao;
import com.robodynamics.model.RDGoalTemplate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDGoalTemplateDaoImpl implements RDGoalTemplateDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public RDGoalTemplate findById(int id) {
        return getSession().get(RDGoalTemplate.class, id);
    }

    @Override
    public List<RDGoalTemplate> findByExamType(String examType) {
        return getSession()
                .createQuery("FROM RDGoalTemplate WHERE examType = :examType", RDGoalTemplate.class)
                .setParameter("examType", examType)
                .list();
    }

    @Override
    public List<RDGoalTemplate> findAll() {
        return getSession().createQuery("FROM RDGoalTemplate", RDGoalTemplate.class).list();
    }

    @Override
    public void save(RDGoalTemplate goalTemplate) {
        getSession().save(goalTemplate);
    }

    @Override
    public void update(RDGoalTemplate goalTemplate) {
        getSession().update(goalTemplate);
    }

    @Override
    public void deleteById(int id) {
        RDGoalTemplate goalTemplate = findById(id);
        if (goalTemplate != null) {
            getSession().delete(goalTemplate);
        }
    }
}
