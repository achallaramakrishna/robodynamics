package com.robodynamics.dao;

import java.time.LocalDate;
import java.util.List;

import com.robodynamics.dto.RDSessionDetailStat;
import com.robodynamics.model.RDCourseOffering;

public interface RDDataQualityDao {

    // Counts for a given offering
    int countSessions(Integer offeringId);
    int countSessionsUpToDate(Integer offeringId, LocalDate date);
    int countSessionDetails(Integer offeringId);
    int countActiveEnrollments(Integer offeringId);
    int countAttendanceUpToDate(Integer offeringId, LocalDate date);
    int countTrackingUpToDate(Integer offeringId, LocalDate date);

    // Lookups used by the report
    RDCourseOffering getOfferingWithJoins(Integer offeringId);
    List<RDCourseOffering> getOfferingsByCourseAndDate(Integer courseId, LocalDate date);
    List<RDSessionDetailStat> listSessionDetailStatsByCourse(Integer courseId);
	List<RDCourseOffering> getOfferingsIntersecting(LocalDate since, LocalDate to);
	List<RDCourseOffering> getOfferingsByCourse(Integer courseId);
	int countAttendanceInWindow(int offeringId, LocalDate wStart, LocalDate wEnd);
	int countTrackingInWindow(int offeringId, LocalDate wStart, LocalDate wEnd);

}
	