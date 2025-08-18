package com.robodynamics.controller;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.dto.RDDataQualityReportDTO;
import com.robodynamics.service.RDDataQualityService;


@Controller
@RequestMapping("/admin")
public class RDDataQualityController {

    private final RDDataQualityService dataQualityService;

    public RDDataQualityController(RDDataQualityService dataQualityService) {
        this.dataQualityService = dataQualityService;
    }

    /** Page: /admin/data-quality (prefills the "since" field) */
    @GetMapping("/data-quality")
    public String viewDataQualityPage(
            @RequestParam(value = "since", required = false) String sinceParam,
            @RequestParam(value = "date",  required = false) String legacyDateParam, // backward-compat
            Model model) {

        LocalDate today = LocalDate.now();
        LocalDate since = resolveSince(sinceParam, legacyDateParam, today);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        model.addAttribute("sinceDateFormatted", since.format(fmt));         // new JSP field
        model.addAttribute("selectedDateFormatted", since.format(fmt));      // legacy JSPs still work

        return "admin/data-quality"; // -> /WEB-INF/views/admin/data-quality.jsp
    }

    /** JSON API: computes completeness from 'since' up to today (or explicit 'to' if you add it later) */
    @GetMapping("/api/data-quality")
    @ResponseBody
    public RDDataQualityReportDTO dataQualityApi(
            @RequestParam(value = "since", required = false) String sinceParam,
            @RequestParam(value = "date",  required = false) String legacyDateParam, // backward-compat
            @RequestParam(value = "scope", required = false) String scope,
            @RequestParam(value = "id",    required = false) Integer id) {

        LocalDate today = LocalDate.now();
        LocalDate since = resolveSince(sinceParam, legacyDateParam, today);

        if ("course".equalsIgnoreCase(scope) && id != null) {
            return dataQualityService.computeForCourseSince(id, since, today);
        } else if ("offering".equalsIgnoreCase(scope) && id != null) {
            return dataQualityService.computeForOfferingSince(id, since, today);
        } else {
            return dataQualityService.computeForSince(since, today);
        }
    }

    /* ----------------- helpers ----------------- */

    /** Resolve "since" with precedence: explicit since -> legacy date -> default Aug 1 of academic year. */
    private LocalDate resolveSince(String sinceParam, String legacyDateParam, LocalDate today) {
        if (sinceParam != null && !sinceParam.isEmpty()) return LocalDate.parse(sinceParam);
        if (legacyDateParam != null && !legacyDateParam.isEmpty()) return LocalDate.parse(legacyDateParam);
        return defaultAcademicStart(today);
    }

    /** Default academic start = Aug 1 of current year; if today < Aug 1, use last year’s Aug 1. */
    private LocalDate defaultAcademicStart(LocalDate now) {
        LocalDate aug1 = LocalDate.of(now.getYear(), Month.AUGUST, 1);
        return now.isBefore(aug1) ? aug1.minusYears(1) : aug1;
    }
}
