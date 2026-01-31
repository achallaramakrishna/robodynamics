package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDExamSectionDAO;
import com.robodynamics.model.RDExamSection;

@Repository
public class RDExamSectionDAOImpl implements RDExamSectionDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExamSection section) {
        getCurrentSession().save(section);
    }

    @Override
    public void update(RDExamSection section) {
        getCurrentSession().update(section);
    }

    @Override
    public RDExamSection findById(Integer sectionId) {
        return getCurrentSession().get(RDExamSection.class, sectionId);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDExamSection> findByExamPaper(Integer examPaperId) {
        return getCurrentSession()
                .createQuery(
                    "from RDExamSection s " +
                    "where s.examPaper.examPaperId = :examPaperId " +
                    "order by s.sectionOrder asc"
                )
                .setParameter("examPaperId", examPaperId)
                .list();
    }

    @Override
    public void delete(Integer sectionId) {
        RDExamSection section = findById(sectionId);
        if (section != null) {
            getCurrentSession().delete(section);
        }
    }
}
