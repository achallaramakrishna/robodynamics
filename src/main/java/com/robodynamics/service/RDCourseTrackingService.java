package com.robodynamics.service;

import com.robodynamics.model.RDCourseTracking;
import com.robodynamics.model.RDUser;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface RDCourseTrackingService {
    

    RDCourseTracking getTrackingById(int trackingId);

    List<RDCourseTracking> getTrackingByStudent(int studentId);

    List<RDCourseTracking> getTrackingByCourseSession(int courseSessionId);

    List<RDCourseTracking> getAllTrackingEntries();
    
    List<RDCourseTracking> getTrackingByStudentAndOffering(int studentId, int courseOfferingId);
    
    List<RDCourseTracking> getTrackingEntriesByEnrollmentId(int studentEnrollmentId);
    
    void saveTracking(int studentEnrollmentId, int courseSessionId, String feedback, LocalDate trackingDate, MultipartFile[] files,RDUser rdUser);
    
    String saveUploadedFiles(MultipartFile[] files);
    
    void updateTracking(RDCourseTracking tracking);
    void deleteTracking(int trackingId);
    
    void save(RDCourseTracking tracking);
    
    // Optional methods for filtering
    List<RDCourseTracking> getTrackingsByStudent(int studentId);

    List<RDCourseTracking> getTrackingsByCourseSession(int courseSessionId);

    List<RDCourseTracking> getTrackingsByClassSession(int classSessionId);



}
