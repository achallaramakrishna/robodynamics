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

import com.robodynamics.dao.RDAssetCategoryDao;
import com.robodynamics.model.RDAssetCategory;


@Repository
@Transactional
public class RDAssetCategoryDaoImpl implements RDAssetCategoryDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDAssetCategory(RDAssetCategory rdAssetCategory) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdAssetCategory);
	}
	
	public RDAssetCategory getRDAssetCategory(int assetCategoryId) {
        Session session = factory.getCurrentSession();
        RDAssetCategory assetCategory = session.get(RDAssetCategory.class, assetCategoryId);
        return assetCategory;
	}
	
    @Override
    public List <RDAssetCategory> getRDAssetCategories() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDAssetCategory > cq = cb.createQuery(RDAssetCategory.class);
        Root < RDAssetCategory > root = cq.from(RDAssetCategory.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public void deleteRDAssetCategory(int id) {
        Session session = factory.getCurrentSession();
        RDAssetCategory assetCategory = session.byId(RDAssetCategory.class).load(id);
        session.delete(assetCategory);
    }



}
