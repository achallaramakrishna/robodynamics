package com.robodynamics.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetTransactionDao;
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

@Repository
@Transactional
public class RDAssetTransactionDaoImpl implements RDAssetTransactionDao {

	@Autowired
	private SessionFactory factory;
	
	@Override
	public void saveRDAssetTransaction(RDAssetTransaction assetTransaction) {
		System.out.println("hello -- " + assetTransaction);
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(assetTransaction);

	}

	@Override
	public RDAssetTransaction getRDAssetTransaction(int assetTransactionId) {
		Session session = factory.getCurrentSession();
		RDAssetTransaction assetTransaction = session.get(RDAssetTransaction.class, assetTransactionId);
		return assetTransaction;
	}

	@Override
	public List<RDAssetTransaction> getRDAssetTransactions() {
		Session session = factory.getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<RDAssetTransaction> cq = cb.createQuery(RDAssetTransaction.class);
		Root<RDAssetTransaction> root = cq.from(RDAssetTransaction.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}
	
	@Override
	public List<RDAssetTransaction> getRDAssetTransactions(int userId) {
		
		Session session = factory.getCurrentSession();
		List<RDAssetTransaction> assetTransactionList = new ArrayList<RDAssetTransaction>();
		try {
			Query<RDAssetTransaction> query = session.createQuery("from RDAssetTransaction assetTransaction where assetTransaction.user.userID =:userId",
					RDAssetTransaction.class);
			
			query.setParameter("userId", userId);
			assetTransactionList = query.getResultList();
			return assetTransactionList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}
	

	@Override
	public void deleteRDAssetTransaction(int id) {
		Session session = factory.getCurrentSession();
		RDAssetTransaction assetTransaction = session.byId(RDAssetTransaction.class).load(id);
		session.delete(assetTransaction);

	}

}
