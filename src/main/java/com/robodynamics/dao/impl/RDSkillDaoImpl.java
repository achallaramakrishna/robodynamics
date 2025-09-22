package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDSkillDao;
import com.robodynamics.model.RDSkill;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RDSkillDaoImpl implements RDSkillDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDSkill findBySkillName(String skillName) {
        Query<RDSkill> query = sessionFactory.getCurrentSession()
                .createQuery("from RDSkill where skillName = :skillName", RDSkill.class);
        query.setParameter("skillName", skillName);
        return query.uniqueResult();
    }

    @Override
    public void save(RDSkill skill) {
        sessionFactory.getCurrentSession().saveOrUpdate(skill);
    }
}
