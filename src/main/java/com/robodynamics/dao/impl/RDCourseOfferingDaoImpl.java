package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDCourseOfferingDao;

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

@Repository
@Transactional
public class RDCourseOfferingDaoImpl implements RDCourseOfferingDao {

	@Autowired
	private SessionFactory factory;
	
	@Override
	public void saveRDCourseOffering(RDCourseOffering rdCourseOffering) {
		System.out.println("hello -- " + rdCourseOffering);
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCourseOffering);

	}

	@Override
	public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId) {
		Session session = factory.getCurrentSession();
		RDCourseOffering rdCourseOffering = session.get(RDCourseOffering.class, rdCourseOfferingId);
		return rdCourseOffering;
	}

	@Override
	public List<RDCourseOffering> getRDCourseOfferings() {
		Session session = factory.getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<RDCourseOffering> cq = cb.createQuery(RDCourseOffering.class);
		Root<RDCourseOffering> root = cq.from(RDCourseOffering.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}

	@Override
	public void deleteRDCourseOffering(int id) {
		Session session = factory.getCurrentSession();
		RDCourseOffering rdCourseOffering = session.byId(RDCourseOffering.class).load(id);
		session.delete(rdCourseOffering);

	}
	
	@Override
	public List<RDCourseOffering> getRDCourseOfferingsList(int userId) {
		Session session = factory.getCurrentSession();

		try {
			Query<RDCourseOffering> query = session.createQuery("from RDCourseOffering where user.userID =:userId",
					RDCourseOffering.class);
			query.setParameter("userId", userId);
			List<RDCourseOffering> rdCourseOfferingsList  = query.getResultList();
			return rdCourseOfferingsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

}