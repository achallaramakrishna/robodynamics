package com.robodynamics.service.impl;

import java.util.List;

import javax.validation.constraints.Email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserDao;
import com.robodynamics.form.RDRegistrationForm.Child;
import com.robodynamics.form.RDRegistrationForm.Parent;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUser.profileType;
import com.robodynamics.service.RDUserService;

@Service
public class RDUserServiceImpl implements RDUserService {

	@Autowired
	private RDUserDao rdUserDao;
	
	@Override
	@Transactional
	public RDUser registerRDUser(RDUser rdUser) {
		return rdUserDao.registerRDUser(rdUser);

	}

	@Override
	@Transactional
	public RDUser loginRDUser(RDUser rdUser) {
		return rdUserDao.loginRDUser(rdUser);
	}

	@Override
	@Transactional
	public RDUser getRDUser(int userId) {
		return rdUserDao.getRDUser(userId);
	}

	@Override
	@Transactional
	public List<RDUser> getRDUsers() {
		return rdUserDao.getRDUsers();
	}

	@Override
	public void deleteRDUser(int id) {
		rdUserDao.deleteRDUser(id);
	}

	@Override
	@Transactional
	public List<RDUser> getRDChilds(int parentUserId) {
		return rdUserDao.getRDChilds(parentUserId);
	}

	@Override
	@Transactional
	public List<RDUser> getRDInstructors() {
		return rdUserDao.getRDInstructors();

	}

	@Override
	@Transactional
	public List<RDUser> searchUsers(int profileId, int active) {
		return rdUserDao.searchUsers(profileId, active);
	}

	@Override
	@Transactional
	public RDUser getRDUser(String userName, String password) {
		
		return rdUserDao.getRDUser(userName,password);
	}

	@Override
	@Transactional
	public void saveParentAndChild(Parent parent, Child child) {
		
		RDUser parentUser = RDUser.fromParent(parent);
		
		RDUser childUser = RDUser.fromChild(child);
		parentUser.setProfile_id(profileType.ROBO_PARENT.getValue());
		childUser.setProfile_id(profileType.ROBO_STUDENT.getValue());
		rdUserDao.registerRDUser(parentUser);
		rdUserDao.registerRDUser(childUser);
		
		
	}

	@Override
	@Transactional
	public boolean isUsernameTaken(String userName) {
		RDUser existingUser = rdUserDao.findByUserName(userName);
        return existingUser != null;
	}

	@Override
	@Transactional
	public RDUser getChildForParent(int parentId) {
		return rdUserDao.getChildByParentId(parentId);
	}

	@Override
	@Transactional
	public List<RDUser> getRDUsersByProfile(int profileId) {
		return rdUserDao.getRDUsersByProfile(profileId);
	}

	@Override
	@Transactional
	public List<RDUser> getEnrolledStudents(int courseOfferingId) {
		 return rdUserDao.findEnrolledStudentsByOffering(courseOfferingId);
	}

	@Override
	@Transactional
	public RDUser findByUserName(String username) {
		return rdUserDao.findByUserName(username);
	}

	@Override
	@Transactional
	public RDUser findByEmail(@Email String email) {
		
		return rdUserDao.findByEmail(email);
	}

	@Override
	@Transactional
	public RDUser save(RDUser u) {
		
		return rdUserDao.registerRDUser(u);
	}

	@Override
	@Transactional
	public List<RDUser> getAllAdminsAndSuperAdmins() {
		// TODO Auto-generated method stub
		return rdUserDao.getAllAdminsAndSuperAdmins();
	}

	@Override
	@Transactional
	public RDUser findByCellPhone(String cellPhone) {
		return rdUserDao.findByCellPhone(cellPhone);	
		}
	
	

}
