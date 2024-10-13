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


}
