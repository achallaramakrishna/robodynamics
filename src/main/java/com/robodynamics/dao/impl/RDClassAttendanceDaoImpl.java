package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDClassAttendanceDao;
import com.robodynamics.dao.RDClassSessionDao;
import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;

@Repository
@Transactional
public class RDClassAttendanceDaoImpl implements RDClassAttendanceDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDClassAttendance(RDClassAttendance classAttendance) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(classAttendance);
	}

	@Override
	public RDClassAttendance getRDClassAttendance(int attendanceId) {
		Session session = factory.getCurrentSession();
		RDClassAttendance classAttendance = session.get(RDClassAttendance.class, attendanceId);
		return classAttendance;
	}



	@Override
	public List<RDClassAttendance> getRDClassAttendances() {
		Session session = factory.getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<RDClassAttendance> cq = cb.createQuery(RDClassAttendance.class);
		Root<RDClassAttendance> root = cq.from(RDClassAttendance.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}



	@Override
	public void deleteRDClassAttendance(int id) {
		Session session = factory.getCurrentSession();
		RDClassAttendance RDClassAttendance = session.byId(RDClassAttendance.class).load(id);
		session.delete(RDClassAttendance);
		
	}



	@Override
	public List<RDClassAttendance> findByClassAttendance(RDClassSession classSession) {
		return (List<RDClassAttendance>) factory.getCurrentSession()
				.createQuery("from RDClassAttendance where classSession = :classSession")
				.setParameter("classSession", classSession).list();
	}

	@Override
	public List<RDClassAttendance> getAttendanceByStudent(RDUser student) {
		return (List<RDClassAttendance>) factory.getCurrentSession()
				.createQuery("from RDClassAttendance where student = :student")
				.setParameter("student", student).list();
	}

	@Override
	public List<RDClassAttendance> findByClassSession(RDClassSession classSession) {
		 return (List<RDClassAttendance>) factory.getCurrentSession()
		            .createQuery("from RDClassAttendance where classSession = :classSession")
		            .setParameter("classSession", classSession)
		            .list();
	}

	@Override
	public RDClassAttendance findByClassSessionAndStudent(RDClassSession classSession, RDUser student) {
		return (RDClassAttendance) factory.getCurrentSession()
	            .createQuery("from RDClassAttendance where classSession = :classSession and student = :student")
	            .setParameter("classSession", classSession)
	            .setParameter("student", student)
	            .uniqueResult();
	}

	@Override
	public List<RDClassAttendance> getAttendanceByStudentByEnrollment(RDStudentEnrollment studentEnrollment) {
		return (List<RDClassAttendance>) factory.getCurrentSession()
				.createQuery("from RDClassAttendance where studentEnrollment = :studentEnrollment")
				.setParameter("studentEnrollment", studentEnrollment).list();
	}


	







}
