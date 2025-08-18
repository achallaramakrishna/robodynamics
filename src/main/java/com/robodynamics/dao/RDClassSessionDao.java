package com.robodynamics.dao;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDCourseTracking;

public interface RDClassSessionDao {

	public RDClassSession saveRDClassSession(RDClassSession classSession);

	public RDClassSession getRDClassSession(int classSessionId);

	public List<RDClassSession> getRDClassSessions();

	public void deleteRDClassSession(int id);

	List<RDClassSession> findByCourseOffering(RDCourseOffering courseOffering);


    RDClassSession findByOfferingAndDate(int offeringId, LocalDate date);
    
  // ✅ New Methods for Tracking Integration
    
    // Fetch all tracking entries for a specific class session
    List<RDCourseTracking> getTrackingsByClassSession(int classSessionId);

    // Fetch all class sessions that have tracking data
    List<RDClassSession> getClassSessionsWithTracking(int courseOfferingId);

    // Fetch all class sessions that do not have tracking data
    List<RDClassSession> getClassSessionsWithoutTracking(int courseOfferingId);

	public List<RDClassSession> findForOfferingInWindow(int courseOfferingId, LocalDateTime atStartOfDay,
			LocalDateTime atStartOfDay2);
	
	


}
