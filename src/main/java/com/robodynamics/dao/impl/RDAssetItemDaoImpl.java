package com.robodynamics.dao.impl;

import java.util.List;

import com.robodynamics.dao.RDAssetItemDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetItem;

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


@Repository
@Transactional
public class RDAssetItemDaoImpl implements RDAssetItemDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDAssetItem(RDAssetItem rdAssetItem) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdAssetItem);

	}

	@Override
	public RDAssetItem getRDAssetItem(int assetItemId) {
	       Session session = factory.getCurrentSession();
	       RDAssetItem assetItem = session.get(RDAssetItem.class, assetItemId);
	        return assetItem;
	}

	@Override
	public List<RDAssetItem> getRDAssetItems() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDAssetItem > cq = cb.createQuery(RDAssetItem.class);
        Root < RDAssetItem > root = cq.from(RDAssetItem.class);
        
        
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}

	@Override
	public void deleteRDAssetItem(int id) {
		Session session = factory.getCurrentSession();
		RDAssetItem assetItem = session.byId(RDAssetItem.class).load(id);
        session.delete(assetItem);
	}

}
