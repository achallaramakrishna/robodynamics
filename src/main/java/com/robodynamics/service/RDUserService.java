package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDUser;

public interface RDUserService {
	public void registerRDUser(RDUser rdUser);

	public RDUser loginRDUser(RDUser rdUser);
	
	public RDUser getRDUser(int userId);
	
	public List < RDUser > getRDUsers();
	
	public List < RDUser > getRDInstructors();

	
	public void deleteRDUser(int id);
    
    public List < RDUser > getRDChilds(int parentUserId);


}
