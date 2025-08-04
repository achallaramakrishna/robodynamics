package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;

public interface RDStudentEnrollmentDao {
	
	public RDStudentEnrollment getRDStudentEnrollment(int enrollmentId);
	
	public List < RDStudentEnrollment > getRDStudentEnrollments();
	
    public void deleteRDStudentEnrollment(int id);
    
	void saveRDStudentEnrollment(RDStudentEnrollment rdStudentEnrollment);

	List<RDStudentEnrollment> getStudentEnrollmentsListByParent(int userId);

	List<RDStudentEnrollment> getStudentEnrollmentsListByStudent(int userId);

	public List<RDUser> getStudentsEnrolledInOffering(int courseOfferingId);

	public List<RDStudentEnrollment> getEnrolledStudentsByOfferingId(int courseOfferingId);

	public Integer findEnrollmentIdByStudentAndOffering(int studentId, int offeringId);
}
