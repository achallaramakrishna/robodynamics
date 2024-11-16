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
import com.robodynamics.model.RDUser;
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
	@Transactional
	public RDStudentEnrollment getRDStudentEnrollment(int rdStudentEnrollmentId) {
		return rdStudentEnrollmentDao.getRDStudentEnrollment(rdStudentEnrollmentId);
	}

	@Override
	@Transactional
	public List<RDStudentEnrollment> getRDStudentEnrollments() {
		return rdStudentEnrollmentDao.getRDStudentEnrollments();
	}

	@Override
	@Transactional
	public void deleteRDStudentEnrollment(int id) {
		rdStudentEnrollmentDao.deleteRDStudentEnrollment(id);
		
	}

	@Override
	@Transactional
	public List<RDStudentEnrollment> getStudentEnrollmentByParent(int parentId) {
		return rdStudentEnrollmentDao.getStudentEnrollmentsListByParent(parentId);
	}

	@Override
	@Transactional
	public List<RDStudentEnrollment> getStudentEnrollmentByStudent(int studentId) {
		return rdStudentEnrollmentDao.getStudentEnrollmentsListByStudent(studentId);
	}
	
	@Override
	@Transactional
	public int getUserIdFromEnrollment(int enrollmentId) {
	    // Assuming RDStudentEnrollment entity has a reference to the RDUser entity
	    RDStudentEnrollment enrollment = rdStudentEnrollmentDao.getRDStudentEnrollment(enrollmentId);
	    
	    if (enrollment != null && enrollment.getStudent() != null) {
	        return enrollment.getStudent().getUserID(); // Assuming RDUser has a getUserId() method
	    } else {
	        throw new IllegalArgumentException("Enrollment not found or user not associated with the enrollment.");
	    }
	}

	@Override
	@Transactional
	public List<RDUser> getStudentsEnrolledInOffering(int courseOfferingId) {
		// TODO Auto-generated method stub
		return rdStudentEnrollmentDao.getStudentsEnrolledInOffering(courseOfferingId);
	}

	@Override
	public List<RDStudentEnrollment> getEnrolledStudentsByOfferingId(int courseOfferingId) {
		return rdStudentEnrollmentDao.getEnrolledStudentsByOfferingId(courseOfferingId);
	}

	
}
