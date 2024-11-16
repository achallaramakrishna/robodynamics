package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDExamCourseDao;
import com.robodynamics.model.RDExamCourse;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class RDExamCourseDaoImpl implements RDExamCourseDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional
    public void save(RDExamCourse examCourse) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(examCourse); // This will save or update the entity
    }
}
