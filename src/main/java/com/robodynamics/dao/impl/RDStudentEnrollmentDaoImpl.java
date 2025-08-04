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
import javax.persistence.criteria.Predicate;
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

	    // Add condition where status = 1
	    Predicate statusCondition = cb.equal(root.get("status"), 1);

	    // Apply the condition to the query
	    cq.select(root).where(statusCondition);

	    // Execute query
	    Query<RDStudentEnrollment> query = session.createQuery(cq);
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
			Query<RDStudentEnrollment> query = session.createQuery("from RDStudentEnrollment where parent.userID =:userId and status = 1",
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
			Query<RDStudentEnrollment> query = session.createQuery("from RDStudentEnrollment where student.userID =:userId and status = 1",
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
	public List<RDUser> getStudentsEnrolledInOffering(int courseOfferingId) {
		 String hql = "SELECT e.student FROM RDStudentEnrollment e WHERE e.courseOffering.courseOfferingId = :courseOfferingId";
		    Query<RDUser> query = factory.getCurrentSession().createQuery(hql, RDUser.class);
		    query.setParameter("courseOfferingId", courseOfferingId);
		    return query.getResultList();
	}

	@Override
	public List<RDStudentEnrollment> getEnrolledStudentsByOfferingId(int courseOfferingId) {
		String hql = "FROM RDStudentEnrollment e WHERE e.courseOffering.courseOfferingId = :courseOfferingId";
        return factory.getCurrentSession()
                .createQuery(hql, RDStudentEnrollment.class)
                .setParameter("courseOfferingId", courseOfferingId)
                .getResultList();
	}

	@Override
	@Transactional
	public Integer findEnrollmentIdByStudentAndOffering(int userId, int offeringId) {
	    System.out.println("🔍 DAO Input: offeringId=" + offeringId + ", userId=" + userId);

	    String hql = "SELECT e.enrollmentId FROM RDStudentEnrollment e "
	               + "WHERE e.courseOffering.courseOfferingId = :offeringId "
	               + "AND e.student.userID = :userId"; // ✅ use userId (confirm RDUser entity field)

	    Query<Integer> query = factory.getCurrentSession().createQuery(hql, Integer.class);
	    query.setParameter("offeringId", offeringId);
	    query.setParameter("userId", userId);

	    Integer enrollmentId = query.uniqueResult();
	    System.out.println("✅ DAO Result EnrollmentId: " + enrollmentId);
	    return enrollmentId;
	}



}