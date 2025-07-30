package com.robodynamics.dao;

import com.robodynamics.model.RDCourseTracking;
import java.util.List;

public interface RDCourseTrackingDAO {

    void saveTracking(RDCourseTracking trackingEntry);

    RDCourseTracking getTrackingById(int trackingId);

    List<RDCourseTracking> getTrackingByStudent(int studentId);

    List<RDCourseTracking> getTrackingByCourseSession(int courseSessionId);

    List<RDCourseTracking> getAllTrackingEntries();

	List<RDCourseTracking> getTrackingByStudentAndOffering(int studentId, int courseOfferingId);

	List<RDCourseTracking> getTrackingByEnrollmentId(int studentEnrollmentId);
	
	void update(RDCourseTracking tracking);
	
	void delete(int trackingId);
	
	 // ✅ New method to fetch tracking by Class Session
    List<RDCourseTracking> getTrackingByClassSession(int classSessionId);

	void save(RDCourseTracking tracking);

	List<RDCourseTracking> getTrackingsByStudent(int studentId);

	List<RDCourseTracking> getTrackingsByCourseSession(int courseSessionId);

	List<RDCourseTracking> getTrackingsByClassSession(int classSessionId);
}
