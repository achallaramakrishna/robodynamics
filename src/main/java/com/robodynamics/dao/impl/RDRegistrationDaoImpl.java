
package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDRegistrationDao;
import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;

@Repository
@Transactional
public class RDRegistrationDaoImpl implements RDRegistrationDao {

	@Autowired
	private SessionFactory factory;
	
	@Override
	public void saveRDRegistration(RDRegistration registration) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(registration);

	}

	@Override
	public RDRegistration getRDRegistration(int registrationId) {
		Session session = factory.getCurrentSession();
		RDRegistration registration = session.get(RDRegistration.class, registrationId);
        return registration;
	}

	@Override
	public List<RDRegistration> getRDRegistrations(RDWorkshop workshop) {
		Session session = factory.getCurrentSession();
		
		Query query = session.createQuery("from RDRegistration registration where registration.workshop.workshopId = :id");
		
		query.setInteger("id", workshop.getWorkshopId());

		List<RDRegistration> registrations = query.list();
		
		return registrations;
	}

	@Override
	public List<RDRegistration> getRDRegistrations() {
		Session session = factory.getCurrentSession();
		
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDWorkshop > cq = cb.createQuery(RDWorkshop.class);
        Root < RDWorkshop > root = cq.from(RDWorkshop.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}
	
	@Override
	public void deleteRDRegistration(int id) {
		 Session session = factory.getCurrentSession();
		 RDRegistration registration = session.byId(RDRegistration.class).load(id);
	     session.delete(registration);

	}


}
