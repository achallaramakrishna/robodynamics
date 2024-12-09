package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDSchoolExamDao;
import com.robodynamics.model.RDSchoolExam;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RDSchoolExamDaoImpl implements RDSchoolExamDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDSchoolExam schoolExam) {
        getSession().save(schoolExam);
    }

    @Override
    public RDSchoolExam findById(int id) {
        return getSession().get(RDSchoolExam.class, id);
    }

    @Override
    public List<RDSchoolExam> findByGradeLevel(int gradeLevel) {
        return getSession()
                .createQuery("FROM RDSchoolExam WHERE gradeLevel = :gradeLevel", RDSchoolExam.class)
                .setParameter("gradeLevel", gradeLevel)
                .list();
    }

    @Override
    public List<RDSchoolExam> findByBoard(String board) {
        return getSession()
                .createQuery("FROM RDSchoolExam WHERE board = :board", RDSchoolExam.class)
                .setParameter("board", board)
                .list();
    }

    @Override
    public List<RDSchoolExam> findAll() {
        return getSession().createQuery("FROM RDSchoolExam", RDSchoolExam.class).list();
    }

    @Override
    public void update(RDSchoolExam schoolExam) {
        getSession().update(schoolExam);
    }

    @Override
    public void deleteById(int id) {
        RDSchoolExam schoolExam = findById(id);
        if (schoolExam != null) {
            getSession().delete(schoolExam);
        }
    }
}
