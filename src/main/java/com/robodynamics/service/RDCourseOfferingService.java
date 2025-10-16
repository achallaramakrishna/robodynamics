package com.robodynamics.service;

import java.time.LocalDate;
import java.util.List;

import com.robodynamics.dto.RDCourseOfferingDTO;
import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;

public interface RDCourseOfferingService {
	
	public List<RDCourseOffering> getAllRDCourseOfferings();
	
	public void saveRDCourseOffering(RDCourseOffering rdCourseOffering);

	public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId);
	
	public List < RDCourseOffering > getRDCourseOfferings();
	
    public void deleteRDCourseOffering(int id);
    
	public List<RDCourseOffering> getRDCourseOfferingsList(int userId);
	
	public RDCourseOffering getOnlineCourseOffering(int courseId);
	
	public List<RDCourseOffering> getRDCourseOfferingsListByCourse(int courseId);

	public void deleteCourseOffering(int courseOfferingId);

	public List<RDCourseOffering> getCourseOfferingsByDate(LocalDate today);

	public List<RDCourseOffering> getFilteredOfferings(Long courseId, Long mentorId, String status);

	public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId);

	public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, Integer userId);

	public List<RDCourseOffering> getOfferingsIntersecting(LocalDate since, LocalDate to);

	public List<RDCourseOffering> getOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to);
	
	public void deactivateCourseOffering(int id);
	public void activateCourseOffering(int id);

	
	
   

   	public List<RDCourseOffering> getRDCourseOfferingsByCourse(int courseId);

	public List<RDCourseOffering> getCourseOfferingsByMentor(int userID);



}
