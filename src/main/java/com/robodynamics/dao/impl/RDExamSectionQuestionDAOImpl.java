package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDExamSectionQuestionDAO;
import com.robodynamics.model.RDExamSectionQuestion;

@Repository
public class RDExamSectionQuestionDAOImpl implements RDExamSectionQuestionDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExamSectionQuestion question) {
        getCurrentSession().save(question);
    }

    @Override
    public void update(RDExamSectionQuestion question) {
        getCurrentSession().update(question);
    }

    @Override
    public RDExamSectionQuestion findById(Integer id) {
        return getCurrentSession().get(RDExamSectionQuestion.class, id);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDExamSectionQuestion> findBySection(Integer sectionId) {
        return getCurrentSession()
                .createQuery(
                    "from RDExamSectionQuestion q " +
                    "where q.section.sectionId = :sectionId " +
                    "order by q.displayOrder asc"
                )
                .setParameter("sectionId", sectionId)
                .list();
    }

    @Override
    public void delete(Integer id) {
        RDExamSectionQuestion q = findById(id);
        if (q != null) {
            getCurrentSession().delete(q);
        }
    }
}
