package com.robodynamics.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
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
