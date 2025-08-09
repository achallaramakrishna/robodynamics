package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import com.robodynamics.dto.RDEnrollmentReportDTO;

public interface RDCourseOfferingReportDao {
  List<RDCourseOfferingSummaryDTO> getOfferingSummaries(Integer courseId, Integer mentorId);
  List<Object[]> getOfferingsByCourseRaw(int courseId); // for populating dropdown (id,name)
}


