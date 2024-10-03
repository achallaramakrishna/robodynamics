package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;

public interface RDCourseOfferingDao {
	
	public void saveRDCourseOffering(RDCourseOffering rdCourseOffering);

	public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId);
	
	public List < RDCourseOffering > getRDCourseOfferings();
	
    public void deleteRDCourseOffering(int id);
    
	public List<RDCourseOffering> getRDCourseOfferingsList(int userId);
	
    RDCourseOffering getOnlineCourseOffering(int courseId);
    
	List<RDCourseOffering> getRDCourseOfferingsListByCourse(int courseId);




}
