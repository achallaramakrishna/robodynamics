package com.robodynamics.service;

import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import com.robodynamics.dto.RDEnrollmentReportDTO;
import java.util.List;
import java.util.Map;

public interface RDAdminReportService {
    List<RDCourseOfferingSummaryDTO> courseOfferingSummary(Integer courseId, Integer mentorId);
    List<RDEnrollmentReportDTO> enrollmentReport(int offeringId);
    List<Map<String,Object>> offeringsByCourse(int courseId);
}
