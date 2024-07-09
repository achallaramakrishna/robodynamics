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
import com.robodynamics.dao.RDEnquiryDao;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDEnquiry;


@Repository
@Transactional
public class RDEnquiryDaoImpl implements RDEnquiryDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDEnquiry(RDEnquiry rdEnquiry) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdEnquiry);
	}
	
	public RDEnquiry getRDEnquiry(int enquiryId) {
        Session session = factory.getCurrentSession();
        RDEnquiry rdEnquiry = session.get(RDEnquiry.class, enquiryId);
        return rdEnquiry;
	}
	
    @Override
    public List <RDEnquiry> getRDEnquiries() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDEnquiry > cq = cb.createQuery(RDEnquiry.class);
        Root < RDEnquiry > root = cq.from(RDEnquiry.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public void deleteRDEnquiry(int id) {
        Session session = factory.getCurrentSession();
        RDEnquiry rdEnquiry = session.byId(RDEnquiry.class).load(id);
        session.delete(rdEnquiry);
    }



}
