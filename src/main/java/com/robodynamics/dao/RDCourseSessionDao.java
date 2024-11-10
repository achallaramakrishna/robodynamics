package com.robodynamics.dao;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;

import java.util.List;

public interface RDCourseSessionDao {
    // Save or update a course session
    void saveRDCourseSession(RDCourseSession courseSession);
    
    // Retrieve a specific course session by its ID
    RDCourseSession getRDCourseSession(int courseSessionId);
    
    // Retrieve all course sessions
    List<RDCourseSession> getRDCourseSessions();
    
    // Retrieve course sessions for a specific course by courseId
    List<RDCourseSession> getCourseSessionsByCourseId(int courseId);
    
    // Delete a course session by its ID
    void deleteRDCourseSession(int courseSessionId);
    
    // New method for bulk saving
    void saveAll(List<RDCourseSession> courseSessions);

    RDCourseSession getCourseSessionBySessionIdAndCourseId(int sessionId, int courseId);
    
 // **New Methods**

    // Retrieve all units (parent sessions) for a specific course
    List<RDCourseSession> getUnitsByCourseId(int courseId);

    // Retrieve all sessions under a specific unit
    List<RDCourseSession> getSessionsByUnitId(int unitId);

    // Retrieve the complete course hierarchy (units and sessions)
    List<RDCourseSession> getCourseHierarchyByCourseId(int courseId);

    List<RDCourseSession> findByCourseIdAndTierLevelOrderByTierOrder(int courseId, String tierLevel);

    List<RDCourseSession> findByTierLevel(RDCourseSession.TierLevel tierLevel);

    List<RDCourseSession> findByTierLevelOrderedByTierOrder(RDCourseSession.TierLevel tierLevel);


}
