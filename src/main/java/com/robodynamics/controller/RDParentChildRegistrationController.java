package com.robodynamics.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpSession;

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

    private static final String SESSION_PENDING_PARENT_INTAKE = "rdPendingParentIntake";
    private static final String SESSION_PENDING_STUDENT_INTAKE = "rdPendingStudentIntake";

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
            Model model,
            HttpSession session) {

        try {
            RDRegistrationForm.Parent parent = registrationForm.getParent();
            RDRegistrationForm.Child child = registrationForm.getChild();

            if (parent == null || child == null) {
                model.addAttribute("errorMessage", "Invalid form submission. Please fill all required fields.");
                restoreFormContext(model, courseId, planKey, redirect);
                return "registerParentChild";
            }

            if (isBlank(parent.getFirstName())
                    || isBlank(parent.getEmail())
                    || isBlank(parent.getPhone())
                    || isBlank(parent.getUserName())
                    || isBlank(parent.getPassword())) {
                model.addAttribute("errorMessage", "Please complete all required parent fields.");
                restoreFormContext(model, courseId, planKey, redirect);
                return "registerParentChild";
            }

            if (isBlank(child.getFirstName())
                    || child.getAge() == null
                    || child.getAge() <= 0
                    || isBlank(child.getGrade())
                    || isBlank(child.getSchool())
                    || isBlank(child.getUserName())
                    || isBlank(child.getPassword())) {
                model.addAttribute("errorMessage", "Please complete all required student fields.");
                restoreFormContext(model, courseId, planKey, redirect);
                return "registerParentChild";
            }

            if (isCareerPlan(planKey)) {
                String validationError = validateCareerOnboarding(parent, child);
                if (!isBlank(validationError)) {
                    model.addAttribute("errorMessage", validationError);
                    restoreFormContext(model, courseId, planKey, redirect);
                    return "registerParentChild";
                }
            }

            if (parent.getUserName().trim().equalsIgnoreCase(child.getUserName().trim())) {
                model.addAttribute("errorMessage", "Parent and student usernames must be different.");
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

            stashPendingCareerIntake(session, planKey, parent, child);
            boolean autoEnrolled = attemptAutoEnrollment(courseId, planKey, parentUser, childUser);

            // Keep the parent signed in and continue directly to the intended next step.
            session.setAttribute("rdUser", parentUser);

            String postRegistrationRedirect = normalizeInternalRedirect(redirect);
            if (!isBlank(postRegistrationRedirect)) {
                return "redirect:" + postRegistrationRedirect;
            }

            if (!isBlank(planKey)) {
                StringBuilder checkout = new StringBuilder("/plans/checkout?plan=")
                        .append(URLEncoder.encode(planKey.trim(), StandardCharsets.UTF_8));
                if (courseId != null && courseId > 0) {
                    checkout.append("&courseId=").append(courseId);
                }
                checkout.append("&studentId=").append(childUser.getUserID());
                if (autoEnrolled) {
                    checkout.append("&autoEnrolled=true");
                }
                return "redirect:" + checkout;
            }

            return "redirect:/home";

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("errorMessage", "An unexpected error occurred while processing registration.");
            restoreFormContext(model, courseId, planKey, redirect);
            return "registerParentChild";
        }
    }

    private String normalizeInternalRedirect(String redirect) {
        if (isBlank(redirect)) {
            return null;
        }
        String value = redirect.trim();
        if (value.contains("\r") || value.contains("\n")) {
            return null;
        }
        String lower = value.toLowerCase(Locale.ENGLISH);
        if (lower.startsWith("http://") || lower.startsWith("https://") || value.startsWith("//")) {
            return null;
        }
        if (!value.startsWith("/")) {
            value = "/" + value;
        }
        return value;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean isCareerPlan(String planKey) {
        if (isBlank(planKey)) {
            return false;
        }
        return planKey.trim().toLowerCase(Locale.ENGLISH).startsWith("career");
    }

    private String validateCareerOnboarding(RDRegistrationForm.Parent parent, RDRegistrationForm.Child child) {
        if (isBlank(parent.getAptiGoal())
                || isBlank(parent.getAptiSupportLevel())
                || isBlank(parent.getAptiChallenge())) {
            return "Please complete the AptiPath parent context fields in Parent Profile.";
        }

        String gradeCode = normalizeGradeCode(child.getGrade());
        boolean senior = isSeniorSchoolGrade(gradeCode);
        boolean post12 = isPost12Grade(gradeCode);
        if (isBlank(child.getBoardCode())) {
            return "Please select the student's board/curriculum.";
        }
        if ((senior || post12) && isBlank(child.getStreamCode())) {
            return "Please select the student's current stream.";
        }
        if (senior && isBlank(child.getSubjectsCode())) {
            return "Please select the student's current subject combination.";
        }
        if (post12 && (isBlank(child.getProgramCode()) || isBlank(child.getYearsLeftCode()))) {
            return "Please complete current program and years-left details.";
        }
        return null;
    }

    private void stashPendingCareerIntake(HttpSession session,
                                          String planKey,
                                          RDRegistrationForm.Parent parent,
                                          RDRegistrationForm.Child child) {
        if (!isCareerPlan(planKey)) {
            session.removeAttribute(SESSION_PENDING_PARENT_INTAKE);
            session.removeAttribute(SESSION_PENDING_STUDENT_INTAKE);
            return;
        }

        Map<String, String> parentIntake = new LinkedHashMap<>();
        putIfPresent(parentIntake, "P_GOAL_01", parent.getAptiGoal());
        putIfPresent(parentIntake, "P_SUPPORT_01", parent.getAptiSupportLevel());
        putIfPresent(parentIntake, "P_CHALLENGE_01", parent.getAptiChallenge());

        Map<String, String> studentIntake = new LinkedHashMap<>();
        putIfPresent(studentIntake, "S_CURR_SCHOOL_01", child.getSchool());
        putIfPresent(studentIntake, "S_CURR_GRADE_01", child.getGrade());
        putIfPresent(studentIntake, "S_CURR_BOARD_01", child.getBoardCode());
        putIfPresent(studentIntake, "S_CURR_STREAM_01", child.getStreamCode());
        putIfPresent(studentIntake, "S_CURR_SUBJECTS_01", child.getSubjectsCode());
        putIfPresent(studentIntake, "S_CURR_PROGRAM_01", child.getProgramCode());
        putIfPresent(studentIntake, "S_CURR_YEARS_LEFT_01", child.getYearsLeftCode());

        session.setAttribute(SESSION_PENDING_PARENT_INTAKE, parentIntake);
        session.setAttribute(SESSION_PENDING_STUDENT_INTAKE, studentIntake);
    }

    private void putIfPresent(Map<String, String> target, String key, String value) {
        if (target == null || isBlank(key) || isBlank(value)) {
            return;
        }
        target.put(key, value.trim());
    }

    private String normalizeGradeCode(String gradeCode) {
        if (isBlank(gradeCode)) {
            return "";
        }
        return gradeCode.trim().toUpperCase(Locale.ENGLISH);
    }

    private boolean isSeniorSchoolGrade(String gradeCode) {
        String normalized = normalizeGradeCode(gradeCode);
        return "11".equals(normalized) || "12".equals(normalized);
    }

    private boolean isPost12Grade(String gradeCode) {
        switch (normalizeGradeCode(gradeCode)) {
            case "DIPLOMA_1":
            case "DIPLOMA_2":
            case "DIPLOMA_3":
            case "UG_1":
            case "UG_2":
            case "UG_3":
            case "UG_4":
            case "UG_5":
            case "PG_1":
            case "PG_2":
            case "MBA_1":
            case "MBA_2":
            case "MTECH_1":
            case "MTECH_2":
            case "COLLEGE_OTHER":
            case "WORKING":
                return true;
            default:
                return false;
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
