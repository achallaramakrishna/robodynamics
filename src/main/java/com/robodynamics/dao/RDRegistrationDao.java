package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;

public interface RDRegistrationDao {
	
	public void saveRDRegistration(RDRegistration registration);

	public RDRegistration getRDRegistration(int registrationId);
	
	public List < RDRegistration > getRDRegistrations();
	
	public List < RDRegistration > getRDRegistrations(RDWorkshop workshop);
	
	public void deleteRDRegistration(int id);
	
}
