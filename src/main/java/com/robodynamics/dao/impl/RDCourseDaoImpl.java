package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.NoResultException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.model.RDCourse;


@Repository
@Transactional
public class RDCourseDaoImpl implements RDCourseDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDCourse(RDCourse rdCourse) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCourse);
	}
	
	public RDCourse getRDCourse(int courseId) {
        Session session = factory.getCurrentSession();
        RDCourse course = session.get(RDCourse.class, courseId);
        return course;
	}
	
    @Override
    public List <RDCourse> getRDCourses() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDCourse > cq = cb.createQuery(RDCourse.class);
        Root < RDCourse > root = cq.from(RDCourse.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public void deleteRDCourse(int id) {
        Session session = factory.getCurrentSession();
        RDCourse course = session.byId(RDCourse.class).load(id);
        session.delete(course);
    }



}
