package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserDao;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDUserService;

@Service
public class RDUserServiceImpl implements RDUserService {

	@Autowired
	private RDUserDao rdUserDao;
	
	@Override
	@Transactional
	public void registerRDUser(RDUser rdUser) {
		rdUserDao.registerRDUser(rdUser);

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
	
	

}
