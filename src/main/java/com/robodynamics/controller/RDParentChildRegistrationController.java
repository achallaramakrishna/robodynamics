package com.robodynamics.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.form.RDRegistrationForm;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;

@Controller
public class RDParentChildRegistrationController {

    @Autowired
    private RDUserService rdUserService;

    @Autowired
    private RDCourseOfferingService courseOfferingService;

    @Autowired
    private RDStudentEnrollmentService enrollmentService;

    @Autowired
    private RDCourseService courseService;

    @GetMapping("/registerParentChild")
    public String showParentChildForm(@RequestParam(value = "courseId", required = false) Integer courseId,
                                      @RequestParam(value = "plan", required = false) String planKey,
                                      @RequestParam(value = "redirect", required = false) String redirect,
                                      Model model) {

        RDRegistrationForm registrationForm = new RDRegistrationForm();
        registrationForm.setParent(new RDRegistrationForm.Parent());
        registrationForm.setChild(new RDRegistrationForm.Child());

        model.addAttribute("registrationForm", registrationForm);
        restoreFormContext(model, courseId, planKey, redirect);

        return "registerParentChild";
    }

    @PostMapping("/registerParentChild")
    public String handleParentChildRegistration(
            @ModelAttribute("registrationForm") RDRegistrationForm registrationForm,
            @RequestParam(value = "courseId", required = false) Integer courseId,
            @RequestParam(value = "plan", required = false) String planKey,
            @RequestParam(value = "redirect", required = false) String redirect,
            Model model) {

        try {
            RDRegistrationForm.Parent parent = registrationForm.getParent();
            RDRegistrationForm.Child child = registrationForm.getChild();

            if (parent == null || child == null) {
                model.addAttribute("errorMessage", "Invalid form submission. Please fill all required fields.");
                restoreFormContext(model, courseId, planKey, redirect);
                return "registerParentChild";
            }

            if (rdUserService.isUsernameTaken(parent.getUserName())) {
                model.addAttribute("errorMessage", "Parent username already exists. Please choose another.");
                restoreFormContext(model, courseId, planKey, redirect);
                return "registerParentChild";
            }

            if (rdUserService.isUsernameTaken(child.getUserName())) {
                model.addAttribute("errorMessage", "Child username already exists. Please choose another.");
                restoreFormContext(model, courseId, planKey, redirect);
                return "registerParentChild";
            }

            rdUserService.saveParentAndChild(parent, child);

            RDUser parentUser = rdUserService.findByUserName(parent.getUserName());
            RDUser childUser = rdUserService.findByUserName(child.getUserName());

            if (parentUser == null || childUser == null) {
                model.addAttribute("errorMessage", "Registration completed, but user profile lookup failed. Please contact support.");
                restoreFormContext(model, courseId, planKey, redirect);
                return "registerParentChild";
            }

            boolean autoEnrolled = attemptAutoEnrollment(courseId, planKey, parentUser, childUser);

            StringBuilder loginRedirect = new StringBuilder("redirect:/login?registered=true");
            if (autoEnrolled) {
                loginRedirect.append("&autoEnrolled=true");
            }
            if (redirect != null && !redirect.trim().isEmpty()) {
                loginRedirect.append("&redirect=")
                             .append(URLEncoder.encode(redirect.trim(), StandardCharsets.UTF_8));
            }
            return loginRedirect.toString();

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", "An unexpected error occurred while processing registration.");
            restoreFormContext(model, courseId, planKey, redirect);
            return "registerParentChild";
        }
    }

    private boolean attemptAutoEnrollment(Integer courseId, String planKey, RDUser parentUser, RDUser childUser) {
        if (!shouldAutoEnroll(planKey, courseId)) {
            return false;
        }

        Integer resolvedCourseId = (courseId != null && courseId > 0) ? courseId : resolveDefaultExamCourseId();
        if (resolvedCourseId == null) {
            return false;
        }

        RDCourseOffering offering = courseOfferingService.getOnlineCourseOffering(resolvedCourseId);
        if (offering == null) {
            return false;
        }

        int studentId = childUser.getUserID();
        int offeringId = offering.getCourseOfferingId();
        if (enrollmentService.existsByStudentAndOffering(studentId, offeringId)) {
            return true;
        }

        RDStudentEnrollment enrollment = new RDStudentEnrollment();
        enrollment.setParent(parentUser);
        enrollment.setStudent(childUser);
        enrollment.setCourseOffering(offering);
        enrollment.setEnrollmentDate(new Date());
        enrollment.setStatus(1);
        enrollment.setProgress(0d);
        enrollment.setDiscountPercent(0d);
        enrollment.setDiscountReason("Auto-enrolled via exam prep registration flow");
        enrollment.setFinalFee(offering.getFeeAmount() != null ? offering.getFeeAmount() : 0d);
        enrollmentService.saveRDStudentEnrollment(enrollment);
        return true;
    }

    private boolean shouldAutoEnroll(String planKey, Integer courseId) {
        if (courseId != null && courseId > 0) {
            return true;
        }
        if (planKey == null) {
            return false;
        }
        String normalized = planKey.trim().toLowerCase(Locale.ENGLISH);
        return normalized.startsWith("exam");
    }

    private Integer resolveDefaultExamCourseId() {
        List<RDCourse> courses = courseService.getRDCourses();
        if (courses == null || courses.isEmpty()) {
            return null;
        }

        for (RDCourse course : courses) {
            if (course == null || !course.isActive()) {
                continue;
            }
            if (!looksLikeExamCourse(course)) {
                continue;
            }
            RDCourseOffering offering = courseOfferingService.getOnlineCourseOffering(course.getCourseId());
            if (offering != null) {
                return course.getCourseId();
            }
        }

        for (RDCourse course : courses) {
            if (course == null || !course.isActive()) {
                continue;
            }
            RDCourseOffering offering = courseOfferingService.getOnlineCourseOffering(course.getCourseId());
            if (offering != null) {
                return course.getCourseId();
            }
        }
        return null;
    }

    private boolean looksLikeExamCourse(RDCourse course) {
        String blob = String.join(" ",
                safe(course.getCourseName()),
                safe(course.getShortDescription()),
                safe(course.getCourseDescription()),
                safe(course.getCategory()),
                course.getCourseCategory() != null ? safe(course.getCourseCategory().getCourseCategoryName()) : "")
                .toLowerCase(Locale.ENGLISH);

        return blob.contains("cbse")
                || blob.contains("icse")
                || blob.contains("exam")
                || blob.contains("neet")
                || blob.contains("jee")
                || blob.contains("olympiad")
                || blob.contains("prep")
                || blob.contains("test");
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private void restoreFormContext(Model model, Integer courseId, String planKey, String redirect) {
        model.addAttribute("courseId", courseId);
        model.addAttribute("planKey", planKey);
        model.addAttribute("redirectUrl", redirect);
    }
}
