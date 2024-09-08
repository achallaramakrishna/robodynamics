package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuestDao;
import com.robodynamics.model.RDQuest;

@Repository
@Transactional
public class RDQuestDaoImpl implements RDQuestDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDQuest quest) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(quest);
    }

    @Override
    public RDQuest findById(int questId) {
        Session session = factory.getCurrentSession();
        return session.get(RDQuest.class, questId);
    }

    @Override
    public List<RDQuest> findAll() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDQuest> cq = cb.createQuery(RDQuest.class);
        Root<RDQuest> root = cq.from(RDQuest.class);
        cq.select(root);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDQuest quest) {
        Session session = factory.getCurrentSession();
        session.delete(quest);
    }
}
