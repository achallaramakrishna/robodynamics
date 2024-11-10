package com.robodynamics.service;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSession.TierLevel;

import java.io.File;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface RDCourseSessionService {
    
    // Save or update a course session
    void saveCourseSession(RDCourseSession courseSession);
    
    // Retrieve a specific course session by its ID
    RDCourseSession getCourseSession(int courseSessionId);
    
    // Retrieve all course sessions
    List<RDCourseSession> getAllCourseSessions();
    
    // Retrieve course sessions for a specific course by courseId
    List<RDCourseSession> getCourseSessionsByCourseId(int courseId);
    
    // Delete a course session by its ID
    void deleteCourseSession(int courseSessionId);
    
   	
   	void processJson(MultipartFile file, int selectedCourseId) throws Exception;

	RDCourseSession getCourseSessionBySessionIdAndCourseId(int sessionId, Integer courseId);


	// **New Methods**

    // Retrieve all units (parent sessions) for a specific course
    List<RDCourseSession> getUnitsByCourseId(int courseId);

    // Retrieve all sessions under a specific unit
    List<RDCourseSession> getSessionsByUnitId(int unitId);

    // Retrieve the complete course hierarchy (units and sessions)
    List<RDCourseSession> getCourseHierarchyByCourseId(int courseId);

    // Save or update a list of course sessions (bulk operation)
    void saveAllCourseSessions(List<RDCourseSession> courseSessions);

    List<RDCourseSession> getSessionsByCourseAndTier(int courseId, String tierLevel);

    List<RDCourseSession> findByTierLevel(RDCourseSession.TierLevel tierLevel);
 
    List<RDCourseSession> findByTierLevelOrderedByTierOrder(RDCourseSession.TierLevel tierLevel);

}
