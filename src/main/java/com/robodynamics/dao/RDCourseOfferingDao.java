package com.robodynamics.dao;

import java.time.LocalDate;
import java.util.List;

import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
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

	public List<RDCourseOffering> getCourseOfferingsByDate(LocalDate today);

	public List<RDCourseOffering> getFilteredOfferings(Long courseId, Long mentorId, String status);

	public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId);




}
