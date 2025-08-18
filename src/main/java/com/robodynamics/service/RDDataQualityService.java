package com.robodynamics.service;

import java.time.LocalDate;

import com.robodynamics.dto.RDDataQualityReportDTO;

public interface RDDataQualityService {
    RDDataQualityReportDTO computeForDate(LocalDate date);
    RDDataQualityReportDTO computeForOffering(Integer offeringId, LocalDate date);
    RDDataQualityReportDTO computeForCourse(Integer courseId, LocalDate date);
	RDDataQualityReportDTO computeForCourseSince(Integer id, LocalDate since, LocalDate today);
	RDDataQualityReportDTO computeForOfferingSince(Integer id, LocalDate since, LocalDate today);
	RDDataQualityReportDTO computeForSince(LocalDate since, LocalDate today);
}
