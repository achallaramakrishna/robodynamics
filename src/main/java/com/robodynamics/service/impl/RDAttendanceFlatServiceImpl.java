package com.robodynamics.service.impl;

import com.robodynamics.dao.RDAttendanceFlatDao;
import com.robodynamics.dto.RDAttendanceFlatRowDTO;
import com.robodynamics.service.RDAttendanceFlatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;

@Service
public class RDAttendanceFlatServiceImpl implements RDAttendanceFlatService {

	@Autowired
    private RDAttendanceFlatDao dao;

    public RDAttendanceFlatServiceImpl(RDAttendanceFlatDao dao) { this.dao = dao; }

    @Override
    @Transactional
    public List<RDAttendanceFlatRowDTO> findFlat(String range, LocalDate base,
                                               Integer offeringId, Integer studentId,
                                               String studentLike, String mentorLike, String offeringLike,
                                               String status, String hasFeedback) {
        range = (range == null ? "day" : range.toLowerCase());
        switch (range) {
            case "week":  return dao.findWeek(base, offeringId, studentId, studentLike, mentorLike, offeringLike, status, hasFeedback);
            case "month": return dao.findMonth(base, offeringId, studentId, studentLike, mentorLike, offeringLike, status, hasFeedback);
            default:      return dao.findDay(base, offeringId, studentId, studentLike, mentorLike, offeringLike, status, hasFeedback);
        }
    }
}
