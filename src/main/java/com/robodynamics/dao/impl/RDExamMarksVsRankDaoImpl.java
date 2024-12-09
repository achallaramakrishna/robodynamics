package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDExamMarksVsRankDao;
import com.robodynamics.model.RDExamMarksVsRank;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDExamMarksVsRankDaoImpl implements RDExamMarksVsRankDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExamMarksVsRank marksVsRank) {
        getSession().save(marksVsRank);
    }

    @Override
    public RDExamMarksVsRank findById(int id) {
        return getSession().get(RDExamMarksVsRank.class, id);
    }

    @Override
    public List<RDExamMarksVsRank> findByExamId(int examId) {
        return getSession()
                .createQuery("FROM RDExamMarksVsRank WHERE examId = :examId", RDExamMarksVsRank.class)
                .setParameter("examId", examId)
                .list();
    }

    @Override
    public List<RDExamMarksVsRank> findAll() {
        return getSession().createQuery("FROM RDExamMarksVsRank", RDExamMarksVsRank.class).list();
    }

    @Override
    public void update(RDExamMarksVsRank marksVsRank) {
        getSession().update(marksVsRank);
    }

    @Override
    public void deleteById(int id) {
        RDExamMarksVsRank marksVsRank = findById(id);
        if (marksVsRank != null) {
            getSession().delete(marksVsRank);
        }
    }
}
