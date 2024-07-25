package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDUser;

public interface RDUserDao {
	public void registerRDUser(RDUser rdUser);

	public RDUser loginRDUser(RDUser rdUser);
	
	public RDUser getRDUser(int userId);
	
	public List < RDUser > searchUsers(int profileId, int active);
	
	public List < RDUser > getRDUsers();
	
	public List < RDUser > getRDUsersByProfile(int profileId);
	
	public List < RDUser > getRDInstructors();
	
    public void deleteRDUser(int id);
    
    public List < RDUser > getRDChilds(int parentUserId);

  

}
