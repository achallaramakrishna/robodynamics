package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDStudentEnrollmentDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.service.RDAssetService;
import com.robodynamics.service.RDAssetTransactionService;
import com.robodynamics.service.RDStudentEnrollmentService;

@Service
public class RDStudentEnrollmentServiceImpl implements RDStudentEnrollmentService {

	@Autowired
	private RDStudentEnrollmentDao rdStudentEnrollmentDao;

	@Override
	@Transactional
	public void saveRDStudentEnrollment(RDStudentEnrollment rdStudentEnrollment) {
		rdStudentEnrollmentDao.saveRDStudentEnrollment(rdStudentEnrollment);
	}

	@Override
	public RDStudentEnrollment getRDStudentEnrollment(int rdStudentEnrollmentId) {
		return rdStudentEnrollmentDao.getRDStudentEnrollment(rdStudentEnrollmentId);
	}

	@Override
	public List<RDStudentEnrollment> getRDStudentEnrollments() {
		return rdStudentEnrollmentDao.getRDStudentEnrollments();
	}

	@Override
	public void deleteRDStudentEnrollment(int id) {
		rdStudentEnrollmentDao.deleteRDStudentEnrollment(id);
		
	}

	@Override
	public List<RDStudentEnrollment> getStudentEnrollmentByParent(int parentId) {
		return rdStudentEnrollmentDao.getStudentEnrollmentsListByParent(parentId);
	}

	@Override
	public List<RDStudentEnrollment> getStudentEnrollmentByStudent(int studentId) {
		return rdStudentEnrollmentDao.getStudentEnrollmentsListByStudent(studentId);
	}
	
}
