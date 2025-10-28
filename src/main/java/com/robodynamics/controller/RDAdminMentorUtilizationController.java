package com.robodynamics.controller;

import com.robodynamics.service.RDMentorUtilizationService;
import com.robodynamics.dto.CalendarDTO;
import com.robodynamics.dto.MentorDTO;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;


@Controller
@RequestMapping("/admin/mentor-utilization")
public class RDAdminMentorUtilizationController {

	@Autowired private RDMentorUtilizationService utilizationService;

    

    // Page
    @GetMapping
    public String page(Model model,
                       @RequestParam(value = "weekStart", required = false)
                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        if (weekStart == null) {
            // Asia/Kolkata Monday of current week
            LocalDate today = LocalDate.now();
            weekStart = today.minusDays((today.getDayOfWeek().getValue() + 6) % 7); // Monday
        }
        List<MentorDTO> mentors = utilizationService.getAllMentorsMinimal();
        model.addAttribute("mentors", mentors);
        model.addAttribute("weekStart", weekStart);
        model.addAttribute("weekEnd", weekStart.plusDays(6));
        return "admin/mentor-utilization";
    }

    // AJAX: calendar JSON
    @GetMapping("/data")
    @ResponseBody
    public CalendarDTO getCalendar(@RequestParam("mentorId") Integer mentorId,
                                   @RequestParam("weekStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart,
                                   @RequestParam(value = "slotMinutes", required = false, defaultValue = "30") int slotMinutes) {
        return utilizationService.buildWeeklyCalendar(mentorId, weekStart, slotMinutes);
    }
}
