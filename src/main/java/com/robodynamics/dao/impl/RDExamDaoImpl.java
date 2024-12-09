package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDExamDao;
import com.robodynamics.model.RDExam;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDExamDaoImpl implements RDExamDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDExam exam) {
        getSession().save(exam);
    }

    @Override
    public RDExam findById(int id) {
        return getSession().get(RDExam.class, id);
    }

    @Override
    public List<RDExam> findAll() {
        return getSession().createQuery("FROM RDExam", RDExam.class).list();
    }

    @Override
    public List<RDExam> findByYear(int examYear) {
        return getSession()
                .createQuery("FROM RDExam WHERE examYear = :examYear", RDExam.class)
                .setParameter("examYear", examYear)
                .list();
    }

    @Override
    public void update(RDExam exam) {
        getSession().update(exam);
    }

    @Override
    public void deleteById(int id) {
        RDExam exam = getSession().get(RDExam.class, id);
        if (exam != null) {
            getSession().delete(exam);
        }
    }

	@Override
	public List<RDExam> findAllWithTargetDates() {
		return sessionFactory.getCurrentSession()
                .createQuery("FROM RDExam WHERE examDate IS NOT NULL")
                .list();
	}
}
