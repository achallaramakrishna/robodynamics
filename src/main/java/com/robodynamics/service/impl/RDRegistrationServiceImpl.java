package com.robodynamics.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDRegistrationDao;
import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;
import com.robodynamics.service.RDRegistrationService;

@Service
public class RDRegistrationServiceImpl implements RDRegistrationService {
	
	@Autowired
	private RDRegistrationDao rdRegistrationDao;
	
	@Override
	@Transactional
	public void saveRDRegistration(RDRegistration registration) {
		rdRegistrationDao.saveRDRegistration(registration);
	}

	@Override
	@Transactional
	public RDRegistration getRDRegistration(int registrationId) {
		return rdRegistrationDao.getRDRegistration(registrationId);
	}

	@Override
	@Transactional
	public List<RDRegistration> getRDRegistrations() {
		return rdRegistrationDao.getRDRegistrations();
	}

	@Override
	@Transactional
	public void deleteRDRegistration(int id) {
		rdRegistrationDao.deleteRDRegistration(id);
		
	}

	@Override
	@Transactional
	public List<RDRegistration> getRDRegistration(RDWorkshop workshop) {
		return rdRegistrationDao.getRDRegistrations(workshop);
	}

	
}
	