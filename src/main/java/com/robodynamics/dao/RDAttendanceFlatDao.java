package com.robodynamics.dao;

import com.robodynamics.dto.RDAttendanceFlatRowDTO;
import java.time.LocalDate;
import java.util.List;

public interface RDAttendanceFlatDao {
    List<RDAttendanceFlatRowDTO> findDay(LocalDate day,
                                       Integer offeringId,
                                       Integer studentId,
                                       String  studentLike,
                                       String  mentorLike,
                                       String  offeringLike,
                                       String  status,         // "Present"|"Absent"|null
                                       String  hasFeedback);   // "yes"|"no"|null

    List<RDAttendanceFlatRowDTO> findWeek(LocalDate base,   // week = Mon..Sun around base
                                        Integer offeringId,
                                        Integer studentId,
                                        String  studentLike,
                                        String  mentorLike,
                                        String  offeringLike,
                                        String  status,
                                        String  hasFeedback);

    List<RDAttendanceFlatRowDTO> findMonth(LocalDate base,  // month = 1st..last(base)
                                         Integer offeringId,
                                         Integer studentId,
                                         String  studentLike,
                                         String  mentorLike,
                                         String  offeringLike,
                                         String  status,
                                         String  hasFeedback);
}
