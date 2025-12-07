package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDContactDao;
import com.robodynamics.model.RDContact;

@Repository
@Transactional
public class RDContactDaoImpl implements RDContactDao {
	
	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	public void saveContact(RDContact rdContact) {
	  
		Session session = sessionFactory.getCurrentSession();
		session.saveOrUpdate(rdContact);
	}

	@Override
	public List<RDContact> getAllRDContacts() {
	    Session session = sessionFactory.openSession();
	    Query<RDContact> query = session.createQuery("select * from RDContact", RDContact.class);
		session.close();
	    return getAllRDContacts();
	}


	}