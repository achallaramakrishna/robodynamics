package com.robodynamics.service;



import java.time.LocalDate;
import java.util.List;

import com.robodynamics.dto.CalendarDTO;
import com.robodynamics.dto.MentorDTO;

public interface RDMentorUtilizationService {
    List<MentorDTO> getAllMentorsMinimal();
    CalendarDTO buildWeeklyCalendar(int mentorId, LocalDate weekStart, int slotMinutes);
}
