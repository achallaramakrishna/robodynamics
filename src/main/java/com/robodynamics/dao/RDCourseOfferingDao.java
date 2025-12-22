	package com.robodynamics.dao;
	
	import java.time.LocalDate;
import java.util.Date;
import java.util.List;
	
	import com.robodynamics.dto.RDCourseOfferingDTO;
	import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
	import com.robodynamics.model.RDAsset;
	import com.robodynamics.model.RDAssetTransaction;
	import com.robodynamics.model.RDCourseOffering;
	
	public interface RDCourseOfferingDao {
		
		List<RDCourseOffering> getAllRDCourseOfferings(); // includes active + inactive
		
		public List<RDCourseOffering> findActiveOfferings();

		
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
	
	
		public List<RDCourseOffering> findOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to);
	
		public List<RDCourseOffering> findOfferingsForMentorIntersecting(LocalDate selectedDate, Integer userId);
		
		
		  /* Day-based */
	    List<RDCourseOffering> findByDate(LocalDate date);
	    List<RDCourseOffering> findByDateAndMentor(LocalDate date, Integer mentorUserId);
	
	
	    /* Simple filter (for calendar endpoint) */
	    List<RDCourseOffering> findFiltered(Long courseId, Long mentorId, String status);
	
	    /* Optional: with pagination if you need it later */
	    List<RDCourseOffering> findBetween(LocalDate startInclusive, LocalDate endInclusive, int offset, int limit);
	    List<RDCourseOffering> findBetweenForMentor(LocalDate startInclusive, LocalDate endInclusive, Integer mentorUserId, int offset, int limit);
	
	
	
		public List<RDCourseOffering> getCourseOfferingsByMentor(int userID);
	
		
	    /* ====================== Activation / Deactivation ====================== */

	    /**
	     * Soft deactivate a course offering (sets isActive = false)
	     */
	    void deactivateCourseOffering(int id);

	    /**
	     * Reactivate a course offering (sets isActive = true)
	     */
	    void activateCourseOffering(int id);

	    /**
	     * Fetch all course offerings, optionally including inactive ones.
	     * Useful for admin views.
	     */
	    List<RDCourseOffering> getAllCourseOfferings(boolean includeInactive);


	    /* ====================== Parent View (Summary) ====================== */

	    /**
	     * Returns parent-visible course offerings including optional inactive ones.
	     */
	    List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId, boolean includeInactive);

		List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, Integer userId);

		public List<RDCourseOffering> getOfferingsIntersecting(LocalDate since, LocalDate to);

		List<RDCourseOffering> getOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to);

	    List<RDCourseOffering> findActiveByCourseId(int courseId);


		List<RDCourseOfferingDTO> getDTOsByCourse(int courseId);


		List<RDCourseOffering> findForMentorBetweenRDUser(int mentorId, java.sql.Date from, java.sql.Date to);

		List<RDCourseOffering> getOfferingsByCategoryAndCourse(Integer categoryId, Integer courseId);

		List<RDCourseOffering> getOfferingsForMentorWithFilters(Integer userID, Integer categoryId, Integer courseId);

		List<RDCourseOffering> getOfferingsWithAllFilters(Integer categoryId, Integer courseId, Integer mentorId);

	
	
	}
