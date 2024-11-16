package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;

public interface RDStudentEnrollmentService {
	
	public void saveRDStudentEnrollment(RDStudentEnrollment rdStudentEnrollment);

	public RDStudentEnrollment getRDStudentEnrollment(int rdStudentEnrollmentId);
	
	public List < RDStudentEnrollment > getRDStudentEnrollments();
	
    public void deleteRDStudentEnrollment(int id);
    
	public List<RDStudentEnrollment> getStudentEnrollmentByParent(int parentId);
	
	public List<RDStudentEnrollment> getStudentEnrollmentByStudent(int studentId);
	
	public int getUserIdFromEnrollment(int enrollmentId);
	
    List<RDUser> getStudentsEnrolledInOffering(int courseOfferingId);

	public List<RDStudentEnrollment> getEnrolledStudentsByOfferingId(int courseOfferingId);



}
