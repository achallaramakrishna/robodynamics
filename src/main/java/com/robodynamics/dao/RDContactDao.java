package com.robodynamics.dao;

import com.robodynamics.model.RDContact;
import java.util.List;

public interface RDContactDao {
	
	 void saveContact(RDContact rdcontact);
	
     List<RDContact> getAllRDContacts();
	
	
	}
