package com.robodynamics.service.impl;

import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dao.RDUserDao;
import com.robodynamics.dto.CalendarDTO;
import com.robodynamics.dto.MentorDTO;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDMentorUtilizationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RDMentorUtilizationServiceImpl implements RDMentorUtilizationService {

    @Autowired private RDUserDao userDao;
    @Autowired private RDCourseOfferingDao offeringDAO;

    private static final ZoneId ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter HM = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Get all active mentors (profile_id = 3, active = 1)
     */
    @Override
    public List<MentorDTO> getAllMentorsMinimal() {
        List<RDUser> mentors = userDao.searchUsers(3, 1);
        return mentors.stream()
                .map(u -> new MentorDTO(u.getUserID(), u.getFullName()))
                .collect(Collectors.toList());
    }

    /**
     * Build weekly calendar using RDCourseOffering only.
     * Each day (Mon–Sun) shows sessions based on the offering's daysOfWeek and times.
     */
    @Override
    public CalendarDTO buildWeeklyCalendar(int mentorId, LocalDate weekStart, int slotMinutes) {

        LocalDate weekEnd = weekStart.plusDays(6);
        java.sql.Date from = java.sql.Date.valueOf(weekStart);
        java.sql.Date to   = java.sql.Date.valueOf(weekEnd.plusDays(1));

        // Fetch mentor offerings between given week range.
        // If your DAO doesn’t have this, replace with a general fetch and Java filter.
        List<RDCourseOffering> offerings;
        try {
            offerings = offeringDAO.findForMentorBetweenRDUser(mentorId, from, to);
        } catch (Exception e) {
            offerings = offeringDAO.getAllRDCourseOfferings().stream()
                    .filter(o -> o.getInstructor() != null && o.getInstructor().getUserID() == mentorId)
                    .collect(Collectors.toList());
        }

        Map<String, List<CalendarDTO.Slot>> grid = new LinkedHashMap<>();

        // Loop 7 days from weekStart
        for (int i = 0; i < 7; i++) {
            LocalDate currentDay = weekStart.plusDays(i);
            DayOfWeek dow = currentDay.getDayOfWeek();
            List<CalendarDTO.Slot> slots = new ArrayList<>();

            for (RDCourseOffering offering : offerings) {
                if (offering.getDaysOfWeek() == null ||
                    offering.getSessionStartTime() == null ||
                    offering.getSessionEndTime() == null)
                    continue;

                Set<DayOfWeek> days = parseDays(offering.getDaysOfWeek());
                if (!days.contains(dow))
                    continue;

                // Ensure currentDay within offering’s date range
                LocalDate start = toLocalDate(offering.getStartDate());
                LocalDate end = offering.getEndDate() != null ? toLocalDate(offering.getEndDate()) : weekEnd;

                if (currentDay.isBefore(start) || currentDay.isAfter(end))
                    continue;

                // Build slot
                CalendarDTO.Slot slot = new CalendarDTO.Slot();
                slot.time = HM.format(offering.getSessionStartTime()) + " - " + HM.format(offering.getSessionEndTime());
                slot.status = "BUSY";
                slot.courses = new ArrayList<>();
                slot.courses.add(offering.getCourseOfferingName());

                slots.add(slot);
            }

            // Sort slots by time
            slots.sort(Comparator.comparing(s -> s.time));

            grid.put(dow.name().substring(0, 3), slots);
        }

        RDUser mentor = userDao.getRDUser(mentorId);

        CalendarDTO dto = new CalendarDTO();
        dto.setMentorId(mentorId);
        dto.setMentorName(mentor.getFullName());
        dto.setWeekStart(weekStart);
        dto.setWeekEnd(weekEnd);
        dto.setGrid(grid);
        dto.setWeeklyCapacityHours(0);
        dto.setBookedHours(0);
        dto.setUtilizationPct(0);

        return dto;
    }

    /**
     * Convert Date -> LocalDate using configured ZoneId.
     */
    private LocalDate toLocalDate(Date date) {
        if (date == null) return null;
        return Instant.ofEpochMilli(date.getTime()).atZone(ZONE).toLocalDate();
    }

    /**
     * Parse "MON,WED,FRI" → {MONDAY, WEDNESDAY, FRIDAY}
     */
    private Set<DayOfWeek> parseDays(String dayStr) {
        Set<DayOfWeek> days = new HashSet<>();
        if (dayStr == null || dayStr.isEmpty()) return days;
        for (String s : dayStr.split(",")) {
            String code = s.trim().toUpperCase();
            try {
                // allow both MON and MONDAY formats
                if (code.length() == 3)
                    days.add(shortNameToDayOfWeek(code));
                else
                    days.add(DayOfWeek.valueOf(code));
            } catch (Exception e) {
                // ignore invalid entries
            }
        }
        return days;
    }

    private DayOfWeek shortNameToDayOfWeek(String s) {
        switch (s) {
            case "MON": return DayOfWeek.MONDAY;
            case "TUE": return DayOfWeek.TUESDAY;
            case "WED": return DayOfWeek.WEDNESDAY;
            case "THU": return DayOfWeek.THURSDAY;
            case "FRI": return DayOfWeek.FRIDAY;
            case "SAT": return DayOfWeek.SATURDAY;
            case "SUN": return DayOfWeek.SUNDAY;
            default: throw new IllegalArgumentException("Invalid day: " + s);
        }
    }
}
