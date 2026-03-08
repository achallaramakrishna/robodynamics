package com.robodynamics.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.impl.RDAITutorIntegrationService;

@Controller
public class RDAITutorLaunchController {

    @Autowired
    private RDAITutorIntegrationService aiTutorIntegrationService;

    @Autowired
    private RDUserService rdUserService;

    @Autowired
    private RDStudentEnrollmentService studentEnrollmentService;

    @GetMapping("/ai-tutor/launch")
    public String launch(@RequestParam(value = "module", required = false, defaultValue = "VEDIC_MATH") String module,
                         @RequestParam(value = "grade", required = false) String grade,
                         @RequestParam(value = "childId", required = false) Integer childId,
                         HttpSession session) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) {
            return "redirect:/login?redirect=/ai-tutor/launch";
        }

        Integer effectiveChildId = childId;
        if (me.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
            effectiveChildId = me.getUserID();
        } else if (effectiveChildId == null) {
            List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
            if (children != null && !children.isEmpty()) {
                effectiveChildId = children.get(0).getUserID();
            }
        }

        if (isEnrollmentRequiredModule(module) && !isStudentEnrolledForModule(effectiveChildId, module)) {
            String redirectPath = me.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()
                    ? "/studentDashboard"
                    : "/home";
            return "redirect:" + redirectPath
                    + "?aiTutorAccessDenied=1&module="
                    + URLEncoder.encode(normalizeModule(module), StandardCharsets.UTF_8);
        }

        String learnerName = resolveLearnerName(me, effectiveChildId);
        String token = aiTutorIntegrationService.createLaunchToken(me, effectiveChildId, module, grade);
        ModuleEnrollmentContext launchContext = resolveEnrollmentForModule(effectiveChildId, module);
        String launchUrl = aiTutorIntegrationService.buildLaunchUrl(
                token,
                learnerName,
                module,
                launchContext == null ? null : launchContext.enrollmentId,
                launchContext == null ? null : launchContext.courseId
        );
        return "redirect:" + launchUrl;
    }

    private String resolveLearnerName(RDUser currentUser, Integer effectiveChildId) {
        if (currentUser == null) {
            return "";
        }
        if (currentUser.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
            return currentUser.getFullName();
        }
        if (effectiveChildId == null) {
            return currentUser.getFullName();
        }
        RDUser child = rdUserService.getRDUser(effectiveChildId);
        if (child == null) {
            return currentUser.getFullName();
        }
        return child.getFullName();
    }

    private boolean isStudentEnrolledForModule(Integer studentId, String module) {
        if (studentId == null) {
            return false;
        }
        List<com.robodynamics.model.RDStudentEnrollment> enrollments =
                studentEnrollmentService.getStudentEnrollmentByStudent(studentId);
        if (enrollments == null || enrollments.isEmpty()) {
            return false;
        }
        for (com.robodynamics.model.RDStudentEnrollment enrollment : enrollments) {
            if (enrollment == null || enrollment.getStatus() == 0 || enrollment.getCourseOffering() == null
                    || enrollment.getCourseOffering().getCourse() == null) {
                continue;
            }
            int enrolledCourseId = enrollment.getCourseOffering().getCourse().getCourseId();
            String enrolledCourseName = enrollment.getCourseOffering().getCourse().getCourseName();
            if (aiTutorIntegrationService.isCourseMappedToModule(enrolledCourseId, enrolledCourseName, module)) {
                return true;
            }
        }
        return false;
    }

    private ModuleEnrollmentContext resolveEnrollmentForModule(Integer studentId, String module) {
        if (studentId == null) {
            return null;
        }
        List<com.robodynamics.model.RDStudentEnrollment> enrollments =
                studentEnrollmentService.getStudentEnrollmentByStudent(studentId);
        if (enrollments == null || enrollments.isEmpty()) {
            return null;
        }
        for (com.robodynamics.model.RDStudentEnrollment enrollment : enrollments) {
            if (enrollment == null || enrollment.getStatus() == 0 || enrollment.getCourseOffering() == null
                    || enrollment.getCourseOffering().getCourse() == null) {
                continue;
            }
            int enrolledCourseId = enrollment.getCourseOffering().getCourse().getCourseId();
            String enrolledCourseName = enrollment.getCourseOffering().getCourse().getCourseName();
            if (aiTutorIntegrationService.isCourseMappedToModule(enrolledCourseId, enrolledCourseName, module)) {
                return new ModuleEnrollmentContext(enrollment.getEnrollmentId(), enrolledCourseId);
            }
        }
        return null;
    }

    private static final class ModuleEnrollmentContext {
        private final Integer enrollmentId;
        private final Integer courseId;

        private ModuleEnrollmentContext(Integer enrollmentId, Integer courseId) {
            this.enrollmentId = enrollmentId;
            this.courseId = courseId;
        }
    }

    private String normalizeModule(String module) {
        if (module == null || module.isBlank()) {
            return "VEDIC_MATH";
        }
        return module.trim().toUpperCase();
    }

    private boolean isEnrollmentRequiredModule(String module) {
        String normalized = normalizeModule(module);
        return "NEET_PHYSICS".equals(normalized)
                || "NEET_CHEMISTRY".equals(normalized)
                || "NEET_BIOLOGY".equals(normalized);
    }
}
