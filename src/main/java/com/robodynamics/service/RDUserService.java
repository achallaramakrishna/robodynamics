package com.robodynamics.service;

import java.util.List;

import com.robodynamics.form.RDRegistrationForm.Child;
import com.robodynamics.form.RDRegistrationForm.Parent;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDUser;

public interface RDUserService {
	public RDUser registerRDUser(RDUser rdUser);

	public RDUser loginRDUser(RDUser rdUser);
	
	public RDUser getRDUser(int userId);
	
	public RDUser getRDUser(String userName, String password);
	
	public List < RDUser > getRDUsers();
	
	public List < RDUser > getRDInstructors();

	public List < RDUser > searchUsers(int profileId, int active);
	
	public void deleteRDUser(int id);
    
    public List < RDUser > getRDChilds(int parentUserId);

	public void saveParentAndChild(Parent parent, Child child);
	
    public boolean isUsernameTaken(String userName);
    
	public RDUser getChildForParent(int userID);


}
