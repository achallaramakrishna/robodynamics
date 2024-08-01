package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.model.RDContact;
import com.robodynamics.dao.RDContactDao;
import com.robodynamics.service.RDContactService;

@Service
public class RDContactServiceImpl implements RDContactService {
	
	@Autowired
	private RDContactDao rdContactDao;

	@Override
	@Transactional
	public void saveRDContact(RDContact rdContact) {
		rdContactDao.saveContact(rdContact);

	}

	@Override
	@Transactional
    public List<RDContact> getAllRDContacts() {
        return rdContactDao.getAllRDContacts();
    }

   
}