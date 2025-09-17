package com.robodynamics.dao;

import java.util.List;

import javax.validation.constraints.Email;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDUser;

public interface RDUserDao {
	
	public RDUser registerRDUser(RDUser rdUser);

	public RDUser loginRDUser(RDUser rdUser);
	
	public RDUser getRDUser(int userId);
	
	public RDUser getRDUser(String userName, String password);
	
	public List < RDUser > searchUsers(int profileId, int active);
	
	public List < RDUser > getRDUsers();
	
	public List < RDUser > getRDUsersByProfile(int profileId);
	
	public List < RDUser > getRDInstructors();
	
    public void deleteRDUser(int id);
    
    public List < RDUser > getRDChilds(int parentUserId);
    
    public RDUser findByUserName(String userName);

	public RDUser getChildByParentId(int parentId);
	
	List<RDUser> findEnrolledStudentsByOffering(int courseOfferingId);

	public void update(RDUser u);

	public RDUser findByEmail(@Email String email);

	public List<RDUser> getAllAdminsAndSuperAdmins();


}
