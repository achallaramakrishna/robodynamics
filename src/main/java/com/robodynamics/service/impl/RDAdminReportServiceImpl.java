package com.robodynamics.service.impl;

import com.robodynamics.dao.RDCourseOfferingReportDao;
import com.robodynamics.dao.RDEnrollmentReportDao;
import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import com.robodynamics.dto.RDEnrollmentReportDTO;
import com.robodynamics.service.RDAdminReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional(readOnly = true)
public class RDAdminReportServiceImpl implements RDAdminReportService {

    private final RDCourseOfferingReportDao offeringDao;
    private final RDEnrollmentReportDao enrollmentDao;

    public RDAdminReportServiceImpl(RDCourseOfferingReportDao offeringDao, RDEnrollmentReportDao enrollmentDao) {
        this.offeringDao = offeringDao;
        this.enrollmentDao = enrollmentDao;
    }

    @Override
    public List<RDCourseOfferingSummaryDTO> courseOfferingSummary(Integer courseId, Integer mentorId) {
        return offeringDao.getOfferingSummaries(courseId, mentorId);
    }

    @Override
    public List<RDEnrollmentReportDTO> enrollmentReport(int offeringId) {
        return enrollmentDao.getEnrollmentReport(offeringId);
    }

    @Override
    public List<Map<String, Object>> offeringsByCourse(int courseId) {
        List<Object[]> rows = offeringDao.getOfferingsByCourseRaw(courseId);
        List<Map<String,Object>> list = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String,Object> m = new HashMap<>();
            m.put("courseOfferingId", r[0]);
            m.put("courseOfferingName", r[1]);
            list.add(m);
        }
        return list;
    }
}
