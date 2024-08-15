package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;

public interface RDRegistrationService {

	public void saveRDRegistration(RDRegistration registration);

	public RDRegistration getRDRegistration(int registrationId);
	
	public List < RDRegistration > getRDRegistrations();
	
	public void deleteRDRegistration(int id);
	
    List<RDRegistration> getRDRegistration(RDWorkshop workshop);

}
