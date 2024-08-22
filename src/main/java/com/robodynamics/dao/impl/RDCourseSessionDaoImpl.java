package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.NoResultException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.dao.RDCourseSessionDao;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;

@Repository
@Transactional
public class RDCourseSessionDaoImpl implements RDCourseSessionDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDCourseSession(RDCourseSession rdCourseSession) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCourseSession);

	}

	@Override
	public RDCourseSession getRDCourseSession(int courseSessionId) {
		Session session = factory.getCurrentSession();
		RDCourseSession courseSession = session.get(RDCourseSession.class, courseSessionId);
		return courseSession;
	}

	@Override
	public List<RDCourseSession> getRDCourseSessions(int courseId) {
		System.out.println("Course ID : " + courseId);
		List<RDCourseSession> courseSessions = null;
		Session session = factory.getCurrentSession();
		Query query = session.createQuery("from RDCourseSession cs where cs.course.courseId=:courseId");
		query.setParameter("courseId", courseId);
		courseSessions = query.list();
		return courseSessions;

	}

	@Override
	public void deleteRDCourseSession(int id) {
		Session session = factory.getCurrentSession();
		RDCourseSession courseSession = session.byId(RDCourseSession.class).load(id);
		session.delete(courseSession);

	}

}
