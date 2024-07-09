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

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDUser;

@Repository
@Transactional
public class RDAssetDaoImpl implements RDAssetDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDAsset(RDAsset rdAsset) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdAsset);
	}

	public RDAsset getRDAsset(int assetId) {
		Session session = factory.getCurrentSession();
		RDAsset asset = session.get(RDAsset.class, assetId);
		return asset;
	}

	@Override
	public List<RDAsset> getRDAssets() {
		Session session = factory.getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<RDAsset> cq = cb.createQuery(RDAsset.class);
		Root<RDAsset> root = cq.from(RDAsset.class);
		cq.select(root);
		Query query = session.createQuery(cq);
		return query.getResultList();
	}

	@Override
	public void deleteRDAsset(int id) {
		Session session = factory.getCurrentSession();
		RDAsset asset = session.byId(RDAsset.class).load(id);
		session.delete(asset);
	}

	@Override
	public List<RDAsset> getRDAssetLegos() {
		Session session = factory.getCurrentSession();

		try {
			Query<RDAsset> query = session.createQuery(
					"from RDAsset asset where asset.assetCategory.assetCategoryType = :assetCategoryType",
					RDAsset.class);
			query.setParameter("assetCategoryType", "Lego");
			List<RDAsset> assetsList = query.list();
			return assetsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

}
