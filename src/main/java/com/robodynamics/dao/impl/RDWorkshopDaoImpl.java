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

import com.robodynamics.dao.RDWorkshopDao;
import com.robodynamics.model.RDWorkshop;

@Repository
@Transactional
public class RDWorkshopDaoImpl implements RDWorkshopDao {
	
	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDWorkshop(RDWorkshop rdWorkshop) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdWorkshop);

	}

	@Override
	public RDWorkshop getRDWorkshop(int workshopId) {
		Session session = factory.getCurrentSession();
		RDWorkshop workshop = session.get(RDWorkshop.class, workshopId);
        return workshop;
	}

	@Override
	public List<RDWorkshop> getRDWorkshops() {
		Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDWorkshop > cq = cb.createQuery(RDWorkshop.class);
        Root < RDWorkshop > root = cq.from(RDWorkshop.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}

	@Override
	public void deleteRDWorkshop(int id) {
		 Session session = factory.getCurrentSession();
		 RDWorkshop workshop = session.byId(RDWorkshop.class).load(id);
	        session.delete(workshop);

	}

}
