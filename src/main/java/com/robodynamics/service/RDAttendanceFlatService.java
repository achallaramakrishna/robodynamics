package com.robodynamics.service;

import com.robodynamics.dto.RDAttendanceFlatRowDTO;
import java.time.LocalDate;
import java.util.List;

public interface RDAttendanceFlatService {
    List<RDAttendanceFlatRowDTO> findFlat(
        String range,                 // "day" | "week" | "month"
        LocalDate base,
        Integer offeringId,
        Integer studentId,
        String  studentLike,
        String  mentorLike,
        String  offeringLike,
        String  status,               // "Present" | "Absent" | null
        String  hasFeedback           // "yes" | "no" | null
    );
}
