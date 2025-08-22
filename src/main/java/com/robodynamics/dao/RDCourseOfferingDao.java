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

	public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, LocalDate to);

	public List<RDCourseOffering> findOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to);

	public List<RDCourseOffering> findOfferingsForMentorIntersecting(LocalDate selectedDate, Integer userId);
	
    List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate date, Integer mentorUserId);

    // new (suggested)
    List<RDCourseOffering> getCourseOfferingsBetween(LocalDate start, LocalDate end);
    List<RDCourseOffering> getCourseOfferingsBetweenForMentor(LocalDate start, LocalDate end, Integer mentorUserId);

	public List<RDCourseOffering> getCourseOfferingsBetweenForMentor(LocalDate start, LocalDate end);
	
	  /* Day-based */
    List<RDCourseOffering> findByDate(LocalDate date);
    List<RDCourseOffering> findByDateAndMentor(LocalDate date, Integer mentorUserId);

    /* Range-based (inclusive start..end) */
    List<RDCourseOffering> findBetween(LocalDate startInclusive, LocalDate endInclusive);
    List<RDCourseOffering> findBetweenForMentor(LocalDate startInclusive, LocalDate endInclusive, Integer mentorUserId);

    /* Simple filter (for calendar endpoint) */
    List<RDCourseOffering> findFiltered(Long courseId, Long mentorId, String status);

    /* Optional: with pagination if you need it later */
    List<RDCourseOffering> findBetween(LocalDate startInclusive, LocalDate endInclusive, int offset, int limit);
    List<RDCourseOffering> findBetweenForMentor(LocalDate startInclusive, LocalDate endInclusive, Integer mentorUserId, int offset, int limit);






}
