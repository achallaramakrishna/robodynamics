package com.robodynamics.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDCourseOffering;

public interface RDClassSessionService {
	
	public void saveRDClassSession(RDClassSession classSession);

	public RDClassSession getRDClassSession(int classSessionId);

	public List<RDClassSession> getRDClassSessions();

	public void deleteRDClassSession(int id);

	List<RDClassSession> getClassSessionsByCourseOffering(RDCourseOffering courseOffering);

	RDClassSession getOrCreateClassSession(int offeringId, LocalDate sessionDate);
	
    RDClassSession findSessionByOfferingAndDate(int offeringId, LocalDate date);

	public List<RDClassSession> getSessionsForOffering(int courseOfferingId, LocalDateTime atStartOfDay,
			LocalDateTime atStartOfDay2);


}

