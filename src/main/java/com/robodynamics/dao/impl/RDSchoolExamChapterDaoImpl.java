package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDSchoolExamChapterDao;
import com.robodynamics.model.RDSchoolExamChapter;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDSchoolExamChapterDaoImpl implements RDSchoolExamChapterDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDSchoolExamChapter chapter) {
        getSession().save(chapter);
    }

    @Override
    public RDSchoolExamChapter findById(int id) {
        return getSession().get(RDSchoolExamChapter.class, id);
    }

    @Override
    public List<RDSchoolExamChapter> findBySubjectId(int subjectId) {
        return getSession()
                .createQuery("FROM RDSchoolExamChapter WHERE subjectId = :subjectId", RDSchoolExamChapter.class)
                .setParameter("subjectId", subjectId)
                .list();
    }

    @Override
    public List<RDSchoolExamChapter> findAll() {
        return getSession().createQuery("FROM RDSchoolExamChapter", RDSchoolExamChapter.class).list();
    }

    @Override
    public void update(RDSchoolExamChapter chapter) {
        getSession().update(chapter);
    }

    @Override
    public void deleteById(int id) {
        RDSchoolExamChapter chapter = findById(id);
        if (chapter != null) {
            getSession().delete(chapter);
        }
    }
}
