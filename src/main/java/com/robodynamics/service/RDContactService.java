package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDContact;

public interface RDContactService {
    void saveRDContact(RDContact rdContact);
   
    List<RDContact> getAllRDContacts();
    
  
	
}
