package com.robodynamics.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDCIAssessmentSession;
import com.robodynamics.model.RDCIIntakeResponse;
import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDCompanyBranding;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCompanyContextService;
import com.robodynamics.service.RDCIAssessmentSessionService;
import com.robodynamics.service.RDCIIntakeService;
import com.robodynamics.service.RDCISubscriptionService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.util.RDRoleRouteUtil;

@Controller
@RequestMapping("/aptipath/parent")
public class RDAptiPathParentController {

    private static final Set<String> REQUIRED_PARENT_INTAKE_CODES = Set.copyOf(Arrays.asList(
            "P_GOAL_01",
            "P_SUPPORT_01",
            "P_STRENGTH_01",
            "P_CHALLENGE_01",
            "P_BUDGET_01",
            "P_GEOGRAPHY_01",
            "P_LANGUAGE_01",
            "P_COACHING_01",
            "P_MODEL_01",
            "P_TIMELINE_01"));
    private static final String DEFAULT_PARENT_ONBOARDING_VIDEO_URL =
            "/assets/videos/aptipath-parent-onboarding.html";
    private static final String STUDENT_INTAKE_SECTION_PROFILE = "PROFILE";
    private static final String STUDENT_INTAKE_SCHOOL_CODE = "S_CURR_SCHOOL_01";
    private static final String STUDENT_INTAKE_GRADE_CODE = "S_CURR_GRADE_01";
    private static final String STUDENT_INTAKE_BOARD_CODE = "S_CURR_BOARD_01";
    private static final String STUDENT_INTAKE_STREAM_CODE = "S_CURR_STREAM_01";
    private static final String STUDENT_INTAKE_SUBJECTS_CODE = "S_CURR_SUBJECTS_01";
    private static final String STUDENT_INTAKE_PROGRAM_CODE = "S_CURR_PROGRAM_01";
    private static final String STUDENT_INTAKE_YEARS_LEFT_CODE = "S_CURR_YEARS_LEFT_01";

    @Value("${aptipath.onboarding.parentVideoUrl:" + DEFAULT_PARENT_ONBOARDING_VIDEO_URL + "}")
    private String onboardingParentVideoUrl;

    @Autowired
    private RDCISubscriptionService ciSubscriptionService;

    @Autowired
    private RDCIAssessmentSessionService ciAssessmentSessionService;

    @Autowired
    private RDUserService userService;

    @Autowired
    private RDCompanyContextService companyContextService;

    @Autowired
    private RDCIIntakeService ciIntakeService;

    @GetMapping("/home")
    public String home(@RequestParam(value = "embed", defaultValue = "0") Integer embed,
                       @RequestParam(value = "company", required = false) String companyCode,
                       Model model,
                       HttpSession session) {

        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/parent/home";
        }

        RDUser parent = (RDUser) rawUser;
        if (parent.getProfile_id() != RDUser.profileType.ROBO_PARENT.getValue()) {
            return RDRoleRouteUtil.redirectHomeFor(parent);
        }

        List<RDUser> children = userService.getRDChilds(parent.getUserID());
        if (children == null) {
            children = new ArrayList<>();
        }

        List<RDCISubscription> parentSubscriptions = ciSubscriptionService.getByParentUserId(parent.getUserID());
        Map<Integer, RDCISubscription> latestSubscriptionByStudent = new LinkedHashMap<>();
        for (RDCISubscription s : parentSubscriptions) {
            if (s == null || s.getStudentUser() == null || s.getStudentUser().getUserID() == null) {
                continue;
            }
            if (!"APTIPATH".equalsIgnoreCase(nz(s.getModuleCode()))) {
                continue;
            }
            Integer studentId = s.getStudentUser().getUserID();
            RDCISubscription existing = latestSubscriptionByStudent.get(studentId);
            if (existing == null || isNewer(s, existing)) {
                latestSubscriptionByStudent.put(studentId, s);
            }
        }

        Map<Integer, RDCIAssessmentSession> latestSessionByStudent = new LinkedHashMap<>();
        Map<Integer, Boolean> intakeCompletedByStudent = new LinkedHashMap<>();
        for (RDUser child : children) {
            if (child == null || child.getUserID() == null) {
                continue;
            }
            RDCIAssessmentSession latest = ciAssessmentSessionService.getLatestByStudentUserId(child.getUserID());
            if (latest != null) {
                latestSessionByStudent.put(child.getUserID(), latest);
            }
            RDCISubscription subscription = latestSubscriptionByStudent.get(child.getUserID());
            if (subscription != null) {
                List<RDCIIntakeResponse> intakeRows = ciIntakeService.getBySubscriptionId(subscription.getCiSubscriptionId());
                boolean parentIntakeDone = hasRequiredParentIntake(intakeRows);
                intakeCompletedByStudent.put(child.getUserID(), parentIntakeDone);
            }
        }

        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        boolean embedMode = embed != null && embed == 1;

        model.addAttribute("parent", parent);
        model.addAttribute("children", children);
        model.addAttribute("latestSubscriptionByStudent", latestSubscriptionByStudent);
        model.addAttribute("latestSessionByStudent", latestSessionByStudent);
        model.addAttribute("intakeCompletedByStudent", intakeCompletedByStudent);
        model.addAttribute("embedMode", embedMode);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        model.addAttribute("onboardingVideoUrl", nz(onboardingParentVideoUrl));
        return "parent/aptipath-home";
    }

    @GetMapping("/intake")
    public String intake(@RequestParam("studentId") Integer studentId,
                         @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                         @RequestParam(value = "company", required = false) String companyCode,
                         Model model,
                         HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/parent/intake?studentId=" + studentId;
        }

        RDUser parent = requireParentUser(session);
        if (parent == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDUser child = resolveParentChild(parent, studentId);
        if (child == null) {
            return "redirect:/aptipath/parent/home";
        }

        RDCISubscription subscription = ciSubscriptionService.getLatestByStudentUserId(child.getUserID());
        if (!isActiveAptiPathSubscription(subscription)) {
            return "redirect:/aptipath/parent/home";
        }

        List<RDCIIntakeResponse> intakeRows = ciIntakeService.getBySubscriptionId(subscription.getCiSubscriptionId());
        Map<String, String> answers = intakeRows.stream()
                .filter(row -> "PARENT".equalsIgnoreCase(nz(row.getRespondentType())))
                .filter(row -> row.getQuestionCode() != null)
                .collect(Collectors.toMap(
                        row -> row.getQuestionCode().toUpperCase(),
                        row -> nz(row.getAnswerValue()),
                        (left, right) -> right,
                        LinkedHashMap::new));

        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);

        model.addAttribute("parent", parent);
        model.addAttribute("student", child);
        model.addAttribute("subscription", subscription);
        model.addAttribute("answers", answers);
        model.addAttribute("embedMode", embed != null && embed == 1);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        return "parent/aptipath-intake";
    }

    @PostMapping("/intake")
    public String saveIntake(@RequestParam("subscriptionId") Long subscriptionId,
                             @RequestParam("studentId") Integer studentId,
                             @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                             @RequestParam(value = "company", required = false) String companyCode,
                             @RequestParam Map<String, String> formData,
                             HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login";
        }

        RDUser parent = requireParentUser(session);
        if (parent == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDUser child = resolveParentChild(parent, studentId);
        if (child == null) {
            return "redirect:/aptipath/parent/home";
        }

        RDCISubscription subscription = ciSubscriptionService.getById(subscriptionId);
        if (!isActiveAptiPathSubscription(subscription)) {
            return "redirect:/aptipath/parent/home";
        }

        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_GOAL_01", formData.get("P_GOAL_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_SUPPORT_01", formData.get("P_SUPPORT_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_STRENGTH_01", formData.get("P_STRENGTH_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_CHALLENGE_01", formData.get("P_CHALLENGE_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_BUDGET_01", formData.get("P_BUDGET_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_GEOGRAPHY_01", formData.get("P_GEOGRAPHY_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_LANGUAGE_01", formData.get("P_LANGUAGE_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_COACHING_01", formData.get("P_COACHING_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_MODEL_01", formData.get("P_MODEL_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_TIMELINE_01", formData.get("P_TIMELINE_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_MIND_01", formData.get("P_MIND_01"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_MIND_02", formData.get("P_MIND_02"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_MIND_03", formData.get("P_MIND_03"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_MIND_04", formData.get("P_MIND_04"));
        saveParentIntakeResponse(subscriptionId, parent.getUserID(), child.getUserID(), "P_NOTES_01", formData.get("P_NOTES_01"));

        String target = "/aptipath/parent/home?intakeSaved=1";
        if (embed != null && embed == 1) {
            target += "&embed=1";
        }
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            target += "&company=" + companyCode.trim();
        }
        return "redirect:" + target;
    }

    @GetMapping("/student-profile")
    public String studentProfile(@RequestParam("studentId") Integer studentId,
                                 @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                                 @RequestParam(value = "company", required = false) String companyCode,
                                 @RequestParam(value = "validationError", required = false) Integer validationError,
                                 Model model,
                                 HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/parent/student-profile?studentId=" + studentId;
        }

        RDUser parent = requireParentUser(session);
        if (parent == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDUser child = resolveParentChild(parent, studentId);
        if (child == null) {
            return "redirect:/aptipath/parent/home";
        }

        RDCISubscription subscription = ciSubscriptionService.getLatestByStudentUserId(child.getUserID());
        if (!isActiveAptiPathSubscription(subscription)) {
            return "redirect:/aptipath/parent/home";
        }

        Map<String, String> answers = loadStudentProfileAnswers(subscription.getCiSubscriptionId());
        if (trimToNull(answers.get(STUDENT_INTAKE_SCHOOL_CODE)) == null) {
            answers.put(STUDENT_INTAKE_SCHOOL_CODE, nz(child.getSchoolName()));
        }
        if (trimToNull(answers.get(STUDENT_INTAKE_GRADE_CODE)) == null) {
            answers.put(STUDENT_INTAKE_GRADE_CODE, nz(child.getGrade()));
        }

        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);

        model.addAttribute("parent", parent);
        model.addAttribute("student", child);
        model.addAttribute("subscription", subscription);
        model.addAttribute("answers", answers);
        model.addAttribute("validationError", validationError != null && validationError == 1);
        model.addAttribute("embedMode", embed != null && embed == 1);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        return "parent/aptipath-student-profile";
    }

    @PostMapping("/student-profile")
    public String saveStudentProfile(@RequestParam("subscriptionId") Long subscriptionId,
                                     @RequestParam("studentId") Integer studentId,
                                     @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                                     @RequestParam(value = "company", required = false) String companyCode,
                                     @RequestParam Map<String, String> formData,
                                     HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login";
        }

        RDUser parent = requireParentUser(session);
        if (parent == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDUser child = resolveParentChild(parent, studentId);
        if (child == null) {
            return "redirect:/aptipath/parent/home";
        }

        RDCISubscription subscription = ciSubscriptionService.getById(subscriptionId);
        if (!isActiveAptiPathSubscription(subscription)
                || subscription.getStudentUser() == null
                || !Objects.equals(child.getUserID(), subscription.getStudentUser().getUserID())) {
            return "redirect:/aptipath/parent/home";
        }

        if (!isValidStudentProfileForm(formData)) {
            StringBuilder redirect = new StringBuilder("redirect:/aptipath/parent/student-profile?validationError=1&studentId=")
                    .append(child.getUserID());
            if (embed != null && embed == 1) {
                redirect.append("&embed=1");
            }
            if (companyCode != null && !companyCode.trim().isEmpty()) {
                redirect.append("&company=").append(companyCode.trim());
            }
            return redirect.toString();
        }

        Map<String, String> existingAnswers = loadStudentProfileAnswers(subscriptionId);
        String previousGrade = normalizeGradeCode(existingAnswers.get(STUDENT_INTAKE_GRADE_CODE));
        String currentGrade = normalizeGradeCode(formData.get(STUDENT_INTAKE_GRADE_CODE));

        saveStudentIntakeResponse(subscriptionId, child.getUserID(), STUDENT_INTAKE_SCHOOL_CODE, formData.get(STUDENT_INTAKE_SCHOOL_CODE));
        saveStudentIntakeResponse(subscriptionId, child.getUserID(), STUDENT_INTAKE_GRADE_CODE, formData.get(STUDENT_INTAKE_GRADE_CODE));
        saveStudentIntakeResponse(subscriptionId, child.getUserID(), STUDENT_INTAKE_BOARD_CODE, formData.get(STUDENT_INTAKE_BOARD_CODE));
        saveStudentIntakeResponse(subscriptionId, child.getUserID(), STUDENT_INTAKE_STREAM_CODE, formData.get(STUDENT_INTAKE_STREAM_CODE));
        saveStudentIntakeResponse(subscriptionId, child.getUserID(), STUDENT_INTAKE_SUBJECTS_CODE, formData.get(STUDENT_INTAKE_SUBJECTS_CODE));
        saveStudentIntakeResponse(subscriptionId, child.getUserID(), STUDENT_INTAKE_PROGRAM_CODE, formData.get(STUDENT_INTAKE_PROGRAM_CODE));
        saveStudentIntakeResponse(subscriptionId, child.getUserID(), STUDENT_INTAKE_YEARS_LEFT_CODE, formData.get(STUDENT_INTAKE_YEARS_LEFT_CODE));

        syncChildCoreProfile(child, formData);
        boolean gradeChanged = !currentGrade.isEmpty() && !currentGrade.equals(previousGrade);
        if (gradeChanged) {
            closeLiveSessionForStudent(subscription, child.getUserID());
        }

        StringBuilder target = new StringBuilder("/aptipath/parent/home?studentProfileSaved=1");
        if (gradeChanged) {
            target.append("&gradeChanged=1");
        }
        if (embed != null && embed == 1) {
            target.append("&embed=1");
        }
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            target.append("&company=").append(companyCode.trim());
        }
        return "redirect:" + target;
    }

    private boolean isNewer(RDCISubscription left, RDCISubscription right) {
        if (left.getCreatedAt() == null) {
            return false;
        }
        if (right.getCreatedAt() == null) {
            return true;
        }
        return left.getCreatedAt().isAfter(right.getCreatedAt());
    }

    private String resolveCompanyCode(String companyCode, HttpSession session) {
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            return companyCode.trim();
        }
        Object raw = session.getAttribute("tenantCompanyCode");
        if (raw instanceof String && !((String) raw).trim().isEmpty()) {
            return ((String) raw).trim();
        }
        return "ROBODYNAMICS";
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }

    private RDUser requireParentUser(HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return null;
        }
        RDUser parent = (RDUser) rawUser;
        if (parent.getProfile_id() != RDUser.profileType.ROBO_PARENT.getValue()) {
            return null;
        }
        return parent;
    }

    private RDUser resolveParentChild(RDUser parent, Integer studentId) {
        if (parent == null || parent.getUserID() == null || studentId == null) {
            return null;
        }
        List<RDUser> children = userService.getRDChilds(parent.getUserID());
        if (children == null) {
            return null;
        }
        return children.stream()
                .filter(Objects::nonNull)
                .filter(child -> studentId.equals(child.getUserID()))
                .findFirst()
                .orElse(null);
    }

    private boolean isActiveAptiPathSubscription(RDCISubscription subscription) {
        return subscription != null
                && "APTIPATH".equalsIgnoreCase(nz(subscription.getModuleCode()))
                && "ACTIVE".equalsIgnoreCase(nz(subscription.getStatus()));
    }

    private void saveParentIntakeResponse(Long subscriptionId,
                                          Integer parentUserId,
                                          Integer studentUserId,
                                          String questionCode,
                                          String answerValue) {
        ciIntakeService.saveResponse(
                subscriptionId,
                parentUserId,
                studentUserId,
                "PARENT",
                "GOALS",
                questionCode,
                answerValue,
                null);
    }

    private void saveStudentIntakeResponse(Long subscriptionId,
                                           Integer studentUserId,
                                           String questionCode,
                                           String answerValue) {
        ciIntakeService.saveResponse(
                subscriptionId,
                null,
                studentUserId,
                "STUDENT",
                STUDENT_INTAKE_SECTION_PROFILE,
                questionCode,
                answerValue,
                null);
    }

    private Map<String, String> loadStudentProfileAnswers(Long subscriptionId) {
        if (subscriptionId == null) {
            return new LinkedHashMap<>();
        }
        List<RDCIIntakeResponse> rows = ciIntakeService.getBySubscriptionId(subscriptionId);
        if (rows == null || rows.isEmpty()) {
            return new LinkedHashMap<>();
        }
        return rows.stream()
                .filter(Objects::nonNull)
                .filter(row -> "STUDENT".equalsIgnoreCase(nz(row.getRespondentType())))
                .filter(row -> STUDENT_INTAKE_SECTION_PROFILE.equalsIgnoreCase(nz(row.getSectionCode())))
                .filter(row -> row.getQuestionCode() != null)
                .collect(Collectors.toMap(
                        row -> row.getQuestionCode().trim().toUpperCase(Locale.ENGLISH),
                        row -> nz(row.getAnswerValue()),
                        (left, right) -> right,
                        LinkedHashMap::new));
    }

    private boolean isValidStudentProfileForm(Map<String, String> formData) {
        if (formData == null) {
            return false;
        }
        String school = trimToNull(formData.get(STUDENT_INTAKE_SCHOOL_CODE));
        String grade = normalizeGradeCode(formData.get(STUDENT_INTAKE_GRADE_CODE));
        String board = trimToNull(formData.get(STUDENT_INTAKE_BOARD_CODE));
        if (school == null || grade.isEmpty() || board == null) {
            return false;
        }
        boolean senior = "11".equals(grade) || "12".equals(grade);
        boolean post12 = isPost12Grade(grade);
        String stream = trimToNull(formData.get(STUDENT_INTAKE_STREAM_CODE));
        if ((senior || post12) && stream == null) {
            return false;
        }
        if (senior && trimToNull(formData.get(STUDENT_INTAKE_SUBJECTS_CODE)) == null) {
            return false;
        }
        if (post12) {
            if (trimToNull(formData.get(STUDENT_INTAKE_PROGRAM_CODE)) == null) {
                return false;
            }
            if (trimToNull(formData.get(STUDENT_INTAKE_YEARS_LEFT_CODE)) == null) {
                return false;
            }
        }
        return true;
    }

    private boolean isPost12Grade(String gradeCode) {
        switch (nz(gradeCode).trim().toUpperCase(Locale.ENGLISH)) {
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

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String cleaned = value.trim();
        return cleaned.isEmpty() ? null : cleaned;
    }

    private String normalizeGradeCode(String gradeCode) {
        String cleaned = trimToNull(gradeCode);
        return cleaned == null ? "" : cleaned.toUpperCase(Locale.ENGLISH);
    }

    private void syncChildCoreProfile(RDUser child, Map<String, String> formData) {
        if (child == null || formData == null) {
            return;
        }
        String grade = trimToNull(formData.get(STUDENT_INTAKE_GRADE_CODE));
        String school = trimToNull(formData.get(STUDENT_INTAKE_SCHOOL_CODE));
        String existingGrade = trimToNull(child.getGrade());
        String existingSchool = trimToNull(child.getSchoolName());
        if (Objects.equals(existingGrade, grade) && Objects.equals(existingSchool, school)) {
            return;
        }
        child.setGrade(grade);
        child.setSchoolName(school);
        userService.save(child);
    }

    private void closeLiveSessionForStudent(RDCISubscription subscription, Integer studentUserId) {
        if (subscription == null || subscription.getCiSubscriptionId() == null || studentUserId == null) {
            return;
        }
        RDCIAssessmentSession latest = ciAssessmentSessionService.getLatestByStudentUserId(studentUserId);
        if (latest == null || latest.getCiAssessmentSessionId() == null) {
            return;
        }
        if (latest.getSubscription() == null || latest.getSubscription().getCiSubscriptionId() == null) {
            return;
        }
        if (!Objects.equals(subscription.getCiSubscriptionId(), latest.getSubscription().getCiSubscriptionId())) {
            return;
        }
        if ("COMPLETED".equalsIgnoreCase(nz(latest.getStatus()))) {
            return;
        }
        ciAssessmentSessionService.completeSession(latest.getCiAssessmentSessionId(), 0);
    }

    private boolean hasRequiredParentIntake(List<RDCIIntakeResponse> rows) {
        if (rows == null || rows.isEmpty()) {
            return false;
        }
        Set<String> answeredCodes = rows.stream()
                .filter(Objects::nonNull)
                .filter(row -> "PARENT".equalsIgnoreCase(nz(row.getRespondentType())))
                .filter(row -> row.getQuestionCode() != null && !row.getQuestionCode().trim().isEmpty())
                .filter(row -> row.getAnswerValue() != null && !row.getAnswerValue().trim().isEmpty())
                .map(row -> row.getQuestionCode().trim().toUpperCase())
                .collect(Collectors.toSet());
        return answeredCodes.containsAll(REQUIRED_PARENT_INTAKE_CODES);
    }
}
