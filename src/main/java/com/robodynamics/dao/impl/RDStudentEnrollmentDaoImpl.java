package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dao.RDStudentEnrollmentDao;

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

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;

@Repository
@Transactional
public class RDStudentEnrollmentDaoImpl implements RDStudentEnrollmentDao {

	@Autowired
	private SessionFactory factory;
	
	@Override
	public void saveRDStudentEnrollment(RDStudentEnrollment rdStudentEnrollment) {
		System.out.println("hello -- " + rdStudentEnrollment);
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdStudentEnrollment);

	}

	@Override
	public RDStudentEnrollment getRDStudentEnrollment(int rdStudentEnrollmentId) {
		Session session = factory.getCurrentSession();
		RDStudentEnrollment rdStudentEnrollment = session.get(RDStudentEnrollment.class, rdStudentEnrollmentId);
		return rdStudentEnrollment;
	}

	@Override
	public List<RDStudentEnrollment> getRDStudentEnrollments() {
		Session session = factory.getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<RDStudentEnrollment> cq = cb.createQuery(RDStudentEnrollment.class);
		Root<RDStudentEnrollment> root = cq.from(RDStudentEnrollment.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}

	@Override
	public void deleteRDStudentEnrollment(int id) {
		Session session = factory.getCurrentSession();
		RDStudentEnrollment rdStudentEnrollment = session.byId(RDStudentEnrollment.class).load(id);
		session.delete(rdStudentEnrollment);

	}
	
	@Override
	public List<RDStudentEnrollment> getStudentEnrollmentsListByParent(int userId) {
		Session session = factory.getCurrentSession();

		try {
			Query<RDStudentEnrollment> query = session.createQuery("from RDStudentEnrollment where parent.userID =:userId",
					RDStudentEnrollment.class);
			query.setParameter("userId", userId);
			List<RDStudentEnrollment> rdStudentEnrollmentsList  = query.getResultList();
			return rdStudentEnrollmentsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

	@Override
	public List<RDStudentEnrollment> getStudentEnrollmentsListByStudent(int userId) {
		Session session = factory.getCurrentSession();

		try {
			Query<RDStudentEnrollment> query = session.createQuery("from RDStudentEnrollment where student.userID =:userId",
					RDStudentEnrollment.class);
			query.setParameter("userId", userId);
			List<RDStudentEnrollment> rdStudentEnrollmentsList  = query.getResultList();
			return rdStudentEnrollmentsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

}