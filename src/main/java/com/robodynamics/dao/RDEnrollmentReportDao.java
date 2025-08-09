package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.dto.RDEnrollmentReportDTO;

//com.robodynamics.dao.RDEnrollmentReportDao
public interface RDEnrollmentReportDao {
List<RDEnrollmentReportDTO> getEnrollmentReport(Integer offeringId);
}