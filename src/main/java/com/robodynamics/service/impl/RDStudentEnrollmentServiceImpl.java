package com.robodynamics.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDStudentEnrollmentDao;
import com.robodynamics.dto.RDEnrollmentReportDTO;
import com.robodynamics.dto.RDStudentInfoDTO;
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

	@Override
	public Integer findEnrollmentIdByStudentAndOffering(int offeringId, int studentId) {
        System.out.println("hello 2 - Offering id - " + offeringId + "User id : " + studentId);

	    Integer enrollmentId = rdStudentEnrollmentDao.findEnrollmentIdByStudentAndOffering(offeringId, studentId);

	    if (enrollmentId == null) {
	        System.out.println("⚠️ No enrollment found for studentId=" + studentId + ", offeringId=" + offeringId);
	        return null; // Return null instead of calling intValue()
	    }
	    return enrollmentId;
	}

	@Override
	@Transactional
	public List<RDStudentEnrollment> getEnrollmentsByCourseId(Integer courseId) {
		
		if (courseId == null) {
	        return new ArrayList<>();
	    }
		return rdStudentEnrollmentDao.getEnrollmentsByCourseId(courseId);
	}

	@Transactional
	public List<RDEnrollmentReportDTO> getEnrollmentsByParentId(Integer parentId) {
		return rdStudentEnrollmentDao.getEnrollmentsByParentId(parentId);
	}

	@Override
	@Transactional
	public List<RDStudentInfoDTO> getEnrolledStudentInfosByOfferingIdAndParent(Integer offeringId, Integer parentId) {
		// TODO Auto-generated method stub
		return rdStudentEnrollmentDao.getEnrolledStudentInfosByOfferingIdAndParent(offeringId,parentId);
	}

	@Override
	@Transactional
	public boolean enrollmentBelongsToParent(Integer enrollmentId, Integer parentId) {
		System.out.println(">>> SVC.enrollmentBelongsToParent enr=" + enrollmentId + " pid=" + parentId);
        boolean owns = rdStudentEnrollmentDao.enrollmentBelongsToParent(enrollmentId, parentId);
        System.out.println("<<< SVC.enrollmentBelongsToParent -> " + owns);
        return owns;
	}

	@Override
	@Transactional
	public List<RDStudentInfoDTO> getChildrenByParentId(Integer parentId) {
		// TODO Auto-generated method stub
		return rdStudentEnrollmentDao.getChildrenByParentId(parentId);
	}

	@Override
	@Transactional
	public int countEnrollments(int courseOfferingId) {
		// TODO Auto-generated method stub
		return rdStudentEnrollmentDao.countEnrollments(courseOfferingId);
	}

	@Override
	public List<RDStudentEnrollment> getActiveEnrollments() {
		
		return rdStudentEnrollmentDao.getActiveEnrollments();
	}

	@Override
	@Transactional
	public boolean existsByStudentAndOffering(int studentId, int offeringId) {
		return rdStudentEnrollmentDao.existsByStudentAndOffering(studentId, offeringId);
	}

	

	
}
