package com.robodynamics.service;

import java.time.LocalDate;
import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;

public interface RDCourseOfferingService {
	
	public void saveRDCourseOffering(RDCourseOffering rdCourseOffering);

	public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId);
	
	public List < RDCourseOffering > getRDCourseOfferings();
	
    public void deleteRDCourseOffering(int id);
    
	public List<RDCourseOffering> getRDCourseOfferingsList(int userId);
	
	public RDCourseOffering getOnlineCourseOffering(int courseId);
	
	 List<RDCourseOffering> getRDCourseOfferingsListByCourse(int courseId);

	public void deleteCourseOffering(int courseOfferingId);

	public List<RDCourseOffering> getCourseOfferingsByDate(LocalDate today);


}
