package com.robodynamics.service;

import com.robodynamics.model.RDCourseSession;

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
    
   	void processCsv(MultipartFile file, int selectedCourseId) throws Exception;
}
