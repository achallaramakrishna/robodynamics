package com.robodynamics.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.service.RDCourseCategoryService;
import com.robodynamics.service.RDCourseService;

@Controller
public class RDHomeController {

    @Autowired
    private RDCourseCategoryService courseCategoryService;

    @Autowired
    private RDCourseService courseService;

    @GetMapping({"/", "/public/home"})
    public String home(Model model) {
        List<RDCourseCategory> categories = courseCategoryService.getRDCourseCategories();
        List<RDCourse> examPrepCourses = resolveExamPrepCourses();

        model.addAttribute("categories", categories);
        model.addAttribute("examPrepCourses", examPrepCourses);
        model.addAttribute("title", "Robo Dynamics - Parent Learning");
        return "home"; // /WEB-INF/views/home.jsp
    }

    @GetMapping("/contests")
    public String contests() {
        return "contests";   // contests.jsp
    }

    @GetMapping("/thank-you")
    public String thankYou(@RequestParam(value = "audience", required = false) String audience,
                           @RequestParam(value = "name", required = false) String name,
                           @RequestParam(value = "phone", required = false) String phone,
                           @RequestParam(value = "email", required = false) String email,
                           Model model) {
        model.addAttribute("audience", Optional.ofNullable(audience).orElse("parent"));
        model.addAttribute("name", nvl(name));
        model.addAttribute("phone", nvl(phone));
        model.addAttribute("email", nvl(email));
        return "thank-you"; // /WEB-INF/views/thank-you.jsp
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private List<RDCourse> resolveExamPrepCourses() {
        List<RDCourse> allCourses = courseService.getRDCourses();
        if (allCourses == null || allCourses.isEmpty()) {
            return Collections.emptyList();
        }

        List<RDCourse> activeCourses = allCourses.stream()
                .filter(course -> course != null && course.isActive())
                .collect(Collectors.toList());

        List<RDCourse> boardCourses = activeCourses.stream()
                .filter(this::looksLikeCbseOrIcseCourse)
                .sorted(Comparator.comparingInt(RDCourse::getReviewsCount).reversed())
                .limit(8)
                .collect(Collectors.toList());

        List<RDCourse> examTaggedCourses = activeCourses.stream()
                .filter(this::looksLikeExamPrepCourse)
                .sorted(Comparator.comparingInt(RDCourse::getReviewsCount).reversed())
                .limit(8)
                .collect(Collectors.toList());

        List<RDCourse> prioritized = new ArrayList<>(boardCourses);
        for (RDCourse course : examTaggedCourses) {
            if (prioritized.size() >= 8) {
                break;
            }
            boolean alreadyAdded = prioritized.stream()
                    .anyMatch(existing -> existing.getCourseId() == course.getCourseId());
            if (!alreadyAdded) {
                prioritized.add(course);
            }
        }

        if (prioritized.size() >= 6) {
            return prioritized;
        }

        List<RDCourse> merged = new ArrayList<>(prioritized);
        for (RDCourse course : activeCourses) {
            if (merged.size() >= 8) {
                break;
            }
            boolean alreadyAdded = merged.stream()
                    .anyMatch(existing -> existing.getCourseId() == course.getCourseId());
            if (!alreadyAdded) {
                merged.add(course);
            }
        }
        return merged;
    }

    private boolean looksLikeExamPrepCourse(RDCourse course) {
        String searchable = String.join(" ",
                safe(course.getCourseName()),
                safe(course.getShortDescription()),
                safe(course.getCourseDescription()),
                safe(course.getCategory()),
                course.getCourseCategory() != null ? safe(course.getCourseCategory().getCourseCategoryName()) : "")
                .toLowerCase();

        return searchable.contains("exam")
                || searchable.contains("neet")
                || searchable.contains("jee")
                || searchable.contains("olympiad")
                || searchable.contains("board")
                || searchable.contains("foundation")
                || searchable.contains("prep")
                || searchable.contains("test");
    }

    private boolean looksLikeCbseOrIcseCourse(RDCourse course) {
        String searchable = String.join(" ",
                safe(course.getCourseName()),
                safe(course.getShortDescription()),
                safe(course.getCourseDescription()),
                safe(course.getCategory()),
                course.getCourseCategory() != null ? safe(course.getCourseCategory().getCourseCategoryName()) : "")
                .toLowerCase();

        return searchable.contains("cbse")
                || searchable.contains("icse");
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    @GetMapping("/competitions")
    public String competitions() {
        return "competitions";
    }

    @GetMapping("/competitions/faq")
    public String competitionFaq() {
        return "competitions-faq";
    }

}
