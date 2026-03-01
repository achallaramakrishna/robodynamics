package com.robodynamics.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDCIAssessmentResponse;
import com.robodynamics.model.RDCIAssessmentSession;
import com.robodynamics.model.RDCICareerAdjustment;
import com.robodynamics.model.RDCICareerCatalog;
import com.robodynamics.model.RDCIIntakeResponse;
import com.robodynamics.model.RDCIQuestionBank;
import com.robodynamics.model.RDCIRecommendationSnapshot;
import com.robodynamics.model.RDCIScoreIndex;
import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDCompanyBranding;
import com.robodynamics.model.RDUser;
import com.robodynamics.pdf.HtmlToPdf;
import com.robodynamics.pdf.JspCapture;
import com.robodynamics.service.RDCompanyContextService;
import com.robodynamics.service.RDCIAssessmentResponseService;
import com.robodynamics.service.RDCIAssessmentResponseService.SessionScoreSummary;
import com.robodynamics.service.RDCIAssessmentSessionService;
import com.robodynamics.service.RDCICareerMappingService;
import com.robodynamics.service.RDCIIntakeService;
import com.robodynamics.service.RDCIQuestionBankService;
import com.robodynamics.service.RDCIRecommendationService;
import com.robodynamics.service.RDCIScoreIndexService;
import com.robodynamics.service.RDCISubscriptionService;
import com.robodynamics.service.RDAptiPathReportEnrichmentService;
import com.robodynamics.util.RDRoleRouteUtil;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/aptipath/student")
public class RDAptiPathStudentController {

    private static final String ASSESSMENT_VERSION = "v3";
    private static final String DEFAULT_STUDENT_ONBOARDING_VIDEO_URL =
            "/assets/videos/aptipath-student-onboarding.html";
    private static final String STUDENT_INTAKE_SECTION_PROFILE = "PROFILE";
    private static final String STUDENT_INTAKE_SECTION_THINKING = "THINKING_COMPOSITION";
    private static final String STUDENT_INTAKE_SECTION_REPORT_ENRICHMENT = "REPORT_ENRICHMENT";
    private static final String STUDENT_INTAKE_SCHOOL_CODE = "S_CURR_SCHOOL_01";
    private static final String STUDENT_INTAKE_GRADE_CODE = "S_CURR_GRADE_01";
    private static final String STUDENT_INTAKE_BOARD_CODE = "S_CURR_BOARD_01";
    private static final String STUDENT_INTAKE_STREAM_CODE = "S_CURR_STREAM_01";
    private static final String STUDENT_INTAKE_SUBJECTS_CODE = "S_CURR_SUBJECTS_01";
    private static final String STUDENT_INTAKE_PROGRAM_CODE = "S_CURR_PROGRAM_01";
    private static final String STUDENT_INTAKE_YEARS_LEFT_CODE = "S_CURR_YEARS_LEFT_01";
    private static final List<String> REPORT_ENRICHMENT_CODES = List.of("RFQ_01", "RFQ_02", "RFQ_03");
    private static final Set<String> REQUIRED_STUDENT_INTAKE_CODES = Set.of(
            STUDENT_INTAKE_SCHOOL_CODE,
            STUDENT_INTAKE_GRADE_CODE,
            STUDENT_INTAKE_BOARD_CODE,
            "S_GOAL_01",
            "S_LIFE_01",
            "S_HOBBY_01",
            "S_DISLIKE_01",
            "S_STYLE_01",
            "S_ACHIEVE_01",
            "S_FEAR_01",
            "S_SUPPORT_01");

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${aptipath.onboarding.studentVideoUrl:" + DEFAULT_STUDENT_ONBOARDING_VIDEO_URL + "}")
    private String onboardingStudentVideoUrl;

    @Value("${aptipath.release.mode:beta}")
    private String aptiPathReleaseMode;

    @Value("${aptipath.report.prefinal.enabled:false}")
    private boolean aptiPathPrefinalEnabled;

    @Autowired
    private RDCISubscriptionService ciSubscriptionService;

    @Autowired
    private RDCIAssessmentSessionService ciAssessmentSessionService;

    @Autowired
    private RDCompanyContextService companyContextService;

    @Autowired
    private RDCIQuestionBankService ciQuestionBankService;

    @Autowired
    private RDCIAssessmentResponseService ciAssessmentResponseService;

    @Autowired
    private RDCIRecommendationService ciRecommendationService;

    @Autowired
    private RDCIIntakeService ciIntakeService;

    @Autowired
    private RDCIScoreIndexService ciScoreIndexService;

    @Autowired
    private RDCICareerMappingService ciCareerMappingService;

    @Autowired(required = false)
    private RDAptiPathReportEnrichmentService aptiPathReportEnrichmentService;

    @GetMapping("/home")
    public String home(@RequestParam(value = "embed", defaultValue = "0") Integer embed,
                       @RequestParam(value = "company", required = false) String companyCode,
                       Model model,
                       HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/student/home";
        }

        RDUser student = (RDUser) rawUser;
        if (student.getProfile_id() != RDUser.profileType.ROBO_STUDENT.getValue()) {
            return RDRoleRouteUtil.redirectHomeFor(student);
        }

        RDCISubscription subscription = resolveLatestAptiPathSubscription(student.getUserID());
        RDCIAssessmentSession latestSession = ciAssessmentSessionService.getLatestByStudentUserId(student.getUserID());
        RDCIAssessmentSession latestCompletedSession = resolveCompletedSessionForStudent(student, null);
        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        boolean embedMode = embed != null && embed == 1;
        boolean paymentEnabled = isLiveReleaseMode();
        boolean hasAccess = hasAptiPathAccess(subscription) || !paymentEnabled;
        boolean profileIntakeCompleted = hasRequiredStudentProfileIntake(subscription);
        boolean canStartTest = hasAccess && profileIntakeCompleted;

        String registrationRedirect = "/plans/checkout?plan=career-basic";
        String registrationUrl = "/registerParentChild?plan=career-basic&redirect=" + urlEncode(registrationRedirect);
        String intakeUrl = "/aptipath/student/intake";
        if (embedMode) {
            registrationRedirect = "/aptipath/student/home?embed=1&company=" + urlEncode(resolvedCompanyCode);
            registrationUrl = "/registerParentChild?plan=career-basic&redirect=" + urlEncode(registrationRedirect);
            intakeUrl = "/aptipath/student/intake?embed=1&company=" + urlEncode(resolvedCompanyCode);
        } else if (!resolvedCompanyCode.equals("ROBODYNAMICS")) {
            intakeUrl = "/aptipath/student/intake?company=" + urlEncode(resolvedCompanyCode);
        }

        model.addAttribute("student", student);
        model.addAttribute("subscription", subscription);
        model.addAttribute("paymentEnabled", paymentEnabled);
        model.addAttribute("releaseMode", normalizedReleaseMode());
        model.addAttribute("hasAptiPathAccess", hasAccess);
        model.addAttribute("profileIntakeCompleted", profileIntakeCompleted);
        model.addAttribute("canStartTest", canStartTest);
        model.addAttribute("registrationUrl", registrationUrl);
        model.addAttribute("intakeUrl", intakeUrl);
        model.addAttribute("latestSession", latestSession);
        model.addAttribute("latestCompletedSession", latestCompletedSession);
        model.addAttribute("embedMode", embedMode);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        model.addAttribute("onboardingVideoUrl", nz(onboardingStudentVideoUrl));
        return "student/aptipath-home";
    }

    @GetMapping("/intake")
    public String intake(@RequestParam(value = "embed", defaultValue = "0") Integer embed,
                         @RequestParam(value = "company", required = false) String companyCode,
                         @RequestParam(value = "intakeRequired", required = false) Integer intakeRequired,
                         Model model,
                         HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/student/intake";
        }

        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDCISubscription subscription = resolveOrCreateAccessibleSubscription(student);
        if (!hasAptiPathAccess(subscription)) {
            return "redirect:/aptipath/student/home?subscriptionRequired=1";
        }

        Map<String, String> answers = loadStudentProfileIntakeAnswers(subscription);
        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        boolean embedMode = embed != null && embed == 1;

        model.addAttribute("student", student);
        model.addAttribute("subscription", subscription);
        model.addAttribute("answers", answers);
        model.addAttribute("paymentEnabled", isLiveReleaseMode());
        model.addAttribute("releaseMode", normalizedReleaseMode());
        model.addAttribute("intakeRequired", intakeRequired != null && intakeRequired == 1);
        model.addAttribute("embedMode", embedMode);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        return "student/aptipath-intake";
    }

    @PostMapping("/intake")
    public String saveIntake(@RequestParam("subscriptionId") Long subscriptionId,
                             @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                             @RequestParam(value = "company", required = false) String companyCode,
                             @RequestParam Map<String, String> formData,
                             HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login";
        }

        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDCISubscription subscription = resolveOrCreateAccessibleSubscription(student);
        if (!hasAptiPathAccess(subscription)
                || subscription == null
                || !subscription.getCiSubscriptionId().equals(subscriptionId)) {
            return "redirect:/aptipath/student/home?subscriptionRequired=1";
        }

        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_GOAL_01", formData.get("S_GOAL_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_LIFE_01", formData.get("S_LIFE_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), STUDENT_INTAKE_SCHOOL_CODE, formData.get(STUDENT_INTAKE_SCHOOL_CODE));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), STUDENT_INTAKE_GRADE_CODE, formData.get(STUDENT_INTAKE_GRADE_CODE));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), STUDENT_INTAKE_BOARD_CODE, formData.get(STUDENT_INTAKE_BOARD_CODE));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), STUDENT_INTAKE_STREAM_CODE, formData.get(STUDENT_INTAKE_STREAM_CODE));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), STUDENT_INTAKE_SUBJECTS_CODE, formData.get(STUDENT_INTAKE_SUBJECTS_CODE));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), STUDENT_INTAKE_PROGRAM_CODE, formData.get(STUDENT_INTAKE_PROGRAM_CODE));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), STUDENT_INTAKE_YEARS_LEFT_CODE, formData.get(STUDENT_INTAKE_YEARS_LEFT_CODE));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_HOBBY_01", formData.get("S_HOBBY_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_DISLIKE_01", formData.get("S_DISLIKE_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_STYLE_01", formData.get("S_STYLE_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_MOTIVE_01", formData.get("S_MOTIVE_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_ROLE_01", formData.get("S_ROLE_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_ACHIEVE_01", formData.get("S_ACHIEVE_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_ACCOLADE_01", formData.get("S_ACCOLADE_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_FEAR_01", formData.get("S_FEAR_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_STRESS_01", formData.get("S_STRESS_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_SUPPORT_01", formData.get("S_SUPPORT_01"));
        saveStudentIntakeResponse(subscriptionId, student.getUserID(), "S_PARENT_01", formData.get("S_PARENT_01"));

        StringBuilder target = new StringBuilder("redirect:/aptipath/student/home?intakeSaved=1");
        if (embed != null && embed == 1) {
            target.append("&embed=1");
        }
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            target.append("&company=").append(urlEncode(companyCode.trim()));
        }
        return target.toString();
    }

    @GetMapping("/report-intake")
    public String reportIntake(@RequestParam("sessionId") Long sessionId,
                               @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                               @RequestParam(value = "company", required = false) String companyCode,
                               @RequestParam(value = "required", required = false) Integer required,
                               @RequestParam(value = "validationError", required = false) Integer validationError,
                               Model model,
                               HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/student/report-intake";
        }
        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }
        if (!aptiPathPrefinalEnabled) {
            return resultRedirect(sessionId, embed, companyCode);
        }

        RDCIAssessmentSession sessionRow = resolveCompletedSessionForStudent(student, sessionId);
        if (sessionRow == null) {
            return "redirect:/aptipath/student/home?resultUnavailable=1";
        }

        RDCISubscription subscription = sessionRow.getSubscription();
        boolean completed = hasRequiredReportEnrichment(subscription);
        if (completed && (required == null || required != 1)) {
            return resultRedirect(sessionId, embed, companyCode);
        }

        RDCIRecommendationSnapshot recommendation = ciRecommendationService
                .getLatestByAssessmentSessionId(sessionRow.getCiAssessmentSessionId());
        Map<String, Object> diagnosticPayload = parseJsonObject(
                recommendation == null ? null : recommendation.getCareerClustersJson());
        List<String> followUpQuestions = resolveReportFollowUpQuestions(diagnosticPayload);
        Map<String, String> savedAnswers = loadStudentIntakeAnswers(subscription, STUDENT_INTAKE_SECTION_REPORT_ENRICHMENT);
        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        boolean embedMode = embed != null && embed == 1;

        model.addAttribute("student", student);
        model.addAttribute("sessionRow", sessionRow);
        model.addAttribute("followUpQuestions", followUpQuestions);
        model.addAttribute("savedAnswers", savedAnswers);
        model.addAttribute("validationError", validationError != null && validationError == 1);
        model.addAttribute("requiredPrompt", required != null && required == 1);
        model.addAttribute("embedMode", embedMode);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        return "student/aptipath-report-intake";
    }

    @PostMapping("/report-intake")
    public String saveReportIntake(@RequestParam("sessionId") Long sessionId,
                                   @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                                   @RequestParam(value = "company", required = false) String companyCode,
                                   @RequestParam Map<String, String> formData,
                                   HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login";
        }
        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }
        if (!aptiPathPrefinalEnabled) {
            return resultRedirect(sessionId, embed, companyCode);
        }

        RDCIAssessmentSession sessionRow = resolveCompletedSessionForStudent(student, sessionId);
        if (sessionRow == null || sessionRow.getSubscription() == null || sessionRow.getSubscription().getCiSubscriptionId() == null) {
            return "redirect:/aptipath/student/home?resultUnavailable=1";
        }

        RDCIRecommendationSnapshot recommendation = ciRecommendationService
                .getLatestByAssessmentSessionId(sessionRow.getCiAssessmentSessionId());
        Map<String, Object> diagnosticPayload = parseJsonObject(
                recommendation == null ? null : recommendation.getCareerClustersJson());
        List<String> followUpQuestions = resolveReportFollowUpQuestions(diagnosticPayload);

        Map<String, String> followUpAnswers = new LinkedHashMap<>();
        for (int i = 0; i < REPORT_ENRICHMENT_CODES.size(); i++) {
            String code = REPORT_ENRICHMENT_CODES.get(i);
            String answer = trimToNull(formData.get(code));
            if (answer == null || answer.length() < 20) {
                StringBuilder redirect = new StringBuilder(reportIntakeRedirect(sessionId, embed, companyCode, true));
                redirect.append("&validationError=1");
                return redirect.toString();
            }
            saveStudentIntakeResponse(
                    sessionRow.getSubscription().getCiSubscriptionId(),
                    student.getUserID(),
                    STUDENT_INTAKE_SECTION_REPORT_ENRICHMENT,
                    code,
                    answer);
            followUpAnswers.put(code, answer);
            if (i < followUpQuestions.size()) {
                saveStudentIntakeResponse(
                        sessionRow.getSubscription().getCiSubscriptionId(),
                        student.getUserID(),
                        STUDENT_INTAKE_SECTION_REPORT_ENRICHMENT,
                        code + "_PROMPT",
                        followUpQuestions.get(i));
            }
        }

        applyPrefinalAiEnrichment(sessionRow, student, recommendation, diagnosticPayload, followUpQuestions, followUpAnswers);
        StringBuilder redirect = new StringBuilder(resultRedirect(sessionId, embed, companyCode));
        redirect.append(redirect.indexOf("?") >= 0 ? "&" : "?").append("finalInputSaved=1");
        return redirect.toString();
    }

    @GetMapping("/result")
    public String result(@RequestParam(value = "sessionId", required = false) Long sessionId,
                         @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                         @RequestParam(value = "company", required = false) String companyCode,
                         Model model,
                         HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/student/result";
        }

        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDCIAssessmentSession sessionRow = resolveCompletedSessionForStudent(student, sessionId);
        if (sessionRow == null) {
            return "redirect:/aptipath/student/home?resultUnavailable=1";
        }
        if (aptiPathPrefinalEnabled && !hasRequiredReportEnrichment(sessionRow.getSubscription())) {
            return reportIntakeRedirect(sessionRow.getCiAssessmentSessionId(), embed, companyCode, true);
        }

        List<RDCIAssessmentResponse> responses = ciAssessmentResponseService
                .getBySessionId(sessionRow.getCiAssessmentSessionId());
        Map<String, String> persistedFormData = toPersistedFormData(responses);
        String questionOrderCsv = responses.stream()
                .filter(r -> r != null && r.getQuestionCode() != null && !r.getQuestionCode().trim().isEmpty())
                .map(r -> r.getQuestionCode().trim())
                .collect(Collectors.joining(","));

        String version = nz(sessionRow.getAssessmentVersion()).isEmpty()
                ? ASSESSMENT_VERSION
                : nz(sessionRow.getAssessmentVersion());
        List<RDCIQuestionBank> allQuestions = ciQuestionBankService.getOrSeedActiveQuestions("APTIPATH", version);
        List<RDCIQuestionBank> servedQuestions = resolveServedQuestions(allQuestions, questionOrderCsv);

        SessionScoreSummary scoreSummary = ciAssessmentResponseService
                .getSessionScoreSummary(sessionRow.getCiAssessmentSessionId());
        scoreSummary = normalizeAdaptiveScoreSummary(scoreSummary, servedQuestions, persistedFormData);
        double assessedAccuracyPercent = scoreSummary == null ? 0.0 : clamp(scoreSummary.getScorePercent(), 0.0, 100.0);
        Map<String, Double> sectionScores = computeSectionScores(servedQuestions, persistedFormData);
        List<Map<String, Object>> scoreDriverQuestions = buildScoreDriverQuestions(servedQuestions, persistedFormData, 20);
        List<RDCIIntakeResponse> intakeRows = List.of();
        if (sessionRow.getSubscription() != null && sessionRow.getSubscription().getCiSubscriptionId() != null) {
            intakeRows = ciIntakeService.getBySubscriptionId(sessionRow.getSubscription().getCiSubscriptionId());
        }
        Map<String, String> thinkingCompositionAnswers = extractStudentThinkingCompositionAnswers(intakeRows);
        List<String> thinkingCompositionInsights = buildThinkingCompositionInsights(thinkingCompositionAnswers);
        List<Map<String, String>> thinkingCompositionSnapshots = buildThinkingCompositionSnapshots(thinkingCompositionAnswers);

        RDCIScoreIndex scoreIndex = ciScoreIndexService.getByAssessmentSessionId(sessionRow.getCiAssessmentSessionId());
        RDCIRecommendationSnapshot recommendation = ciRecommendationService
                .getLatestByAssessmentSessionId(sessionRow.getCiAssessmentSessionId());

        Map<String, Object> diagnosticPayload = parseJsonObject(
                recommendation == null ? null : recommendation.getCareerClustersJson());
        Map<String, Double> streamFitPayload = parseDoubleMap(parseJsonObject(
                recommendation == null ? null : recommendation.getStreamFitJson()));
        Map<String, Double> streamFitIndices = parseDoubleMap(diagnosticPayload.get("streamFitIndices"));
        if (streamFitIndices.isEmpty()) {
            streamFitIndices = buildStreamFitIndices(streamFitPayload, scoreIndex);
        }
        streamFitIndices = calibrateFitMap(streamFitIndices, assessedAccuracyPercent);

        double iitFitIndex = streamFitIndices.getOrDefault("IIT", 0.0);
        double neetFitIndex = streamFitIndices.getOrDefault("NEET", 0.0);
        double catFitIndex = streamFitIndices.getOrDefault("CAT", 0.0);
        double lawFitIndex = streamFitIndices.getOrDefault("LAW", 0.0);

        Map<String, Integer> subjectAffinitySignals = parseIntMap(diagnosticPayload.get("subjectAffinitySignals"));
        if (subjectAffinitySignals.isEmpty()) {
            subjectAffinitySignals = defaultSubjectSignals();
        }
        Map<String, Integer> studentSelfSignals = parseIntMap(diagnosticPayload.get("studentSelfSignals"));
        if (studentSelfSignals.isEmpty()) {
            studentSelfSignals = defaultStudentSelfSignals();
        }

        List<String> selectedCareerIntents = parseStringList(diagnosticPayload.get("selectedCareerIntents"));
        List<String> selfSignalInsights = parseStringList(diagnosticPayload.get("selfSignalInsights"));
        if (selfSignalInsights.isEmpty()) {
            selfSignalInsights = List.of("No self-signal adjustments captured; scoring used assessment responses and baseline indices.");
        }
        List<String> subjectAffinityInsights = parseStringList(diagnosticPayload.get("subjectAffinityInsights"));
        if (subjectAffinityInsights.isEmpty()) {
            subjectAffinityInsights = buildSubjectAffinityInsights(subjectAffinitySignals, List.of());
        }

        Map<String, Double> streamCompetencyFits = parseDoubleMap(diagnosticPayload.get("streamCompetencyFits"));
        if (streamCompetencyFits.isEmpty()) {
            streamCompetencyFits = inferStreamCompetencyFits(scoreIndex, sectionScores);
        }
        streamCompetencyFits = calibrateFitMap(streamCompetencyFits, assessedAccuracyPercent);
        Map<String, Double> emergingClusterFits = parseDoubleMap(diagnosticPayload.get("emergingClusterFits"));
        if (emergingClusterFits.isEmpty()) {
            emergingClusterFits = inferEmergingClusterFits(streamFitPayload);
        }
        emergingClusterFits = calibrateFitMap(emergingClusterFits, assessedAccuracyPercent);
        List<Map<String, Object>> topCareerMatches = calibrateTopCareerMatches(
                parseMapList(diagnosticPayload.get("topCareerMatches")),
                assessedAccuracyPercent);

        double overallFitScore = metricValue(scoreIndex == null ? null : scoreIndex.getOverallFitScore(), assessedAccuracyPercent);
        int careerScore = computeCareerHealthScore(assessedAccuracyPercent, overallFitScore);
        String careerScoreBand = resolveCareerScoreBand(careerScore);
        int careerUniverseCount = parseIntValue(diagnosticPayload.get("careerUniverseCount"), topCareerMatches.size());
        String careerSummaryLine = parseStringValue(diagnosticPayload.get("careerSummaryLine"));
        if (careerSummaryLine.isEmpty() && recommendation != null) {
            careerSummaryLine = nz(recommendation.getSummaryText());
        }

        double examReadiness = metricValue(scoreIndex == null ? null : scoreIndex.getExamReadinessIndex(), 55.0);
        double aiReadiness = metricValue(scoreIndex == null ? null : scoreIndex.getAiReadinessIndex(), 55.0);
        double alignment = metricValue(scoreIndex == null ? null : scoreIndex.getAlignmentIndex(), 55.0);
        double wellbeingRisk = metricValue(scoreIndex == null ? null : scoreIndex.getWellbeingRiskIndex(), 45.0);
        double mentalPreparednessIndex = calibrateFitIndex(parseDoubleValue(
                diagnosticPayload.get("mentalPreparednessIndex"),
                estimateMentalPreparedness(examReadiness, alignment, wellbeingRisk)), assessedAccuracyPercent);

        List<String> encouragementHighlights = parseStringList(diagnosticPayload.get("encouragementHighlights"));
        if (encouragementHighlights.isEmpty()) {
            encouragementHighlights = buildEncouragementHighlights(
                    assessedAccuracyPercent,
                    mentalPreparednessIndex,
                    aiReadiness,
                    examReadiness,
                    wellbeingRisk,
                    emergingClusterFits);
        }
        List<String> encouragementActions = parseStringList(diagnosticPayload.get("encouragementActions"));
        if (encouragementActions.isEmpty()) {
            encouragementActions = buildEncouragementActions(
                    examReadiness,
                    aiReadiness,
                    wellbeingRisk,
                    alignment,
                    emergingClusterFits);
        }
        String aiStudentNarrative = parseStringValue(diagnosticPayload.get("aiStudentNarrative"));
        List<String> aiParentGuidance = parseStringList(diagnosticPayload.get("aiParentGuidance"));
        List<String> aiFollowUpQuestions = parseStringList(diagnosticPayload.get("aiFollowUpQuestions"));
        boolean aiEnrichmentApplied = parseBooleanValue(diagnosticPayload.get("aiEnrichmentApplied"), false);
        String aiEnrichmentStatus = parseStringValue(diagnosticPayload.get("aiEnrichmentStatus"));
        String recommendationSummaryText = buildRecommendationSummary(scoreSummary)
                + " Career health score "
                + careerScore
                + " ("
                + careerScoreBand
                + "). "
                + (careerSummaryLine == null ? "" : careerSummaryLine).trim();
        List<String> scoringMethodNotes = buildScoringMethodNotes(scoreSummary, overallFitScore);

        RDCIRecommendationSnapshot effectiveRecommendation = recommendation == null
                ? buildFallbackRecommendation(scoreSummary, careerScore, careerScoreBand, careerSummaryLine)
                : recommendation;

        RDCISubscription subscription = ciSubscriptionService.getLatestByStudentUserId(student.getUserID());
        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        boolean embedMode = embed != null && embed == 1;

        // --- Grade-aware planning data (needed for 10-year roadmap) ---
        Map<String, String> academicProfile = subscription != null
                ? extractAcademicProfileFromAnswers(loadStudentProfileIntakeAnswers(subscription))
                : new LinkedHashMap<>();
        String planningMode = resolvePlanningModeFromAcademicProfile(academicProfile);
        String planningWindow = resolvePlanningWindowFromAcademicProfile(academicProfile);

        model.addAttribute("student", student);
        model.addAttribute("subscription", subscription);
        model.addAttribute("sessionRow", sessionRow);
        model.addAttribute("scoreSummary", scoreSummary);
        model.addAttribute("assessedAccuracyPercent", round1(assessedAccuracyPercent));
        model.addAttribute("overallReadinessScore", round1(overallFitScore));
        model.addAttribute("scoreIndex", scoreIndex);
        model.addAttribute("mentalPreparednessIndex", round1(mentalPreparednessIndex));
        model.addAttribute("iitFitIndex", round1(iitFitIndex));
        model.addAttribute("neetFitIndex", round1(neetFitIndex));
        model.addAttribute("catFitIndex", round1(catFitIndex));
        model.addAttribute("lawFitIndex", round1(lawFitIndex));
        model.addAttribute("emergingClusterFits", emergingClusterFits);
        model.addAttribute("careerScore", careerScore);
        model.addAttribute("careerScoreBand", careerScoreBand);
        model.addAttribute("careerUniverseCount", careerUniverseCount);
        model.addAttribute("topCareerMatches", topCareerMatches);
        model.addAttribute("careerSummaryLine", careerSummaryLine);
        model.addAttribute("selectedCareerIntents", selectedCareerIntents);
        model.addAttribute("studentSelfSignals", studentSelfSignals);
        model.addAttribute("selfSignalInsights", selfSignalInsights);
        model.addAttribute("subjectAffinitySignals", subjectAffinitySignals);
        model.addAttribute("subjectAffinityInsights", subjectAffinityInsights);
        model.addAttribute("streamCompetencyFits", streamCompetencyFits);
        model.addAttribute("sectionScores", sectionScores);
        model.addAttribute("streamFitIndices", streamFitIndices);
        model.addAttribute("sectionScoreDisplayMap", toSectionScoreDisplayMap(sectionScores));
        model.addAttribute("subjectSignalDisplayMap", toSubjectSignalDisplayMap(subjectAffinitySignals));
        model.addAttribute("streamFitIndicesJson", toJson(streamFitIndices, "{}"));
        model.addAttribute("sectionScoresJson", toJson(sectionScores, "{}"));
        model.addAttribute("streamCompetencyJson", toJson(streamCompetencyFits, "{}"));
        model.addAttribute("subjectSignalsJson", toJson(subjectAffinitySignals, "{}"));
        model.addAttribute("encouragementHighlights", encouragementHighlights);
        model.addAttribute("encouragementActions", encouragementActions);
        model.addAttribute("scoreDriverQuestions", scoreDriverQuestions);
        model.addAttribute("thinkingCompositionInsights", thinkingCompositionInsights);
        model.addAttribute("thinkingCompositionSnapshots", thinkingCompositionSnapshots);
        model.addAttribute("scoringMethodNotes", scoringMethodNotes);
        model.addAttribute("recommendationSummaryText", recommendationSummaryText);
        model.addAttribute("academicProfile", academicProfile);
        model.addAttribute("planningMode", planningMode);
        model.addAttribute("planningWindow", planningWindow);
        model.addAttribute("aiStudentNarrative", aiStudentNarrative);
        model.addAttribute("aiParentGuidance", aiParentGuidance);
        model.addAttribute("aiFollowUpQuestions", aiFollowUpQuestions);
        model.addAttribute("aiEnrichmentApplied", aiEnrichmentApplied);
        model.addAttribute("aiEnrichmentStatus", aiEnrichmentStatus);
        model.addAttribute("recommendation", effectiveRecommendation);
        model.addAttribute("planAText", planSummaryText(
                effectiveRecommendation.getPlanAJson(),
                "Primary path: start a structured 90-day roadmap."));
        model.addAttribute("planBText", planSummaryText(
                effectiveRecommendation.getPlanBJson(),
                "Adjacent path: build parallel exposure through guided projects."));
        model.addAttribute("planCText", planSummaryText(
                effectiveRecommendation.getPlanCJson(),
                "Exploratory path: run low-risk discovery sprints before lock-in."));
        model.addAttribute("planACareer", topCareerMatches.size() > 0 ? topCareerMatches.get(0) : null);
        model.addAttribute("planBCareer", topCareerMatches.size() > 1 ? topCareerMatches.get(1) : null);
        model.addAttribute("planCCareer", topCareerMatches.size() > 2 ? topCareerMatches.get(2) : null);
        model.addAttribute("embedMode", embedMode);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        return "student/aptipath-result";
    }

    @GetMapping("/result/pdf")
    public ResponseEntity<byte[]> downloadResultPdf(@RequestParam(value = "sessionId", required = false) Long sessionId,
                                                     @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                                                     @RequestParam(value = "company", required = false) String companyCode,
                                                     HttpServletRequest request,
                                                     HttpServletResponse response,
                                                     HttpSession session) {
        RDUser student = requireStudent(session);
        if (student == null) {
            return ResponseEntity.status(401)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Unauthorized".getBytes(StandardCharsets.UTF_8));
        }

        RDCIAssessmentSession sessionRow = resolveCompletedSessionForStudent(student, sessionId);
        if (sessionRow == null) {
            return ResponseEntity.status(404)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("No completed AptiPath report found.".getBytes(StandardCharsets.UTF_8));
        }

        Map<String, String[]> params = new LinkedHashMap<>(request.getParameterMap());
        params.put("sessionId", new String[] { String.valueOf(sessionRow.getCiAssessmentSessionId()) });
        params.put("asPdf", new String[] { "1" });
        if (embed != null && embed == 1) {
            params.put("embed", new String[] { "1" });
        } else {
            params.remove("embed");
        }
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            params.put("company", new String[] { companyCode.trim() });
        }

        String html = JspCapture.renderToHtml(request, response, "/aptipath/student/result", params);
        byte[] pdf = HtmlToPdf.toPdf(html, resolveBaseUrl(request), true);

        String fileName = "AptiPath_Diagnostic_Report_Session_" + sessionRow.getCiAssessmentSessionId() + ".pdf";
        String contentDisposition = "attachment; filename=\""
                + URLEncoder.encode(fileName, StandardCharsets.UTF_8).replace("+", "%20")
                + "\"";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdf.length)
                .body(pdf);
    }

    @GetMapping("/test")
    public String test(@RequestParam(value = "embed", defaultValue = "0") Integer embed,
                       @RequestParam(value = "company", required = false) String companyCode,
                       @RequestParam(value = "validationError", required = false) Integer validationError,
                       @RequestParam(value = "restarted", required = false) Integer restarted,
                       @RequestParam(value = "missing", required = false) String missing,
                       Model model,
                       HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/student/test";
        }

        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDCISubscription subscription = resolveOrCreateAccessibleSubscription(student);
        if (!hasAptiPathAccess(subscription)) {
            return "redirect:/aptipath/student/home?subscriptionRequired=1";
        }
        if (!hasRequiredStudentProfileIntake(subscription)) {
            StringBuilder redirect = new StringBuilder("redirect:/aptipath/student/intake?intakeRequired=1");
            if (embed != null && embed == 1) {
                redirect.append("&embed=1");
            }
            if (companyCode != null && !companyCode.trim().isEmpty()) {
                redirect.append("&company=").append(urlEncode(companyCode.trim()));
            }
            return redirect.toString();
        }

        RDCIAssessmentSession liveSession = resolveOrCreateLiveSession(subscription, student);
        Map<String, String> academicProfile = loadStudentProfileIntakeAnswers(subscription);
        String academicStage = resolveAcademicStage(academicProfile);
        List<RDCIQuestionBank> questions = ciQuestionBankService
                .getOrSeedActiveQuestions("APTIPATH", liveSession.getAssessmentVersion());
        questions = filterQuestionsByAcademicGrade(questions, academicProfile);
        questions = filterQuestionsByAcademicStage(questions, academicStage, academicProfile);

        Map<String, String> savedAnswers = new LinkedHashMap<>();
        List<RDCIAssessmentResponse> savedResponses = ciAssessmentResponseService
                .getBySessionId(liveSession.getCiAssessmentSessionId());
        for (RDCIAssessmentResponse response : savedResponses) {
            if (response.getQuestionCode() != null) {
                savedAnswers.put(response.getQuestionCode(), response.getSelectedOption());
            }
        }
        List<Map<String, Object>> questionPayload = new ArrayList<>();
        for (RDCIQuestionBank question : questions) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("questionCode", question.getQuestionCode());
            row.put("sequenceNo", question.getSequenceNo());
            row.put("sectionCode", question.getSectionCode());
            row.put("questionText", question.getQuestionText());
            row.put("questionType", question.getQuestionType());
            row.put("mediaImageUrl", question.getMediaImageUrl());
            row.put("mediaVideoUrl", question.getMediaVideoUrl());
            row.put("mediaAnimationUrl", question.getMediaAnimationUrl());
            row.put("options", parseOptions(question.getOptionsJson()));
            row.put("timeLimitSecs", question.getTimeLimitSecs());
            row.put("isBehavioral", Boolean.TRUE.equals(question.getIsBehavioral()));
            row.put("careerClusterMap", question.getCareerClusterMap());
            row.put("difficulty", question.getDifficulty());
            questionPayload.add(row);
        }
        Map<String, String> thinkingAnswers = loadStudentThinkingCompositionAnswers(subscription);

        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        boolean embedMode = embed != null && embed == 1;

        model.addAttribute("student", student);
        model.addAttribute("subscription", subscription);
        model.addAttribute("sessionRow", liveSession);
        model.addAttribute("questions", questions);
        model.addAttribute("savedAnswers", savedAnswers);
        model.addAttribute("thinkingStorySummary", nz(thinkingAnswers.get("S_STORY_SUMMARY_01")));
        model.addAttribute("thinkingStoryDecision", nz(thinkingAnswers.get("S_STORY_DECISION_01")));
        model.addAttribute("thinkingStoryAction", nz(thinkingAnswers.get("S_STORY_ACTION_01")));
        model.addAttribute("questionsJson", toJson(questionPayload, "[]"));
        model.addAttribute("savedAnswersJson", toJson(savedAnswers, "{}"));
        model.addAttribute("academicStage", academicStage);
        model.addAttribute("academicProfile", academicProfile);
        model.addAttribute("questionBankDepth", questions.size());
        int targetQuestionCount = computeTargetQuestionCountForStage(questions, academicStage);
        model.addAttribute("targetQuestionCount", targetQuestionCount);
        model.addAttribute("paymentEnabled", isLiveReleaseMode());
        model.addAttribute("releaseMode", normalizedReleaseMode());
        model.addAttribute("embedMode", embedMode);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        model.addAttribute("validationError", validationError != null && validationError == 1);
        model.addAttribute("restarted", restarted != null && restarted == 1);
        model.addAttribute("missingCoverage", missing == null ? "" : missing);
        return "student/aptipath-test";
    }

    @PostMapping("/test/restart")
    public String restartTest(@RequestParam(value = "embed", defaultValue = "0") Integer embed,
                              @RequestParam(value = "company", required = false) String companyCode,
                              HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/aptipath/student/test";
        }

        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDCISubscription subscription = resolveOrCreateAccessibleSubscription(student);
        if (!hasAptiPathAccess(subscription)) {
            return "redirect:/aptipath/student/home?subscriptionRequired=1";
        }
        if (!hasRequiredStudentProfileIntake(subscription)) {
            StringBuilder redirect = new StringBuilder("redirect:/aptipath/student/intake?intakeRequired=1");
            if (embed != null && embed == 1) {
                redirect.append("&embed=1");
            }
            if (companyCode != null && !companyCode.trim().isEmpty()) {
                redirect.append("&company=").append(urlEncode(companyCode.trim()));
            }
            return redirect.toString();
        }

        RDCIAssessmentSession latest = ciAssessmentSessionService.getLatestByStudentUserId(student.getUserID());
        if (latest != null
                && latest.getSubscription() != null
                && subscription.getCiSubscriptionId().equals(latest.getSubscription().getCiSubscriptionId())
                && ASSESSMENT_VERSION.equalsIgnoreCase(nz(latest.getAssessmentVersion()))
                && !"COMPLETED".equalsIgnoreCase(nz(latest.getStatus()))) {
            ciAssessmentSessionService.completeSession(latest.getCiAssessmentSessionId(), 0);
        }

        RDCIAssessmentSession freshSession = ciAssessmentSessionService.createSession(
                subscription.getCiSubscriptionId(),
                student.getUserID(),
                ASSESSMENT_VERSION);
        ciAssessmentSessionService.markInProgress(freshSession.getCiAssessmentSessionId());

        StringBuilder redirect = new StringBuilder("redirect:/aptipath/student/test?restarted=1");
        if (embed != null && embed == 1) {
            redirect.append("&embed=1");
        }
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            redirect.append("&company=").append(urlEncode(companyCode.trim()));
        }
        return redirect.toString();
    }

    @PostMapping("/test/submit")
    public String submitTest(@RequestParam("sessionId") Long sessionId,
                             @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                             @RequestParam(value = "company", required = false) String companyCode,
                             @RequestParam Map<String, String> formData,
                             Model model,
                             HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login";
        }

        RDUser student = requireStudent(session);
        if (student == null) {
            return RDRoleRouteUtil.redirectHomeFor((RDUser) rawUser);
        }

        RDCIAssessmentSession sessionRow = ciAssessmentSessionService.getById(sessionId);
        if (sessionRow == null
                || sessionRow.getStudentUser() == null
                || !student.getUserID().equals(sessionRow.getStudentUser().getUserID())) {
            return "redirect:/aptipath/student/home";
        }

        List<RDCIQuestionBank> questions = ciQuestionBankService
                .getOrSeedActiveQuestions("APTIPATH", sessionRow.getAssessmentVersion());
        Map<String, String> academicProfile = loadStudentProfileIntakeAnswers(sessionRow.getSubscription());
        String academicStage = resolveAcademicStage(academicProfile);
        questions = filterQuestionsByAcademicGrade(questions, academicProfile);
        questions = filterQuestionsByAcademicStage(questions, academicStage, academicProfile);
        List<RDCIQuestionBank> servedQuestions = resolveServedQuestions(questions, formData.get("questionOrder"));
        String coverageError = validateCoverage(sessionRow.getAssessmentVersion(), servedQuestions, formData, academicStage);
        if (coverageError != null) {
            StringBuilder redirect = new StringBuilder("redirect:/aptipath/student/test?validationError=1");
            if (embed != null && embed == 1) {
                redirect.append("&embed=1");
            }
            if (companyCode != null && !companyCode.trim().isEmpty()) {
                redirect.append("&company=").append(urlEncode(companyCode.trim()));
            }
            redirect.append("&missing=").append(urlEncode(coverageError));
            return redirect.toString();
        }
        String thinkingValidationError = validateThinkingComposition(formData);
        if (thinkingValidationError != null) {
            StringBuilder redirect = new StringBuilder("redirect:/aptipath/student/test?validationError=1");
            if (embed != null && embed == 1) {
                redirect.append("&embed=1");
            }
            if (companyCode != null && !companyCode.trim().isEmpty()) {
                redirect.append("&company=").append(urlEncode(companyCode.trim()));
            }
            redirect.append("&missing=").append(urlEncode(thinkingValidationError));
            return redirect.toString();
        }
        for (RDCIQuestionBank question : servedQuestions) {
            String questionCode = question.getQuestionCode();
            String selectedOption = formData.get("Q_" + questionCode);
            Integer timeSpent = toInteger(formData.get("T_" + questionCode));
            String confidence = normalizeConfidence(formData.get("C_" + questionCode));
            String responseJson = "{\"source\":\"adaptive-" + safeJson(nz(sessionRow.getAssessmentVersion())) + "\",\"section\":\""
                    + safeJson(question.getSectionCode()) + "\"}";
            ciAssessmentResponseService.saveResponse(
                    sessionId,
                    questionCode,
                    selectedOption,
                    responseJson,
                    timeSpent,
                    confidence);
        }
        if (sessionRow.getSubscription() != null && sessionRow.getSubscription().getCiSubscriptionId() != null) {
            Long subscriptionId = sessionRow.getSubscription().getCiSubscriptionId();
            Integer studentUserId = student.getUserID();
            saveStudentIntakeResponse(subscriptionId, studentUserId, STUDENT_INTAKE_SECTION_THINKING,
                    "S_STORY_SUMMARY_01", formData.get("THINK_STORY_SUMMARY"));
            saveStudentIntakeResponse(subscriptionId, studentUserId, STUDENT_INTAKE_SECTION_THINKING,
                    "S_STORY_DECISION_01", formData.get("THINK_STORY_DECISION"));
            saveStudentIntakeResponse(subscriptionId, studentUserId, STUDENT_INTAKE_SECTION_THINKING,
                    "S_STORY_ACTION_01", formData.get("THINK_STORY_ACTION"));
        }

        Integer durationSeconds = toInteger(formData.get("durationSeconds"));
        sessionRow = ciAssessmentSessionService.completeSession(sessionId, durationSeconds);
        SessionScoreSummary scoreSummary = ciAssessmentResponseService.getSessionScoreSummary(sessionId);
        scoreSummary = normalizeAdaptiveScoreSummary(scoreSummary, servedQuestions, formData);
        String scoringVersion = nz(sessionRow.getAssessmentVersion()).isEmpty()
                ? ASSESSMENT_VERSION
                : nz(sessionRow.getAssessmentVersion());

        double percent = clamp(scoreSummary.getScorePercent(), 0.0, 100.0);
        Map<String, Double> sectionScores = computeSectionScores(servedQuestions, formData);
        List<Map<String, Object>> scoreDriverQuestions = buildScoreDriverQuestions(servedQuestions, formData, 20);
        List<RDCIIntakeResponse> intakeRows = List.of();
        if (sessionRow.getSubscription() != null && sessionRow.getSubscription().getCiSubscriptionId() != null) {
            intakeRows = ciIntakeService.getBySubscriptionId(sessionRow.getSubscription().getCiSubscriptionId());
        }
        Map<String, String> thinkingCompositionAnswers = extractStudentThinkingCompositionAnswers(intakeRows);
        List<String> thinkingCompositionInsights = buildThinkingCompositionInsights(thinkingCompositionAnswers);
        List<Map<String, String>> thinkingCompositionSnapshots = buildThinkingCompositionSnapshots(thinkingCompositionAnswers);
        Map<String, String> academicProfileFromIntake = extractAcademicProfileFromIntakeRows(intakeRows);
        if (!academicProfileFromIntake.isEmpty()) {
            academicProfile.putAll(academicProfileFromIntake);
        }
        String planningMode = resolvePlanningModeFromAcademicProfile(academicProfile);
        String planningWindow = resolvePlanningWindowFromAcademicProfile(academicProfile);
        double aptitudeScore = weightedAverage(sectionScores, "CORE_APTITUDE", 0.65, "APPLIED_CHALLENGE", 0.35);
        double interestScore = weightedAverage(sectionScores, "INTEREST_WORK", 0.60, "VALUES_MOTIVATION", 0.40);
        double examReadinessIndex = sectionScores.getOrDefault("LEARNING_BEHAVIOR", Math.max(45.0, percent - 6.0));
        double aiReadinessIndex = sectionScores.getOrDefault("AI_READINESS", Math.max(45.0, percent - 4.0));
        double explorationIndex = sectionScores.getOrDefault("INTEREST_WORK", Math.max(45.0, percent - 2.0));
        double pressureIndex = clamp(100.0 - sectionScores.getOrDefault("CAREER_REALITY", 55.0), 5.0, 95.0);
        double stemFoundationIndex = sectionScores.getOrDefault("STEM_FOUNDATION", aptitudeScore);
        double biologyFoundationIndex = sectionScores.getOrDefault("BIOLOGY_FOUNDATION", interestScore);
        double generalAwarenessIndex = sectionScores.getOrDefault("GENERAL_AWARENESS", examReadinessIndex);
        double reasoningIqIndex = sectionScores.getOrDefault("REASONING_IQ", aptitudeScore);
        double parentContextScore = computeParentContextScore(intakeRows);
        double alignmentIndex = computeAlignmentIndex(intakeRows);
        double overallFitScore = clamp(
                (percent * 0.45)
                        + (aptitudeScore * 0.26)
                        + (interestScore * 0.15)
                        + (reasoningIqIndex * 0.04)
                        + (parentContextScore * 0.10),
                0.0,
                100.0);
        double wellbeingRiskIndex = clamp((pressureIndex * 0.65) + ((100.0 - examReadinessIndex) * 0.20) + ((100.0 - alignmentIndex) * 0.15), 0.0, 100.0);
        double mentalPreparednessIndex = clamp(
                (examReadinessIndex * 0.45)
                        + ((100.0 - pressureIndex) * 0.25)
                        + ((100.0 - wellbeingRiskIndex) * 0.20)
                        + (alignmentIndex * 0.10),
                0.0,
                100.0);

        double iitFitIndex = clamp((aptitudeScore * 0.46) + (examReadinessIndex * 0.22) + (mentalPreparednessIndex * 0.20) + (aiReadinessIndex * 0.12), 0.0, 100.0);
        double neetFitIndex = clamp((aptitudeScore * 0.34) + (examReadinessIndex * 0.28) + (mentalPreparednessIndex * 0.26) + (alignmentIndex * 0.12), 0.0, 100.0);
        double catFitIndex = clamp((aptitudeScore * 0.30) + (aiReadinessIndex * 0.16) + (examReadinessIndex * 0.22) + (mentalPreparednessIndex * 0.20) + (alignmentIndex * 0.12), 0.0, 100.0);
        double lawFitIndex = clamp((interestScore * 0.24) + (examReadinessIndex * 0.20) + (mentalPreparednessIndex * 0.28) + (alignmentIndex * 0.18) + ((100.0 - wellbeingRiskIndex) * 0.10), 0.0, 100.0);
        double roboticsFitIndex = clamp((aptitudeScore * 0.30) + (aiReadinessIndex * 0.26) + (interestScore * 0.20) + (mentalPreparednessIndex * 0.14) + (examReadinessIndex * 0.10), 0.0, 100.0);
        double spaceTechFitIndex = clamp((aptitudeScore * 0.38) + (examReadinessIndex * 0.20) + (mentalPreparednessIndex * 0.20) + (aiReadinessIndex * 0.12) + (alignmentIndex * 0.10), 0.0, 100.0);
        double droneAutonomyFitIndex = clamp((aptitudeScore * 0.28) + (aiReadinessIndex * 0.30) + (interestScore * 0.18) + (mentalPreparednessIndex * 0.14) + (examReadinessIndex * 0.10), 0.0, 100.0);
        double aiSystemsFitIndex = clamp((aiReadinessIndex * 0.34) + (aptitudeScore * 0.24) + (interestScore * 0.16) + (mentalPreparednessIndex * 0.14) + (examReadinessIndex * 0.12), 0.0, 100.0);
        double biotechFitIndex = clamp((neetFitIndex * 0.34) + (aptitudeScore * 0.20) + (interestScore * 0.18) + (mentalPreparednessIndex * 0.18) + (aiReadinessIndex * 0.10), 0.0, 100.0);
        double climateTechFitIndex = clamp((interestScore * 0.24) + (aptitudeScore * 0.24) + (aiReadinessIndex * 0.18) + (mentalPreparednessIndex * 0.18) + (alignmentIndex * 0.16), 0.0, 100.0);
        double productDesignFitIndex = clamp((interestScore * 0.32) + (aiReadinessIndex * 0.18) + (mentalPreparednessIndex * 0.18) + (alignmentIndex * 0.16) + (examReadinessIndex * 0.16), 0.0, 100.0);
        double entrepreneurialFitIndex = clamp((interestScore * 0.24) + (catFitIndex * 0.18) + (aiReadinessIndex * 0.16) + (mentalPreparednessIndex * 0.22) + (alignmentIndex * 0.20), 0.0, 100.0);
        double publicImpactFitIndex = clamp((lawFitIndex * 0.26) + (interestScore * 0.24) + (mentalPreparednessIndex * 0.22) + (alignmentIndex * 0.18) + (examReadinessIndex * 0.10), 0.0, 100.0);
        List<String> selectedCareerIntents = parseCareerIntents(formData.get("careerIntentCsv"));
        Map<String, Integer> studentSelfSignals = parseStudentSelfSignals(formData);
        List<String> selfSignalInsights = buildSelfSignalInsights(selectedCareerIntents, studentSelfSignals);
        Map<String, Integer> subjectAffinitySignals = parseSubjectAffinitySignals(formData);
        List<String> subjectAffinityInsights = buildSubjectAffinityInsights(subjectAffinitySignals, selectedCareerIntents);

        double mathAffinity = affinityPercent(subjectAffinitySignals.getOrDefault("math", 0), aptitudeScore);
        double physicsAffinity = affinityPercent(subjectAffinitySignals.getOrDefault("physics", 0), aptitudeScore);
        double chemistryAffinity = affinityPercent(subjectAffinitySignals.getOrDefault("chemistry", 0), interestScore);
        double biologyAffinity = affinityPercent(subjectAffinitySignals.getOrDefault("biology", 0), interestScore);
        double languageAffinity = affinityPercent(subjectAffinitySignals.getOrDefault("language", 0), interestScore);

        double engineeringSubjectReadiness = clamp((mathAffinity * 0.45) + (physicsAffinity * 0.35) + (chemistryAffinity * 0.20), 0.0, 100.0);
        double medicineSubjectReadiness = clamp((biologyAffinity * 0.50) + (chemistryAffinity * 0.30) + (physicsAffinity * 0.20), 0.0, 100.0);
        double commerceSubjectReadiness = clamp((mathAffinity * 0.45) + (languageAffinity * 0.35) + (chemistryAffinity * 0.20), 0.0, 100.0);
        double communicationSubjectReadiness = clamp((languageAffinity * 0.70) + ((100.0 - mathAffinity) * 0.10) + (interestScore * 0.20), 0.0, 100.0);
        double engineeringEvidence = clamp((stemFoundationIndex * 0.45) + (reasoningIqIndex * 0.35) + (engineeringSubjectReadiness * 0.20), 0.0, 100.0);
        double medicineEvidence = clamp((biologyFoundationIndex * 0.55) + (stemFoundationIndex * 0.15) + (medicineSubjectReadiness * 0.30), 0.0, 100.0);
        double managementEvidence = clamp((reasoningIqIndex * 0.45) + (generalAwarenessIndex * 0.25) + (commerceSubjectReadiness * 0.30), 0.0, 100.0);
        double lawEvidence = clamp((generalAwarenessIndex * 0.35) + (reasoningIqIndex * 0.30) + (communicationSubjectReadiness * 0.35), 0.0, 100.0);
        double stemCompetencyIndex = clamp(
                (sectionScores.getOrDefault("CORE_APTITUDE", aptitudeScore) * 0.32)
                        + (sectionScores.getOrDefault("APPLIED_CHALLENGE", aptitudeScore) * 0.20)
                        + (stemFoundationIndex * 0.14)
                        + (reasoningIqIndex * 0.10)
                        + (aiReadinessIndex * 0.18)
                        + (mathAffinity * 0.06),
                0.0,
                100.0);
        double medicalCompetencyIndex = clamp(
                (sectionScores.getOrDefault("CORE_APTITUDE", aptitudeScore) * 0.12)
                        + (sectionScores.getOrDefault("LEARNING_BEHAVIOR", examReadinessIndex) * 0.20)
                        + (biologyFoundationIndex * 0.18)
                        + (biologyAffinity * 0.30)
                        + (chemistryAffinity * 0.12)
                        + (neetFitIndex * 0.08),
                0.0,
                100.0);
        double commerceCompetencyIndex = clamp(
                (catFitIndex * 0.24)
                        + (commerceSubjectReadiness * 0.24)
                        + (reasoningIqIndex * 0.18)
                        + (generalAwarenessIndex * 0.12)
                        + (sectionScores.getOrDefault("CORE_APTITUDE", aptitudeScore) * 0.12)
                        + (alignmentIndex * 0.10),
                0.0,
                100.0);
        double humanitiesCompetencyIndex = clamp(
                (lawFitIndex * 0.24)
                        + (communicationSubjectReadiness * 0.22)
                        + (generalAwarenessIndex * 0.20)
                        + (sectionScores.getOrDefault("INTEREST_WORK", interestScore) * 0.16)
                        + (sectionScores.getOrDefault("VALUES_MOTIVATION", interestScore) * 0.10)
                        + (mentalPreparednessIndex * 0.08),
                0.0,
                100.0);

        iitFitIndex = blendWithSubject(iitFitIndex, engineeringEvidence, 0.34);
        neetFitIndex = blendWithSubject(neetFitIndex, medicineEvidence, 0.38);
        catFitIndex = blendWithSubject(catFitIndex, managementEvidence, 0.30);
        lawFitIndex = blendWithSubject(lawFitIndex, lawEvidence, 0.32);
        roboticsFitIndex = blendWithSubject(roboticsFitIndex, engineeringSubjectReadiness, 0.18);
        aiSystemsFitIndex = blendWithSubject(aiSystemsFitIndex, mathAffinity, 0.18);
        spaceTechFitIndex = blendWithSubject(spaceTechFitIndex, engineeringSubjectReadiness, 0.22);
        droneAutonomyFitIndex = blendWithSubject(droneAutonomyFitIndex, engineeringSubjectReadiness, 0.20);
        biotechFitIndex = blendWithSubject(biotechFitIndex, medicineSubjectReadiness, 0.22);
        productDesignFitIndex = blendWithSubject(productDesignFitIndex, communicationSubjectReadiness, 0.15);
        publicImpactFitIndex = blendWithSubject(publicImpactFitIndex, communicationSubjectReadiness, 0.16);

        iitFitIndex = calibrateFitIndex(iitFitIndex, percent);
        neetFitIndex = calibrateFitIndex(neetFitIndex, percent);
        catFitIndex = calibrateFitIndex(catFitIndex, percent);
        lawFitIndex = calibrateFitIndex(lawFitIndex, percent);
        roboticsFitIndex = calibrateFitIndex(roboticsFitIndex, percent);
        spaceTechFitIndex = calibrateFitIndex(spaceTechFitIndex, percent);
        droneAutonomyFitIndex = calibrateFitIndex(droneAutonomyFitIndex, percent);
        aiSystemsFitIndex = calibrateFitIndex(aiSystemsFitIndex, percent);
        biotechFitIndex = calibrateFitIndex(biotechFitIndex, percent);
        climateTechFitIndex = calibrateFitIndex(climateTechFitIndex, percent);
        productDesignFitIndex = calibrateFitIndex(productDesignFitIndex, percent);
        entrepreneurialFitIndex = calibrateFitIndex(entrepreneurialFitIndex, percent);
        publicImpactFitIndex = calibrateFitIndex(publicImpactFitIndex, percent);

        stemCompetencyIndex = calibrateFitIndex(stemCompetencyIndex, percent);
        medicalCompetencyIndex = calibrateFitIndex(medicalCompetencyIndex, percent);
        commerceCompetencyIndex = calibrateFitIndex(commerceCompetencyIndex, percent);
        humanitiesCompetencyIndex = calibrateFitIndex(humanitiesCompetencyIndex, percent);
        mentalPreparednessIndex = calibrateFitIndex(mentalPreparednessIndex, percent);

        Map<String, Double> emergingClusterFits = new LinkedHashMap<>();
        emergingClusterFits.put("Robotics and Automation", round1(roboticsFitIndex));
        emergingClusterFits.put("Space and Aerospace Systems", round1(spaceTechFitIndex));
        emergingClusterFits.put("Drone and Autonomous Systems", round1(droneAutonomyFitIndex));
        emergingClusterFits.put("AI Systems and Applied ML", round1(aiSystemsFitIndex));
        emergingClusterFits.put("Biotech and Health Innovation", round1(biotechFitIndex));
        emergingClusterFits.put("Climate and Sustainability Tech", round1(climateTechFitIndex));
        emergingClusterFits.put("Product, UX, and Design Systems", round1(productDesignFitIndex));
        emergingClusterFits.put("Entrepreneurship and Venture Paths", round1(entrepreneurialFitIndex));
        emergingClusterFits.put("Policy, Law, and Public Impact", round1(publicImpactFitIndex));

        Map<String, Double> streamCompetencyFits = new LinkedHashMap<>();
        streamCompetencyFits.put("STEM Competency", round1(stemCompetencyIndex));
        streamCompetencyFits.put("Medical Competency", round1(medicalCompetencyIndex));
        streamCompetencyFits.put("Commerce Competency", round1(commerceCompetencyIndex));
        streamCompetencyFits.put("Humanities Competency", round1(humanitiesCompetencyIndex));

        List<String> encouragementHighlights = buildEncouragementHighlights(
                scoreSummary.getScorePercent(),
                mentalPreparednessIndex,
                aiReadinessIndex,
                examReadinessIndex,
                wellbeingRiskIndex,
                emergingClusterFits);
        List<String> encouragementActions = buildEncouragementActions(
                examReadinessIndex,
                aiReadinessIndex,
                wellbeingRiskIndex,
                alignmentIndex,
                emergingClusterFits);

        RDCIScoreIndex scoreIndex = ciScoreIndexService.saveOrUpdate(
                sessionId,
                scoringVersion,
                aptitudeScore,
                interestScore,
                parentContextScore,
                overallFitScore,
                pressureIndex,
                explorationIndex,
                examReadinessIndex,
                aiReadinessIndex,
                alignmentIndex,
                wellbeingRiskIndex);

        List<Map<String, Object>> careerUniverseFits = buildCareerUniverseFits(
                aptitudeScore,
                interestScore,
                examReadinessIndex,
                aiReadinessIndex,
                mentalPreparednessIndex,
                alignmentIndex,
                wellbeingRiskIndex,
                parentContextScore,
                sectionScores,
                iitFitIndex,
                neetFitIndex,
                catFitIndex,
                lawFitIndex,
                roboticsFitIndex,
                spaceTechFitIndex,
                droneAutonomyFitIndex,
                aiSystemsFitIndex,
                biotechFitIndex,
                climateTechFitIndex,
                productDesignFitIndex,
                entrepreneurialFitIndex,
                publicImpactFitIndex,
                selectedCareerIntents,
                studentSelfSignals,
                subjectAffinitySignals,
                percent,
                academicProfile);
        List<Map<String, Object>> topCareerMatches = careerUniverseFits.stream()
                .sorted((a, b) -> Double.compare(
                        (Double) b.getOrDefault("fitScore", 0.0),
                        (Double) a.getOrDefault("fitScore", 0.0)))
                .limit(20)
                .collect(Collectors.toList());
        int careerScore = computeCareerHealthScore(percent, overallFitScore);
        String careerScoreBand = resolveCareerScoreBand(careerScore);
        String primaryCareer = careerNameAt(topCareerMatches, 0, "Engineering and Technology");
        String adjacentCareer = careerNameAt(topCareerMatches, 1, "Applied Sciences");
        String exploratoryCareer = careerNameAt(topCareerMatches, 2, "Creative and Emerging Careers");
        String careerSummaryLine = "Top current fit careers include "
                + primaryCareer
                + ", "
                + adjacentCareer
                + ", and "
                + exploratoryCareer
                + ".";
        if (!selectedCareerIntents.isEmpty()) {
            careerSummaryLine = careerSummaryLine + " Intent cues considered: " + String.join(", ", intentLabels(selectedCareerIntents)) + ".";
        }
        if (!subjectAffinityInsights.isEmpty()) {
            careerSummaryLine = careerSummaryLine + " Subject signal: " + subjectAffinityInsights.get(0);
        }
        RDCIRecommendationSnapshot existingSnapshot = ciRecommendationService.getLatestByAssessmentSessionId(sessionId);
        Map<String, Object> existingSnapshotPayload = parseJsonObject(
                existingSnapshot == null ? null : existingSnapshot.getCareerClustersJson());
        boolean existingAiApplied = parseBooleanValue(existingSnapshotPayload.get("aiEnrichmentApplied"), false);
        String existingAiStatus = parseStringValue(existingSnapshotPayload.get("aiEnrichmentStatus"));
        boolean existingAiAttempted = existingAiApplied || !existingAiStatus.isEmpty();
        String aiStudentNarrative = "";
        List<String> aiParentGuidance = List.of();
        List<String> aiFollowUpQuestions = List.of();
        boolean aiEnrichmentApplied = existingAiApplied;
        String aiEnrichmentStatus = existingAiStatus.isEmpty() ? "DISABLED" : existingAiStatus;
        if (!existingAiApplied) {
            String existingSummaryLine = parseStringValue(existingSnapshotPayload.get("careerSummaryLine"));
            if (!existingSummaryLine.isEmpty()) {
                careerSummaryLine = existingSummaryLine;
            }
            List<String> existingHighlights = parseStringList(existingSnapshotPayload.get("encouragementHighlights"));
            if (!existingHighlights.isEmpty()) {
                encouragementHighlights = existingHighlights;
            }
            List<String> existingActions = parseStringList(existingSnapshotPayload.get("encouragementActions"));
            if (!existingActions.isEmpty()) {
                encouragementActions = existingActions;
            }
        }
        aiStudentNarrative = parseStringValue(existingSnapshotPayload.get("aiStudentNarrative"));
        aiParentGuidance = parseStringList(existingSnapshotPayload.get("aiParentGuidance"));
        aiFollowUpQuestions = parseStringList(existingSnapshotPayload.get("aiFollowUpQuestions"));
        if (aptiPathReportEnrichmentService != null && !existingAiAttempted) {
            RDAptiPathReportEnrichmentService.EnrichmentResult aiEnrichment = aptiPathReportEnrichmentService
                    .enrichReport(buildAiEnrichmentContext(
                            student,
                            sessionRow,
                            percent,
                            overallFitScore,
                            careerScore,
                            careerScoreBand,
                            careerSummaryLine,
                            streamCompetencyFits,
                            sectionScores,
                            topCareerMatches,
                            intentLabels(selectedCareerIntents),
                            subjectAffinityInsights,
                            thinkingCompositionInsights,
                            encouragementHighlights,
                            encouragementActions,
                            extractAcademicProfileFromIntakeRows(intakeRows)));
            aiEnrichmentApplied = aiEnrichment.isApplied();
            aiEnrichmentStatus = aiEnrichment.getStatus();
            if (!aiEnrichment.getSummaryLine().isEmpty()) {
                careerSummaryLine = aiEnrichment.getSummaryLine();
            }
            if (!aiEnrichment.getHighlights().isEmpty()) {
                encouragementHighlights = aiEnrichment.getHighlights();
            }
            if (!aiEnrichment.getActions().isEmpty()) {
                encouragementActions = aiEnrichment.getActions();
            }
            aiStudentNarrative = aiEnrichment.getStudentNarrative();
            aiParentGuidance = aiEnrichment.getParentGuidance();
            aiFollowUpQuestions = aiEnrichment.getFollowUpQuestions();
        } else if (existingAiAttempted && aiEnrichmentStatus.isEmpty()) {
            aiEnrichmentStatus = existingAiApplied ? "APPLIED_EXISTING" : "SKIPPED_EXISTING";
        }

        Map<String, Double> streamFitPayload = new LinkedHashMap<>();
        streamFitPayload.put("iit", round1(iitFitIndex));
        streamFitPayload.put("neet", round1(neetFitIndex));
        streamFitPayload.put("cat", round1(catFitIndex));
        streamFitPayload.put("law", round1(lawFitIndex));
        streamFitPayload.put("robotics", round1(roboticsFitIndex));
        streamFitPayload.put("space", round1(spaceTechFitIndex));
        streamFitPayload.put("drone", round1(droneAutonomyFitIndex));
        streamFitPayload.put("ai_systems", round1(aiSystemsFitIndex));
        streamFitPayload.put("biotech", round1(biotechFitIndex));
        streamFitPayload.put("climate_tech", round1(climateTechFitIndex));
        streamFitPayload.put("product_design", round1(productDesignFitIndex));
        streamFitPayload.put("entrepreneurship", round1(entrepreneurialFitIndex));
        streamFitPayload.put("public_impact", round1(publicImpactFitIndex));
        streamFitPayload.put("creative_tech", round1(calibrateFitIndex(
                (interestScore * 0.60) + (aiReadinessIndex * 0.40), percent)));
        streamFitPayload.put("applied_vocational", round1(calibrateFitIndex(
                (interestScore * 0.45) + (parentContextScore * 0.30) + ((100.0 - pressureIndex) * 0.25), percent)));

        Map<String, Double> streamFitIndices = new LinkedHashMap<>();
        streamFitIndices.put("IIT", round1(iitFitIndex));
        streamFitIndices.put("NEET", round1(neetFitIndex));
        streamFitIndices.put("CAT", round1(catFitIndex));
        streamFitIndices.put("LAW", round1(lawFitIndex));

        Map<String, Object> careerClusterPayload = new LinkedHashMap<>();
        careerClusterPayload.put("cluster", "Career Universe Fit");
        careerClusterPayload.put("confidence", round1(calibrateFitIndex(overallFitScore, percent)));
        careerClusterPayload.put("mentalPreparednessIndex", round1(mentalPreparednessIndex));
        careerClusterPayload.put("careerScore", careerScore);
        careerClusterPayload.put("careerScoreBand", careerScoreBand);
        careerClusterPayload.put("careerUniverseCount", careerUniverseFits.size());
        careerClusterPayload.put("careerSummaryLine", careerSummaryLine);
        careerClusterPayload.put("selectedCareerIntents", intentLabels(selectedCareerIntents));
        careerClusterPayload.put("studentSelfSignals", studentSelfSignals);
        careerClusterPayload.put("selfSignalInsights", selfSignalInsights);
        careerClusterPayload.put("subjectAffinitySignals", subjectAffinitySignals);
        careerClusterPayload.put("subjectAffinityInsights", subjectAffinityInsights);
        careerClusterPayload.put("sectionScores", sectionScores);
        careerClusterPayload.put("streamCompetencyFits", streamCompetencyFits);
        careerClusterPayload.put("emergingClusterFits", emergingClusterFits);
        careerClusterPayload.put("topCareerMatches", topCareerMatches);
        careerClusterPayload.put("streamFitIndices", streamFitIndices);
        careerClusterPayload.put("encouragementHighlights", encouragementHighlights);
        careerClusterPayload.put("encouragementActions", encouragementActions);
        careerClusterPayload.put("aiStudentNarrative", aiStudentNarrative);
        careerClusterPayload.put("aiParentGuidance", aiParentGuidance);
        careerClusterPayload.put("aiFollowUpQuestions", aiFollowUpQuestions);
        careerClusterPayload.put("aiEnrichmentApplied", aiEnrichmentApplied);
        careerClusterPayload.put("aiEnrichmentStatus", aiEnrichmentStatus);
        careerClusterPayload.put("academicProfile", academicProfile);
        careerClusterPayload.put("planningMode", planningMode);
        careerClusterPayload.put("planningWindow", planningWindow);

        Map<String, Object> planAPayload = new LinkedHashMap<>();
        planAPayload.put("title", "Primary Path");
        planAPayload.put("path", primaryCareer);
        planAPayload.put("next_step", "Start a 90-day structured roadmap aligned to this career direction");
        planAPayload.put("first_90_days", List.of(
                "Days 1-30 baseline and habit reset",
                "Days 31-60 deep practice and error logs",
                "Days 61-90 mock simulations and mentoring review"));

        Map<String, Object> planBPayload = new LinkedHashMap<>();
        planBPayload.put("title", "Adjacent Path");
        planBPayload.put("path", adjacentCareer);
        planBPayload.put("next_step", "Build parallel exposure through guided projects and weekly reflection");

        Map<String, Object> planCPayload = new LinkedHashMap<>();
        planCPayload.put("title", "Exploratory Path");
        planCPayload.put("path", exploratoryCareer);
        planCPayload.put("next_step", "Run low-risk exploration sprints before final stream lock-in");

        String streamFitJson = toJson(streamFitPayload, "{}");
        String careerClusterJson = toJson(careerClusterPayload, "{}");
        String planAJson = toJson(planAPayload, "{}");
        String planBJson = toJson(planBPayload, "{}");
        String planCJson = toJson(planCPayload, "{}");
        String summaryText = buildRecommendationSummary(scoreSummary)
                + " Career health score "
                + careerScore
                + " ("
                + careerScoreBand
                + "). "
                + careerSummaryLine
                + (aiEnrichmentApplied ? " AI enrichment status: APPLIED." : "")
                + " Planning horizon: " + planningMode + " (" + planningWindow + ")."
                + " Score calculation: 65% assessed test accuracy + 35% readiness indices."
                + " IIT/NEET/CAT are readiness-fit indicators, not predicted exam ranks.";

        RDCIRecommendationSnapshot recommendation = ciRecommendationService.saveSnapshot(
                sessionId,
                scoringVersion,
                streamFitJson,
                careerClusterJson,
                planAJson,
                planBJson,
                planCJson,
                summaryText);

        if (aptiPathPrefinalEnabled) {
            return reportIntakeRedirect(sessionId, embed, companyCode, false);
        }

        RDCISubscription subscription = ciSubscriptionService.getLatestByStudentUserId(student.getUserID());
        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        boolean embedMode = embed != null && embed == 1;

        model.addAttribute("student", student);
        model.addAttribute("subscription", subscription);
        model.addAttribute("sessionRow", sessionRow);
        model.addAttribute("scoreSummary", scoreSummary);
        model.addAttribute("assessedAccuracyPercent", round1(percent));
        model.addAttribute("overallReadinessScore", round1(overallFitScore));
        model.addAttribute("scoreIndex", scoreIndex);
        model.addAttribute("mentalPreparednessIndex", round1(mentalPreparednessIndex));
        model.addAttribute("iitFitIndex", round1(iitFitIndex));
        model.addAttribute("neetFitIndex", round1(neetFitIndex));
        model.addAttribute("catFitIndex", round1(catFitIndex));
        model.addAttribute("lawFitIndex", round1(lawFitIndex));
        model.addAttribute("emergingClusterFits", emergingClusterFits);
        model.addAttribute("careerScore", careerScore);
        model.addAttribute("careerScoreBand", careerScoreBand);
        model.addAttribute("careerUniverseCount", careerUniverseFits.size());
        model.addAttribute("topCareerMatches", topCareerMatches);
        model.addAttribute("careerSummaryLine", careerSummaryLine);
        model.addAttribute("selectedCareerIntents", intentLabels(selectedCareerIntents));
        model.addAttribute("studentSelfSignals", studentSelfSignals);
        model.addAttribute("selfSignalInsights", selfSignalInsights);
        model.addAttribute("subjectAffinitySignals", subjectAffinitySignals);
        model.addAttribute("subjectAffinityInsights", subjectAffinityInsights);
        model.addAttribute("streamCompetencyFits", streamCompetencyFits);
        model.addAttribute("sectionScores", sectionScores);
        model.addAttribute("streamFitIndices", streamFitIndices);
        model.addAttribute("sectionScoreDisplayMap", toSectionScoreDisplayMap(sectionScores));
        model.addAttribute("subjectSignalDisplayMap", toSubjectSignalDisplayMap(subjectAffinitySignals));
        model.addAttribute("streamFitIndicesJson", toJson(streamFitIndices, "{}"));
        model.addAttribute("sectionScoresJson", toJson(sectionScores, "{}"));
        model.addAttribute("streamCompetencyJson", toJson(streamCompetencyFits, "{}"));
        model.addAttribute("subjectSignalsJson", toJson(subjectAffinitySignals, "{}"));
        model.addAttribute("encouragementHighlights", encouragementHighlights);
        model.addAttribute("encouragementActions", encouragementActions);
        model.addAttribute("scoreDriverQuestions", scoreDriverQuestions);
        model.addAttribute("thinkingCompositionInsights", thinkingCompositionInsights);
        model.addAttribute("thinkingCompositionSnapshots", thinkingCompositionSnapshots);
        model.addAttribute("scoringMethodNotes", buildScoringMethodNotes(scoreSummary, overallFitScore));
        model.addAttribute("recommendationSummaryText", summaryText);
        model.addAttribute("academicProfile", academicProfile);
        model.addAttribute("planningMode", planningMode);
        model.addAttribute("planningWindow", planningWindow);
        model.addAttribute("aiStudentNarrative", aiStudentNarrative);
        model.addAttribute("aiParentGuidance", aiParentGuidance);
        model.addAttribute("aiFollowUpQuestions", aiFollowUpQuestions);
        model.addAttribute("aiEnrichmentApplied", aiEnrichmentApplied);
        model.addAttribute("aiEnrichmentStatus", aiEnrichmentStatus);
        model.addAttribute("recommendation", recommendation);
        model.addAttribute("planAText", planSummaryText(
                recommendation.getPlanAJson(),
                "Primary path: start a structured 90-day roadmap."));
        model.addAttribute("planBText", planSummaryText(
                recommendation.getPlanBJson(),
                "Adjacent path: build parallel exposure through guided projects."));
        model.addAttribute("planCText", planSummaryText(
                recommendation.getPlanCJson(),
                "Exploratory path: run low-risk discovery sprints before lock-in."));
        model.addAttribute("planACareer", topCareerMatches.size() > 0 ? topCareerMatches.get(0) : null);
        model.addAttribute("planBCareer", topCareerMatches.size() > 1 ? topCareerMatches.get(1) : null);
        model.addAttribute("planCCareer", topCareerMatches.size() > 2 ? topCareerMatches.get(2) : null);
        model.addAttribute("embedMode", embedMode);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        return "student/aptipath-result";
    }

    @PostMapping("/feedback")
    public ResponseEntity<String> submitFeedback(@RequestParam("sessionId") Long sessionId,
                                                  @RequestParam(value = "starRating", defaultValue = "0") int starRating,
                                                  @RequestParam(value = "npsScore", defaultValue = "-1") int npsScore,
                                                  @RequestParam(value = "feedbackText", required = false) String feedbackText,
                                                  @RequestParam(value = "wouldRefer", defaultValue = "false") boolean wouldRefer,
                                                  HttpSession session) {
        RDUser student = requireStudent(session);
        if (student == null) {
            return ResponseEntity.status(401).body("{\"status\":\"unauthorized\"}");
        }
        RDCIAssessmentSession sessionRow = resolveCompletedSessionForStudent(student, sessionId);
        if (sessionRow == null) {
            return ResponseEntity.status(404).body("{\"status\":\"session_not_found\"}");
        }
        Long subscriptionId = sessionRow.getSubscription() != null
                ? sessionRow.getSubscription().getCiSubscriptionId() : null;
        if (subscriptionId == null) {
            return ResponseEntity.status(400).body("{\"status\":\"no_subscription\"}");
        }
        Map<String, Object> feedbackJson = new LinkedHashMap<>();
        feedbackJson.put("starRating", starRating);
        feedbackJson.put("npsScore", npsScore);
        feedbackJson.put("feedbackText", feedbackText != null ? feedbackText.trim() : "");
        feedbackJson.put("wouldRefer", wouldRefer);
        feedbackJson.put("sessionId", sessionId);
        feedbackJson.put("submittedAt", java.time.LocalDateTime.now().toString());
        String answerJson = toJson(feedbackJson, "{}");
        ciIntakeService.saveResponse(
                subscriptionId,
                null,
                student.getUserID(),
                "STUDENT",
                "FEEDBACK",
                "FEEDBACK_REPORT_01",
                String.valueOf(starRating),
                answerJson);
        if (npsScore >= 0) {
            ciIntakeService.saveResponse(
                    subscriptionId,
                    null,
                    student.getUserID(),
                    "STUDENT",
                    "FEEDBACK",
                    "FEEDBACK_NPS_01",
                    String.valueOf(npsScore),
                    answerJson);
        }
        return ResponseEntity.ok("{\"status\":\"ok\",\"message\":\"Thank you for your feedback!\"}");
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

    private String resultRedirect(Long sessionId, Integer embed, String companyCode) {
        StringBuilder redirect = new StringBuilder("redirect:/aptipath/student/result?sessionId=");
        redirect.append(sessionId == null ? "" : sessionId);
        if (embed != null && embed == 1) {
            redirect.append("&embed=1");
        }
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            redirect.append("&company=").append(urlEncode(companyCode.trim()));
        }
        return redirect.toString();
    }

    private String reportIntakeRedirect(Long sessionId, Integer embed, String companyCode, boolean required) {
        StringBuilder redirect = new StringBuilder("redirect:/aptipath/student/report-intake?sessionId=");
        redirect.append(sessionId == null ? "" : sessionId);
        if (required) {
            redirect.append("&required=1");
        }
        if (embed != null && embed == 1) {
            redirect.append("&embed=1");
        }
        if (companyCode != null && !companyCode.trim().isEmpty()) {
            redirect.append("&company=").append(urlEncode(companyCode.trim()));
        }
        return redirect.toString();
    }

    private RDUser requireStudent(HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return null;
        }
        RDUser student = (RDUser) rawUser;
        if (student.getProfile_id() != RDUser.profileType.ROBO_STUDENT.getValue()) {
            return null;
        }
        return student;
    }

    private boolean isLiveReleaseMode() {
        return "LIVE".equalsIgnoreCase(normalizedReleaseMode());
    }

    private String normalizedReleaseMode() {
        String mode = nz(aptiPathReleaseMode).trim();
        return mode.isEmpty() ? "BETA" : mode.toUpperCase(Locale.ENGLISH);
    }

    private boolean isAptiPathModule(RDCISubscription subscription) {
        return subscription != null && "APTIPATH".equalsIgnoreCase(nz(subscription.getModuleCode()));
    }

    private boolean isActiveAptiPathSubscription(RDCISubscription subscription) {
        return isAptiPathModule(subscription) && "ACTIVE".equalsIgnoreCase(nz(subscription.getStatus()));
    }

    private boolean hasAptiPathAccess(RDCISubscription subscription) {
        if (isLiveReleaseMode()) {
            return isActiveAptiPathSubscription(subscription);
        }
        return isAptiPathModule(subscription);
    }

    private RDCISubscription resolveLatestAptiPathSubscription(Integer studentUserId) {
        if (studentUserId == null) {
            return null;
        }
        RDCISubscription active = ciSubscriptionService
                .getLatestActiveModuleSubscription(studentUserId, "APTIPATH");
        if (active != null) {
            return active;
        }
        RDCISubscription latest = ciSubscriptionService.getLatestByStudentUserId(studentUserId);
        return isAptiPathModule(latest) ? latest : null;
    }

    private RDCISubscription resolveOrCreateAccessibleSubscription(RDUser student) {
        if (student == null || student.getUserID() == null) {
            return null;
        }
        RDCISubscription subscription = resolveLatestAptiPathSubscription(student.getUserID());
        if (isLiveReleaseMode()) {
            return subscription;
        }
        if (subscription != null) {
            return subscription;
        }
        return ensureBetaSubscription(student);
    }

    private RDCISubscription ensureBetaSubscription(RDUser student) {
        if (student == null || student.getUserID() == null) {
            return null;
        }
        String providerOrderId = "BETA-APTIPATH-STUDENT-" + student.getUserID();
        RDUser parent = resolvePrimaryGuardian(student);
        RDUser parentOrStudent = parent == null ? student : parent;
        try {
            return ciSubscriptionService.recordCheckoutSuccess(
                    parentOrStudent,
                    student,
                    "aptipath-beta",
                    "AptiPath Beta Access",
                    "career",
                    "beta",
                    0,
                    0,
                    0,
                    "0",
                    "BETA",
                    providerOrderId,
                    null,
                    null,
                    null);
        } catch (Exception ex) {
            return null;
        }
    }

    private RDUser resolvePrimaryGuardian(RDUser student) {
        if (student == null) {
            return null;
        }
        if (student.getMom() != null && student.getMom().getUserID() != null) {
            return student.getMom();
        }
        if (student.getDad() != null && student.getDad().getUserID() != null) {
            return student.getDad();
        }
        return null;
    }

    private Map<String, String> loadStudentProfileIntakeAnswers(RDCISubscription subscription) {
        return loadStudentIntakeAnswers(subscription, STUDENT_INTAKE_SECTION_PROFILE);
    }

    private Map<String, String> loadStudentThinkingCompositionAnswers(RDCISubscription subscription) {
        return loadStudentIntakeAnswers(subscription, STUDENT_INTAKE_SECTION_THINKING);
    }

    private Map<String, String> extractAcademicProfileFromIntakeRows(List<RDCIIntakeResponse> intakeRows) {
        if (intakeRows == null || intakeRows.isEmpty()) {
            return Map.of();
        }
        Map<String, String> answers = intakeRows.stream()
                .filter(r -> r != null)
                .filter(r -> "STUDENT".equalsIgnoreCase(nz(r.getRespondentType())))
                .filter(r -> STUDENT_INTAKE_SECTION_PROFILE.equalsIgnoreCase(nz(r.getSectionCode())))
                .filter(r -> r.getQuestionCode() != null)
                .collect(Collectors.toMap(
                        r -> r.getQuestionCode().trim().toUpperCase(Locale.ENGLISH),
                        r -> nz(r.getAnswerValue()),
                        (left, right) -> right,
                        LinkedHashMap::new));
        return extractAcademicProfileFromAnswers(answers);
    }

    private Map<String, String> extractAcademicProfileFromAnswers(Map<String, String> answers) {
        Map<String, String> profile = new LinkedHashMap<>();
        if (answers == null || answers.isEmpty()) {
            return profile;
        }
        putIfNotBlank(profile, "school", answers.get(STUDENT_INTAKE_SCHOOL_CODE));
        putIfNotBlank(profile, "grade", answers.get(STUDENT_INTAKE_GRADE_CODE));
        putIfNotBlank(profile, "board", answers.get(STUDENT_INTAKE_BOARD_CODE));
        putIfNotBlank(profile, "stream", answers.get(STUDENT_INTAKE_STREAM_CODE));
        putIfNotBlank(profile, "subjects", answers.get(STUDENT_INTAKE_SUBJECTS_CODE));
        putIfNotBlank(profile, "program", answers.get(STUDENT_INTAKE_PROGRAM_CODE));
        putIfNotBlank(profile, "yearsLeft", answers.get(STUDENT_INTAKE_YEARS_LEFT_CODE));
        return profile;
    }

    private void putIfNotBlank(Map<String, String> target, String key, String value) {
        if (target == null || key == null) {
            return;
        }
        String cleaned = trimToNull(value);
        if (cleaned != null) {
            target.put(key, cleaned);
        }
    }

    private boolean hasRequiredReportEnrichment(RDCISubscription subscription) {
        if (subscription == null || subscription.getCiSubscriptionId() == null) {
            return false;
        }
        Map<String, String> answers = loadStudentIntakeAnswers(subscription, STUDENT_INTAKE_SECTION_REPORT_ENRICHMENT);
        for (String code : REPORT_ENRICHMENT_CODES) {
            if (trimToNull(answers.get(code)) == null) {
                return false;
            }
        }
        return true;
    }

    private Map<String, String> loadStudentIntakeAnswers(RDCISubscription subscription, String sectionCode) {
        if (subscription == null || subscription.getCiSubscriptionId() == null) {
            return new LinkedHashMap<>();
        }
        List<RDCIIntakeResponse> rows = ciIntakeService.getBySubscriptionId(subscription.getCiSubscriptionId());
        return rows.stream()
                .filter(r -> "STUDENT".equalsIgnoreCase(nz(r.getRespondentType())))
                .filter(r -> nz(sectionCode).equalsIgnoreCase(nz(r.getSectionCode())))
                .filter(r -> r.getQuestionCode() != null)
                .collect(Collectors.toMap(
                        r -> r.getQuestionCode().trim().toUpperCase(Locale.ENGLISH),
                        r -> nz(r.getAnswerValue()),
                        (left, right) -> right,
                        LinkedHashMap::new));
    }

    private boolean hasRequiredStudentProfileIntake(RDCISubscription subscription) {
        if (subscription == null || subscription.getCiSubscriptionId() == null) {
            return false;
        }
        Map<String, String> answers = loadStudentProfileIntakeAnswers(subscription);
        Set<String> answeredCodes = answers.entrySet().stream()
                .filter(e -> !nz(e.getValue()).trim().isEmpty())
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
        if (!answeredCodes.containsAll(REQUIRED_STUDENT_INTAKE_CODES)) {
            return false;
        }
        return hasRequiredSeniorAcademicContext(answers);
    }

    private boolean hasRequiredSeniorAcademicContext(Map<String, String> answers) {
        if (answers == null || answers.isEmpty()) {
            return false;
        }
        String gradeCode = nz(answers.get(STUDENT_INTAKE_GRADE_CODE)).trim().toUpperCase(Locale.ENGLISH);
        if (!isSeniorOrCollegeGrade(gradeCode) && !isPost12Grade(gradeCode)) {
            return true;
        }
        String streamCode = trimToNull(answers.get(STUDENT_INTAKE_STREAM_CODE));
        if (streamCode == null) {
            return false;
        }
        if (isSeniorOrCollegeGrade(gradeCode)) {
            String subjects = trimToNull(answers.get(STUDENT_INTAKE_SUBJECTS_CODE));
            return subjects != null && subjects.length() >= 3;
        }
        String program = trimToNull(answers.get(STUDENT_INTAKE_PROGRAM_CODE));
        String yearsLeft = trimToNull(answers.get(STUDENT_INTAKE_YEARS_LEFT_CODE));
        return program != null && yearsLeft != null;
    }

    private boolean isSeniorOrCollegeGrade(String gradeCode) {
        if (gradeCode == null || gradeCode.isEmpty()) {
            return false;
        }
        switch (gradeCode) {
            case "11":
            case "12":
                return true;
            default:
                return false;
        }
    }

    private boolean isPost12Grade(String gradeCode) {
        if (gradeCode == null || gradeCode.isEmpty()) {
            return false;
        }
        switch (gradeCode) {
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

    private void saveStudentIntakeResponse(Long subscriptionId,
                                           Integer studentUserId,
                                           String questionCode,
                                           String answerValue) {
        saveStudentIntakeResponse(
                subscriptionId,
                studentUserId,
                STUDENT_INTAKE_SECTION_PROFILE,
                questionCode,
                answerValue);
    }

    private void saveStudentIntakeResponse(Long subscriptionId,
                                           Integer studentUserId,
                                           String sectionCode,
                                           String questionCode,
                                           String answerValue) {
        ciIntakeService.saveResponse(
                subscriptionId,
                null,
                studentUserId,
                "STUDENT",
                sectionCode,
                questionCode,
                answerValue,
                null);
    }

    private List<String> resolveReportFollowUpQuestions(Map<String, Object> diagnosticPayload) {
        List<String> fromPayload = parseStringList(
                diagnosticPayload == null ? null : diagnosticPayload.get("aiFollowUpQuestions"));
        List<String> questions = new ArrayList<>();
        for (String question : fromPayload) {
            String cleaned = trimToNull(question);
            if (cleaned != null) {
                questions.add(cleaned);
            }
            if (questions.size() >= REPORT_ENRICHMENT_CODES.size()) {
                break;
            }
        }
        if (questions.size() < REPORT_ENRICHMENT_CODES.size()) {
            List<String> defaults = List.of(
                    "Which top career from this report feels most energizing to you, and why?",
                    "What is one real-life constraint to account for now (time, money, support, confidence)?",
                    "What one measurable commitment will you complete in the next 30 days?");
            for (String q : defaults) {
                if (questions.size() >= REPORT_ENRICHMENT_CODES.size()) {
                    break;
                }
                if (trimToNull(q) != null) {
                    questions.add(q);
                }
            }
        }
        return questions;
    }

    private void applyPrefinalAiEnrichment(RDCIAssessmentSession sessionRow,
                                           RDUser student,
                                           RDCIRecommendationSnapshot recommendation,
                                           Map<String, Object> diagnosticPayload,
                                           List<String> followUpQuestions,
                                           Map<String, String> followUpAnswers) {
        if (aptiPathReportEnrichmentService == null
                || recommendation == null
                || sessionRow == null
                || sessionRow.getCiAssessmentSessionId() == null) {
            return;
        }
        Map<String, Object> payload = diagnosticPayload == null
                ? new LinkedHashMap<>()
                : new LinkedHashMap<>(diagnosticPayload);
        String prefinalStatus = parseStringValue(payload.get("aiPrefinalEnrichmentStatus"));
        if (!prefinalStatus.isEmpty()) {
            return;
        }
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("module", "AptiPath360 Career Discovery");
        context.put("phase", "prefinal_followup");
        context.put("studentUserId", student == null ? null : student.getUserID());
        context.put("sessionId", sessionRow.getCiAssessmentSessionId());
        Map<String, String> academicProfile = extractAcademicProfileFromAnswers(
                loadStudentProfileIntakeAnswers(sessionRow.getSubscription()));
        context.put("academicProfile", academicProfile);
        context.put("planningMode", resolvePlanningModeFromAcademicProfile(academicProfile));
        context.put("planningWindow", resolvePlanningWindowFromAcademicProfile(academicProfile));
        context.put("reportSnapshot", diagnosticPayload == null ? Map.of() : diagnosticPayload);
        context.put("followUpQuestions", followUpQuestions == null ? List.of() : followUpQuestions);
        context.put("followUpAnswers", followUpAnswers == null ? Map.of() : followUpAnswers);

        RDAptiPathReportEnrichmentService.EnrichmentResult enrichment = aptiPathReportEnrichmentService.enrichReport(context);
        payload.put("aiPrefinalEnrichmentApplied", enrichment.isApplied());
        payload.put("aiPrefinalEnrichmentStatus", enrichment.isApplied()
                ? "APPLIED_PREFINAL"
                : "SKIPPED_" + nz(enrichment.getStatus()));
        payload.put("reportFollowUpAnswers", followUpAnswers == null ? Map.of() : followUpAnswers);
        payload.put("academicProfile", academicProfile);
        payload.put("planningMode", resolvePlanningModeFromAcademicProfile(academicProfile));
        payload.put("planningWindow", resolvePlanningWindowFromAcademicProfile(academicProfile));
        if (!enrichment.isApplied()) {
            ciRecommendationService.saveSnapshot(
                    sessionRow.getCiAssessmentSessionId(),
                    nz(recommendation.getRecommendationVersion()).isEmpty() ? ASSESSMENT_VERSION : recommendation.getRecommendationVersion(),
                    recommendation.getStreamFitJson(),
                    toJson(payload, "{}"),
                    recommendation.getPlanAJson(),
                    recommendation.getPlanBJson(),
                    recommendation.getPlanCJson(),
                    recommendation.getSummaryText());
            return;
        }
        if (!enrichment.getSummaryLine().isEmpty()) {
            payload.put("careerSummaryLine", enrichment.getSummaryLine());
        }
        if (!enrichment.getHighlights().isEmpty()) {
            payload.put("encouragementHighlights", enrichment.getHighlights());
        }
        if (!enrichment.getActions().isEmpty()) {
            payload.put("encouragementActions", enrichment.getActions());
        }
        payload.put("aiStudentNarrative", enrichment.getStudentNarrative());
        payload.put("aiParentGuidance", enrichment.getParentGuidance());
        payload.put("aiFollowUpQuestions", enrichment.getFollowUpQuestions());
        payload.put("aiEnrichmentApplied", true);
        payload.put("aiEnrichmentStatus", "APPLIED_PREFINAL");

        String updatedSummary = nz(recommendation.getSummaryText());
        if (!enrichment.getSummaryLine().isEmpty()) {
            updatedSummary = (updatedSummary + " " + enrichment.getSummaryLine()).trim();
        }

        ciRecommendationService.saveSnapshot(
                sessionRow.getCiAssessmentSessionId(),
                nz(recommendation.getRecommendationVersion()).isEmpty() ? ASSESSMENT_VERSION : recommendation.getRecommendationVersion(),
                recommendation.getStreamFitJson(),
                toJson(payload, "{}"),
                recommendation.getPlanAJson(),
                recommendation.getPlanBJson(),
                recommendation.getPlanCJson(),
                updatedSummary);
    }

    private RDCIAssessmentSession resolveOrCreateLiveSession(RDCISubscription subscription, RDUser student) {
        if (subscription == null || subscription.getCiSubscriptionId() == null) {
            throw new IllegalArgumentException("AptiPath subscription is required.");
        }
        RDCIAssessmentSession latest = ciAssessmentSessionService.getLatestByStudentUserId(student.getUserID());
        if (latest == null
                || latest.getSubscription() == null
                || !subscription.getCiSubscriptionId().equals(latest.getSubscription().getCiSubscriptionId())
                || "COMPLETED".equalsIgnoreCase(nz(latest.getStatus()))
                || !ASSESSMENT_VERSION.equalsIgnoreCase(nz(latest.getAssessmentVersion()))) {
            latest = ciAssessmentSessionService.createSession(
                    subscription.getCiSubscriptionId(),
                    student.getUserID(),
                    ASSESSMENT_VERSION);
        }

        if (!"IN_PROGRESS".equalsIgnoreCase(nz(latest.getStatus()))) {
            latest = ciAssessmentSessionService.markInProgress(latest.getCiAssessmentSessionId());
        }
        return latest;
    }

    private RDCIAssessmentSession resolveCompletedSessionForStudent(RDUser student, Long sessionId) {
        if (student == null || student.getUserID() == null) {
            return null;
        }

        if (sessionId != null) {
            RDCIAssessmentSession requested = ciAssessmentSessionService.getById(sessionId);
            if (requested == null
                    || requested.getStudentUser() == null
                    || !student.getUserID().equals(requested.getStudentUser().getUserID())
                    || !isCompletedSession(requested)) {
                return null;
            }
            return requested;
        }

        List<RDCIAssessmentSession> sessions = ciAssessmentSessionService.getByStudentUserId(student.getUserID());
        if (sessions == null || sessions.isEmpty()) {
            return null;
        }
        return sessions.stream()
                .filter(this::isCompletedSession)
                .max(Comparator.comparing(s -> s.getCiAssessmentSessionId() == null ? 0L : s.getCiAssessmentSessionId()))
                .orElse(null);
    }

    private boolean isCompletedSession(RDCIAssessmentSession sessionRow) {
        return sessionRow != null && "COMPLETED".equalsIgnoreCase(nz(sessionRow.getStatus()));
    }

    private Map<String, String> toPersistedFormData(List<RDCIAssessmentResponse> responses) {
        Map<String, String> formData = new LinkedHashMap<>();
        if (responses == null || responses.isEmpty()) {
            return formData;
        }
        for (RDCIAssessmentResponse response : responses) {
            if (response == null || response.getQuestionCode() == null) {
                continue;
            }
            String code = response.getQuestionCode().trim();
            if (code.isEmpty()) {
                continue;
            }
            String answer = trimToNull(response.getSelectedOption());
            if (answer != null) {
                formData.put("Q_" + code, answer);
            }
            String confidence = normalizeConfidence(response.getConfidenceLevel());
            if (confidence != null) {
                formData.put("C_" + code, confidence);
            }
        }
        return formData;
    }

    private Map<String, Object> parseJsonObject(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new LinkedHashMap<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ex) {
            return new LinkedHashMap<>();
        }
    }

    private Map<String, Double> parseDoubleMap(Object raw) {
        Map<String, Double> result = new LinkedHashMap<>();
        if (!(raw instanceof Map)) {
            return result;
        }
        Map<?, ?> source = (Map<?, ?>) raw;
        for (Map.Entry<?, ?> entry : source.entrySet()) {
            if (entry.getKey() == null) {
                continue;
            }
            double value = parseDoubleValue(entry.getValue(), Double.NaN);
            if (!Double.isNaN(value)) {
                result.put(entry.getKey().toString(), round1(value));
            }
        }
        return result;
    }

    private Map<String, Integer> parseIntMap(Object raw) {
        Map<String, Integer> result = new LinkedHashMap<>();
        if (!(raw instanceof Map)) {
            return result;
        }
        Map<?, ?> source = (Map<?, ?>) raw;
        for (Map.Entry<?, ?> entry : source.entrySet()) {
            if (entry.getKey() == null) {
                continue;
            }
            int value = parseIntValue(entry.getValue(), Integer.MIN_VALUE);
            if (value != Integer.MIN_VALUE) {
                result.put(entry.getKey().toString(), value);
            }
        }
        return result;
    }

    private List<String> parseStringList(Object raw) {
        if (!(raw instanceof List)) {
            return List.of();
        }
        List<?> source = (List<?>) raw;
        List<String> result = new ArrayList<>();
        for (Object item : source) {
            String value = parseStringValue(item);
            if (!value.isEmpty()) {
                result.add(value);
            }
        }
        return result;
    }

    private List<Map<String, Object>> parseMapList(Object raw) {
        if (!(raw instanceof List)) {
            return List.of();
        }
        try {
            return objectMapper.convertValue(raw, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IllegalArgumentException ex) {
            return List.of();
        }
    }

    private int parseIntValue(Object raw, int fallback) {
        if (raw == null) {
            return fallback;
        }
        if (raw instanceof Number) {
            return ((Number) raw).intValue();
        }
        if (raw instanceof String) {
            try {
                return Integer.parseInt(((String) raw).trim());
            } catch (NumberFormatException ex) {
                return fallback;
            }
        }
        return fallback;
    }

    private double parseDoubleValue(Object raw, double fallback) {
        if (raw == null) {
            return fallback;
        }
        if (raw instanceof Number) {
            return ((Number) raw).doubleValue();
        }
        if (raw instanceof String) {
            try {
                return Double.parseDouble(((String) raw).trim());
            } catch (NumberFormatException ex) {
                return fallback;
            }
        }
        return fallback;
    }

    private String parseStringValue(Object raw) {
        if (raw == null) {
            return "";
        }
        String value = raw.toString().trim();
        return value.isEmpty() ? "" : value;
    }

    private boolean parseBooleanValue(Object raw, boolean fallback) {
        if (raw == null) {
            return fallback;
        }
        if (raw instanceof Boolean) {
            return (Boolean) raw;
        }
        if (raw instanceof Number) {
            return ((Number) raw).intValue() != 0;
        }
        String value = raw.toString().trim();
        if (value.isEmpty()) {
            return fallback;
        }
        if ("true".equalsIgnoreCase(value) || "yes".equalsIgnoreCase(value) || "1".equals(value)) {
            return true;
        }
        if ("false".equalsIgnoreCase(value) || "no".equalsIgnoreCase(value) || "0".equals(value)) {
            return false;
        }
        return fallback;
    }

    private Map<String, Object> buildAiEnrichmentContext(RDUser student,
                                                         RDCIAssessmentSession sessionRow,
                                                         double assessedAccuracyPercent,
                                                         double overallReadinessScore,
                                                         int careerScore,
                                                         String careerScoreBand,
                                                         String careerSummaryLine,
                                                         Map<String, Double> streamCompetencyFits,
                                                         Map<String, Double> sectionScores,
                                                         List<Map<String, Object>> topCareerMatches,
                                                         List<String> selectedIntentLabels,
                                                         List<String> subjectAffinityInsights,
                                                         List<String> thinkingCompositionInsights,
                                                         List<String> encouragementHighlights,
                                                         List<String> encouragementActions,
                                                         Map<String, String> academicProfile) {
        Map<String, Object> context = new LinkedHashMap<>();
        context.put("module", "AptiPath360 Career Discovery");
        context.put("studentUserId", student == null ? null : student.getUserID());
        context.put("sessionId", sessionRow == null ? null : sessionRow.getCiAssessmentSessionId());
        context.put("assessmentVersion", sessionRow == null ? ASSESSMENT_VERSION : nz(sessionRow.getAssessmentVersion()));
        context.put("assessedAccuracyPercent", round1(assessedAccuracyPercent));
        context.put("overallReadinessScore", round1(overallReadinessScore));
        context.put("careerScore", careerScore);
        context.put("careerScoreBand", nz(careerScoreBand));
        context.put("careerSummaryLine", nz(careerSummaryLine));
        context.put("streamCompetencyFits", streamCompetencyFits == null ? Map.of() : streamCompetencyFits);
        context.put("sectionScores", sectionScores == null ? Map.of() : sectionScores);
        context.put("selectedCareerIntents", selectedIntentLabels == null ? List.of() : selectedIntentLabels);
        context.put("subjectAffinityInsights", subjectAffinityInsights == null ? List.of() : subjectAffinityInsights);
        context.put("thinkingCompositionInsights", thinkingCompositionInsights == null ? List.of() : thinkingCompositionInsights);
        context.put("baselineHighlights", encouragementHighlights == null ? List.of() : encouragementHighlights);
        context.put("baselineActions", encouragementActions == null ? List.of() : encouragementActions);
        context.put("academicProfile", academicProfile == null ? Map.of() : academicProfile);
        context.put("planningMode", resolvePlanningModeFromAcademicProfile(academicProfile));
        context.put("planningWindow", resolvePlanningWindowFromAcademicProfile(academicProfile));
        context.put("topCareerMatches", toLightweightCareerRows(topCareerMatches, 6));
        return context;
    }

    private List<Map<String, Object>> toLightweightCareerRows(List<Map<String, Object>> careers, int limit) {
        if (careers == null || careers.isEmpty()) {
            return List.of();
        }
        List<Map<String, Object>> rows = new ArrayList<>();
        int max = Math.max(1, limit);
        for (Map<String, Object> career : careers) {
            if (rows.size() >= max || career == null || career.isEmpty()) {
                continue;
            }
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("careerCode", parseStringValue(career.get("careerCode")));
            row.put("careerName", parseStringValue(career.get("name")));
            row.put("cluster", parseStringValue(career.get("cluster")));
            row.put("fitScore", round1(parseDoubleValue(career.get("fitScore"), 0.0)));
            row.put("fitBand", parseStringValue(career.get("fitBand")));
            row.put("reason", parseStringValue(career.get("reason")));
            rows.add(row);
        }
        return rows;
    }

    private String resolvePlanningModeFromAcademicProfile(Map<String, String> academicProfile) {
        String grade = academicProfile == null ? "" : nz(academicProfile.get("grade")).trim().toUpperCase(Locale.ENGLISH);
        if (isPost12Grade(grade)) {
            return "IMMEDIATE_2_TO_4_YEARS";
        }
        if (isSeniorOrCollegeGrade(grade)) {
            return "SHORT_TERM_1_TO_2_YEARS";
        }
        return "FOUNDATION_3_TO_8_YEARS";
    }

    private String resolvePlanningWindowFromAcademicProfile(Map<String, String> academicProfile) {
        String mode = resolvePlanningModeFromAcademicProfile(academicProfile);
        switch (mode) {
            case "IMMEDIATE_2_TO_4_YEARS":
                return "90-730 days";
            case "SHORT_TERM_1_TO_2_YEARS":
                return "60-365 days";
            default:
                return "90-1460 days";
        }
    }

    private double metricValue(BigDecimal value, double fallback) {
        if (value == null) {
            return round1(clamp(fallback, 0.0, 100.0));
        }
        return round1(clamp(value.doubleValue(), 0.0, 100.0));
    }

    private int deriveCareerScore(RDCIScoreIndex scoreIndex) {
        double overallFit = metricValue(scoreIndex == null ? null : scoreIndex.getOverallFitScore(), 52.0);
        return computeCareerHealthScore(55.0, overallFit);
    }

    private int computeCareerHealthScore(double assessedAccuracyPercent, double overallFitScore) {
        double assessed = clamp(assessedAccuracyPercent, 0.0, 100.0);
        double overall = clamp(overallFitScore, 0.0, 100.0);
        double composite = clamp((assessed * 0.65) + (overall * 0.35), 0.0, 100.0);
        return (int) Math.round((composite * 6.0) + 300.0);
    }

    private double calibrateFitIndex(double baseFit, double assessedAccuracyPercent) {
        double assessed = clamp(assessedAccuracyPercent, 0.0, 100.0);
        double capped = Math.min(clamp(baseFit, 0.0, 100.0), clamp(assessed + 35.0, 35.0, 100.0));
        return round1(clamp((capped * 0.72) + (assessed * 0.28), 0.0, 100.0));
    }

    private Map<String, Double> calibrateFitMap(Map<String, Double> input, double assessedAccuracyPercent) {
        Map<String, Double> calibrated = new LinkedHashMap<>();
        if (input == null || input.isEmpty()) {
            return calibrated;
        }
        for (Map.Entry<String, Double> entry : input.entrySet()) {
            if (entry.getKey() == null || entry.getValue() == null) {
                continue;
            }
            calibrated.put(entry.getKey(), calibrateFitIndex(entry.getValue(), assessedAccuracyPercent));
        }
        return calibrated;
    }

    private List<Map<String, Object>> calibrateTopCareerMatches(List<Map<String, Object>> careers,
                                                                double assessedAccuracyPercent) {
        if (careers == null || careers.isEmpty()) {
            return List.of();
        }
        List<Map<String, Object>> adjusted = new ArrayList<>();
        for (Map<String, Object> career : careers) {
            if (career == null || career.isEmpty()) {
                continue;
            }
            Map<String, Object> row = new LinkedHashMap<>(career);
            double fit = parseDoubleValue(career.get("fitScore"), Double.NaN);
            if (!Double.isNaN(fit)) {
                double calibratedFit = calibrateFitIndex(fit, assessedAccuracyPercent);
                row.put("fitScore", round1(calibratedFit));
                row.put("fitBand", fitBandLabel(calibratedFit));
            }
            adjusted.add(row);
        }
        adjusted.sort((a, b) -> Double.compare(
                parseDoubleValue(b.get("fitScore"), 0.0),
                parseDoubleValue(a.get("fitScore"), 0.0)));
        return adjusted;
    }

    private List<String> buildScoringMethodNotes(SessionScoreSummary scoreSummary, double overallFitScore) {
        double assessed = scoreSummary == null ? 0.0 : clamp(scoreSummary.getScorePercent(), 0.0, 100.0);
        int attempted = scoreSummary == null ? 0 : scoreSummary.getAttemptedQuestions();
        int total = scoreSummary == null ? 0 : scoreSummary.getTotalQuestions();
        List<String> notes = new ArrayList<>();
        notes.add(String.format(Locale.ENGLISH,
                "Assessed accuracy uses objective correctness: %.1f%% (%d/%d attempted).",
                assessed,
                attempted,
                total));
        notes.add(String.format(Locale.ENGLISH,
                "Career Health Score uses 65%% assessed accuracy + 35%% overall readiness (current readiness %.1f/100).",
                clamp(overallFitScore, 0.0, 100.0)));
        notes.add("IIT/NEET/CAT/LAW values are readiness-fit indicators, not predicted exam score/rank.");
        notes.add("Competitive-stream fit now requires domain evidence from STEM, Biology, General Awareness, and Reasoning-IQ sections.");
        notes.add("When subject-affinity survey inputs are missing, neutral baseline (50/100) is used instead of optimistic defaults.");
        return notes;
    }

    private String validateThinkingComposition(Map<String, String> formData) {
        if (formData == null || formData.isEmpty()) {
            return "Please complete Story Insight section before submit.";
        }
        String summary = trimToNull(formData.get("THINK_STORY_SUMMARY"));
        String decision = trimToNull(formData.get("THINK_STORY_DECISION"));
        String action = trimToNull(formData.get("THINK_STORY_ACTION"));
        if (summary == null || decision == null || action == null) {
            return "Please answer all Story Insight questions before submit.";
        }
        if (summary.length() < 35 || decision.length() < 35 || action.length() < 35) {
            return "Story Insight responses should be meaningful (minimum 35 characters each).";
        }
        return null;
    }

    private Map<String, String> extractStudentThinkingCompositionAnswers(List<RDCIIntakeResponse> intakeRows) {
        if (intakeRows == null || intakeRows.isEmpty()) {
            return new LinkedHashMap<>();
        }
        return intakeRows.stream()
                .filter(r -> r != null)
                .filter(r -> "STUDENT".equalsIgnoreCase(nz(r.getRespondentType())))
                .filter(r -> STUDENT_INTAKE_SECTION_THINKING.equalsIgnoreCase(nz(r.getSectionCode())))
                .filter(r -> r.getQuestionCode() != null)
                .collect(Collectors.toMap(
                        r -> r.getQuestionCode().trim().toUpperCase(Locale.ENGLISH),
                        r -> nz(r.getAnswerValue()),
                        (left, right) -> right,
                        LinkedHashMap::new));
    }

    private List<Map<String, String>> buildThinkingCompositionSnapshots(Map<String, String> answers) {
        if (answers == null || answers.isEmpty()) {
            return List.of();
        }
        List<Map<String, String>> snapshots = new ArrayList<>();
        addThinkingSnapshot(snapshots, "Core Challenge Noticed", answers.get("S_STORY_SUMMARY_01"));
        addThinkingSnapshot(snapshots, "Decision Logic", answers.get("S_STORY_DECISION_01"));
        addThinkingSnapshot(snapshots, "Action Plan", answers.get("S_STORY_ACTION_01"));
        return snapshots;
    }

    private void addThinkingSnapshot(List<Map<String, String>> snapshots, String label, String response) {
        String cleaned = trimToNull(response);
        if (snapshots == null || cleaned == null) {
            return;
        }
        Map<String, String> row = new LinkedHashMap<>();
        row.put("label", nz(label));
        row.put("response", clipText(cleaned, 260));
        snapshots.add(row);
    }

    private List<String> buildThinkingCompositionInsights(Map<String, String> answers) {
        if (answers == null || answers.isEmpty()) {
            return List.of("Story-based thinking insight is not available for this report.");
        }
        String summary = nz(answers.get("S_STORY_SUMMARY_01"));
        String decision = nz(answers.get("S_STORY_DECISION_01"));
        String action = nz(answers.get("S_STORY_ACTION_01"));
        String merged = (summary + " " + decision + " " + action).toLowerCase(Locale.ENGLISH);
        int wordCount = merged.trim().isEmpty() ? 0 : merged.trim().split("\\s+").length;

        int reasoningSignals = keywordHits(merged, List.of("because", "therefore", "hence", "if", "then", "so that"));
        int planningSignals = keywordHits(merged, List.of("plan", "step", "schedule", "timeline", "revise", "practice", "strategy"));
        int growthSignals = keywordHits(merged, List.of("learn", "improve", "mistake", "feedback", "retry", "discipline", "consisten"));
        int supportSignals = keywordHits(merged, List.of("mentor", "teacher", "parent", "friend", "team", "support"));

        double depthScore = clamp((wordCount * 0.22) + (reasoningSignals * 5.0) + (planningSignals * 5.5), 0.0, 100.0);
        double selfRegScore = clamp(40.0 + (growthSignals * 6.0) + (supportSignals * 4.0) + (planningSignals * 3.0), 0.0, 100.0);

        String decisionStyle = depthScore >= 70 ? "Structured and evidence-oriented"
                : depthScore >= 50 ? "Partially structured, needs stronger reasoning"
                : "Reactive; needs guided thinking scaffolds";
        String selfRegStyle = selfRegScore >= 70 ? "Strong self-regulation and growth orientation"
                : selfRegScore >= 50 ? "Moderate self-regulation; can improve planning discipline"
                : "Needs support in emotional regulation and execution consistency";

        List<String> insights = new ArrayList<>();
        insights.add(String.format(Locale.ENGLISH,
                "Narrative depth: %d words captured. Decision maturity signal: %s.",
                wordCount,
                decisionStyle));
        insights.add(String.format(Locale.ENGLISH,
                "Planning cues detected: %d, reasoning cues: %d. This indicates %s.",
                planningSignals,
                reasoningSignals,
                decisionStyle.toLowerCase(Locale.ENGLISH)));
        insights.add(String.format(Locale.ENGLISH,
                "Self-regulation signal: %s (growth cues: %d, support cues: %d).",
                selfRegStyle,
                growthSignals,
                supportSignals));
        insights.add("Use this as a guidance signal, not a clinical or diagnostic judgment.");
        return insights;
    }

    private int keywordHits(String text, List<String> keywords) {
        if (text == null || text.isEmpty() || keywords == null || keywords.isEmpty()) {
            return 0;
        }
        int hits = 0;
        for (String keyword : keywords) {
            if (keyword != null && !keyword.isEmpty() && text.contains(keyword.toLowerCase(Locale.ENGLISH))) {
                hits++;
            }
        }
        return hits;
    }

    private double estimateMentalPreparedness(double examReadiness, double alignment, double wellbeingRisk) {
        return round1(clamp(
                (examReadiness * 0.45)
                        + ((100.0 - wellbeingRisk) * 0.35)
                        + (alignment * 0.20),
                0.0,
                100.0));
    }

    private Map<String, Double> buildStreamFitIndices(Map<String, Double> streamFitPayload, RDCIScoreIndex scoreIndex) {
        Map<String, Double> result = new LinkedHashMap<>();
        double aptitude = metricValue(scoreIndex == null ? null : scoreIndex.getAptitudeScore(), 55.0);
        double interest = metricValue(scoreIndex == null ? null : scoreIndex.getInterestScore(), 55.0);
        double examReadiness = metricValue(scoreIndex == null ? null : scoreIndex.getExamReadinessIndex(), 55.0);
        double alignment = metricValue(scoreIndex == null ? null : scoreIndex.getAlignmentIndex(), 55.0);
        result.put("IIT", round1(streamFitPayload.getOrDefault("iit", aptitude)));
        result.put("NEET", round1(streamFitPayload.getOrDefault("neet", (aptitude * 0.60) + (examReadiness * 0.40))));
        result.put("CAT", round1(streamFitPayload.getOrDefault("cat", (aptitude * 0.40) + (examReadiness * 0.35) + (alignment * 0.25))));
        result.put("LAW", round1(streamFitPayload.getOrDefault("law", (interest * 0.45) + (alignment * 0.30) + (examReadiness * 0.25))));
        return result;
    }

    private Map<String, Double> inferStreamCompetencyFits(RDCIScoreIndex scoreIndex, Map<String, Double> sectionScores) {
        double aptitude = metricValue(scoreIndex == null ? null : scoreIndex.getAptitudeScore(),
                sectionScores == null ? 55.0 : sectionScores.getOrDefault("CORE_APTITUDE", 55.0));
        double interest = metricValue(scoreIndex == null ? null : scoreIndex.getInterestScore(),
                sectionScores == null ? 55.0 : sectionScores.getOrDefault("INTEREST_WORK", 55.0));
        double examReadiness = metricValue(scoreIndex == null ? null : scoreIndex.getExamReadinessIndex(),
                sectionScores == null ? 55.0 : sectionScores.getOrDefault("LEARNING_BEHAVIOR", 55.0));
        double aiReadiness = metricValue(scoreIndex == null ? null : scoreIndex.getAiReadinessIndex(),
                sectionScores == null ? 55.0 : sectionScores.getOrDefault("AI_READINESS", 55.0));
        double alignment = metricValue(scoreIndex == null ? null : scoreIndex.getAlignmentIndex(), 55.0);
        double wellbeingRisk = metricValue(scoreIndex == null ? null : scoreIndex.getWellbeingRiskIndex(), 45.0);

        Map<String, Double> inferred = new LinkedHashMap<>();
        inferred.put("STEM Competency", round1(clamp((aptitude * 0.45) + (examReadiness * 0.30) + (aiReadiness * 0.25), 0.0, 100.0)));
        inferred.put("Medical Competency", round1(clamp((interest * 0.34) + (examReadiness * 0.36) + ((100.0 - wellbeingRisk) * 0.30), 0.0, 100.0)));
        inferred.put("Commerce Competency", round1(clamp((aptitude * 0.30) + (alignment * 0.25) + (examReadiness * 0.25) + (aiReadiness * 0.20), 0.0, 100.0)));
        inferred.put("Humanities Competency", round1(clamp((interest * 0.42) + (alignment * 0.32) + ((100.0 - wellbeingRisk) * 0.26), 0.0, 100.0)));
        return inferred;
    }

    private Map<String, Double> inferEmergingClusterFits(Map<String, Double> streamFitPayload) {
        Map<String, Double> inferred = new LinkedHashMap<>();
        inferred.put("Robotics and Automation", round1(streamFitPayload.getOrDefault("robotics", 55.0)));
        inferred.put("Space and Aerospace Systems", round1(streamFitPayload.getOrDefault("space", 54.0)));
        inferred.put("Drone and Autonomous Systems", round1(streamFitPayload.getOrDefault("drone", 54.0)));
        inferred.put("AI Systems and Applied ML", round1(streamFitPayload.getOrDefault("ai_systems", 56.0)));
        inferred.put("Biotech and Health Innovation", round1(streamFitPayload.getOrDefault("biotech", 53.0)));
        inferred.put("Climate and Sustainability Tech", round1(streamFitPayload.getOrDefault("climate_tech", 53.0)));
        inferred.put("Product, UX, and Design Systems", round1(streamFitPayload.getOrDefault("product_design", 52.0)));
        inferred.put("Entrepreneurship and Venture Paths", round1(streamFitPayload.getOrDefault("entrepreneurship", 52.0)));
        inferred.put("Policy, Law, and Public Impact", round1(streamFitPayload.getOrDefault("public_impact", 52.0)));
        return inferred;
    }

    private Map<String, Integer> defaultSubjectSignals() {
        Map<String, Integer> subjectSignals = new LinkedHashMap<>();
        subjectSignals.put("math", 0);
        subjectSignals.put("physics", 0);
        subjectSignals.put("chemistry", 0);
        subjectSignals.put("biology", 0);
        subjectSignals.put("language", 0);
        return subjectSignals;
    }

    private Map<String, Integer> defaultStudentSelfSignals() {
        Map<String, Integer> selfSignals = new LinkedHashMap<>();
        selfSignals.put("numeric", 0);
        selfSignals.put("language", 0);
        selfSignals.put("discipline", 0);
        selfSignals.put("spatial", 0);
        return selfSignals;
    }

    private Map<String, Double> toSectionScoreDisplayMap(Map<String, Double> sectionScores) {
        Map<String, Double> display = new LinkedHashMap<>();
        if (sectionScores == null || sectionScores.isEmpty()) {
            return display;
        }
        List<String> order = List.of(
                "CORE_APTITUDE",
                "APPLIED_CHALLENGE",
                "INTEREST_WORK",
                "VALUES_MOTIVATION",
                "LEARNING_BEHAVIOR",
                "AI_READINESS",
                "CAREER_REALITY");
        for (String sectionCode : order) {
            if (sectionScores.containsKey(sectionCode)) {
                display.put(sectionLabel(sectionCode), sectionScores.get(sectionCode));
            }
        }
        for (Map.Entry<String, Double> entry : sectionScores.entrySet()) {
            if (entry.getKey() == null || display.containsKey(sectionLabel(entry.getKey()))) {
                continue;
            }
            display.put(sectionLabel(entry.getKey()), entry.getValue());
        }
        return display;
    }

    private Map<String, Integer> toSubjectSignalDisplayMap(Map<String, Integer> subjectAffinitySignals) {
        Map<String, Integer> display = new LinkedHashMap<>();
        int math = subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("math", 0);
        int physics = subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("physics", 0);
        int chemistry = subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("chemistry", 0);
        int biology = subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("biology", 0);
        int language = subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("language", 0);
        display.put("Math Affinity", clampSignal(math));
        display.put("Physics Affinity", clampSignal(physics));
        display.put("Chemistry Affinity", clampSignal(chemistry));
        display.put("Biology Affinity", clampSignal(biology));
        display.put("Communication Affinity", clampSignal(language));
        return display;
    }

    private int clampSignal(int value) {
        if (value < 0) {
            return 0;
        }
        if (value > 5) {
            return 5;
        }
        return value;
    }

    private String planSummaryText(String planJson, String fallback) {
        Map<String, Object> plan = parseJsonObject(planJson);
        String title = parseStringValue(plan.get("path"));
        if (title.isEmpty()) {
            title = parseStringValue(plan.get("title"));
        }
        String nextStep = parseStringValue(plan.get("next_step"));
        if (nextStep.isEmpty()) {
            nextStep = parseStringValue(plan.get("nextStep"));
        }
        if (title.isEmpty() && nextStep.isEmpty()) {
            return fallback;
        }
        if (nextStep.isEmpty()) {
            return title;
        }
        if (title.isEmpty()) {
            return nextStep;
        }
        return title + ": " + nextStep;
    }

    private RDCIRecommendationSnapshot buildFallbackRecommendation(SessionScoreSummary scoreSummary,
                                                                   int careerScore,
                                                                   String careerScoreBand,
                                                                   String careerSummaryLine) {
        RDCIRecommendationSnapshot fallback = new RDCIRecommendationSnapshot();
        String summary = buildRecommendationSummary(scoreSummary)
                + " Career score "
                + careerScore
                + " ("
                + careerScoreBand
                + "). "
                + (careerSummaryLine == null ? "" : careerSummaryLine);
        fallback.setSummaryText(summary.trim());
        fallback.setPlanAJson(toJson(Map.of(
                "title", "Primary Path",
                "path", "Core Strength Track",
                "next_step", "Continue structured practice with weekly review"), "{}"));
        fallback.setPlanBJson(toJson(Map.of(
                "title", "Adjacent Path",
                "path", "Parallel Exploration Track",
                "next_step", "Run one guided project every two weeks"), "{}"));
        fallback.setPlanCJson(toJson(Map.of(
                "title", "Exploratory Path",
                "path", "Discovery Track",
                "next_step", "Sample low-risk options before long-term lock-in"), "{}"));
        fallback.setStreamFitJson("{}");
        fallback.setCareerClustersJson("{}");
        return fallback;
    }

    private String resolveBaseUrl(HttpServletRequest request) {
        int port = request.getServerPort();
        boolean defaultPort = ("http".equalsIgnoreCase(request.getScheme()) && port == 80)
                || ("https".equalsIgnoreCase(request.getScheme()) && port == 443);
        return request.getScheme()
                + "://"
                + request.getServerName()
                + (defaultPort ? "" : ":" + port)
                + request.getContextPath()
                + "/";
    }

    private Integer toInteger(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.valueOf(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String buildRecommendationSummary(SessionScoreSummary summary) {
        int attempted = summary == null ? 0 : summary.getAttemptedQuestions();
        int total = summary == null ? 0 : summary.getTotalQuestions();
        double percent = summary == null ? 0D : summary.getScorePercent();
        return String.format(Locale.ENGLISH,
                "Assessment complete. You attempted %d/%d questions with assessed accuracy of %.1f%%.",
                attempted,
                total,
                percent);
    }

    private List<String> buildEncouragementHighlights(double scorePercent,
                                                      double mentalPreparednessIndex,
                                                      double aiReadinessIndex,
                                                      double examReadinessIndex,
                                                      double wellbeingRiskIndex,
                                                      Map<String, Double> emergingClusterFits) {
        List<String> highlights = new ArrayList<>();
        if (scorePercent >= 75) {
            highlights.add("Strong baseline established. Your current score trend supports advanced pathways.");
        } else if (scorePercent >= 60) {
            highlights.add("Solid foundation detected. With disciplined practice, you can move to higher readiness bands.");
        } else {
            highlights.add("Good starting point. Early improvement here can create major gains in the next 6-8 weeks.");
        }

        if (mentalPreparednessIndex >= 70) {
            highlights.add("Mental preparedness is a clear strength. You are showing resilience under pressure.");
        } else if (mentalPreparednessIndex >= 55) {
            highlights.add("Mental preparedness is developing well. Small routine upgrades will unlock better consistency.");
        } else {
            highlights.add("Mental preparedness needs support now. Structured routines can quickly stabilize performance.");
        }

        if (aiReadinessIndex >= 70) {
            highlights.add("AI-era readiness is high. You can leverage modern tools effectively with critical verification.");
        } else {
            highlights.add("AI usage potential is visible. Better prompt and verification habits will create faster growth.");
        }

        if (examReadinessIndex >= 70) {
            highlights.add("Exam readiness signals are strong and can sustain competitive preparation.");
        } else {
            highlights.add("Exam readiness can improve quickly through timed drills and weekly error correction.");
        }

        if (wellbeingRiskIndex >= 65) {
            highlights.add("Pressure signals are high currently. Proactive wellbeing routines will protect long-term outcomes.");
        } else {
            highlights.add("Pressure risk is controlled. Continue balancing intensity with recovery.");
        }

        List<String> topClusters = topCareerClusters(emergingClusterFits, 2);
        if (!topClusters.isEmpty()) {
            highlights.add("Top future-fit potential currently aligns with: " + String.join(" and ", topClusters) + ".");
        }
        return highlights;
    }

    private List<String> buildEncouragementActions(double examReadinessIndex,
                                                   double aiReadinessIndex,
                                                   double wellbeingRiskIndex,
                                                   double alignmentIndex,
                                                   Map<String, Double> emergingClusterFits) {
        List<String> actions = new ArrayList<>();
        actions.add("Next 14 days: keep one fixed daily focus slot and close each day with a 5-minute reflection.");

        if (examReadinessIndex < 65) {
            actions.add("Use a 45-10 study cycle and run one timed section practice daily with error-log review.");
        } else {
            actions.add("Maintain momentum: run 2-3 timed mixed-topic tests per week and track weak areas.");
        }

        if (aiReadinessIndex < 65) {
            actions.add("For AI tools, ask for stepwise reasoning and verify every final answer with trusted sources.");
        } else {
            actions.add("Use AI as a mentor assistant: draft, challenge, and refine instead of copy-paste usage.");
        }

        if (wellbeingRiskIndex >= 65) {
            actions.add("Before each session, run a 3-minute calm-start routine and avoid stress-driven random study.");
        }

        if (alignmentIndex < 65) {
            actions.add("Parent-student sync: set one weekly 20-minute review meeting on goals, workload, and confidence.");
        }

        List<String> topClusters = topCareerClusters(emergingClusterFits, 1);
        if (!topClusters.isEmpty()) {
            actions.add("Build one mini-project or exploration task this month in: " + topClusters.get(0) + ".");
        }
        return actions;
    }

    private List<String> topCareerClusters(Map<String, Double> emergingClusterFits, int limit) {
        if (emergingClusterFits == null || emergingClusterFits.isEmpty() || limit <= 0) {
            return List.of();
        }
        return emergingClusterFits.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> buildCareerUniverseFits(double aptitudeScore,
                                                              double interestScore,
                                                              double examReadinessIndex,
                                                              double aiReadinessIndex,
                                                              double mentalPreparednessIndex,
                                                              double alignmentIndex,
                                                              double wellbeingRiskIndex,
                                                              double parentContextScore,
                                                              Map<String, Double> sectionScores,
                                                              double iitFitIndex,
                                                              double neetFitIndex,
                                                              double catFitIndex,
                                                              double lawFitIndex,
                                                              double roboticsFitIndex,
                                                              double spaceTechFitIndex,
                                                              double droneAutonomyFitIndex,
                                                              double aiSystemsFitIndex,
                                                              double biotechFitIndex,
                                                              double climateTechFitIndex,
                                                              double productDesignFitIndex,
                                                              double entrepreneurialFitIndex,
                                                              double publicImpactFitIndex,
                                                              List<String> selectedCareerIntents,
                                                              Map<String, Integer> studentSelfSignals,
                                                              Map<String, Integer> subjectAffinitySignals,
                                                              double assessedAccuracyPercent,
                                                              Map<String, String> academicProfile) {
        Map<String, Double> clusterScores = new LinkedHashMap<>();
        clusterScores.put("Engineering & Core Technology", clamp(iitFitIndex, 0.0, 100.0));
        clusterScores.put("Medical & Clinical Pathways", clamp(neetFitIndex, 0.0, 100.0));
        clusterScores.put("Allied Health & Care", clamp((neetFitIndex * 0.42) + (mentalPreparednessIndex * 0.24) + (interestScore * 0.20) + (examReadinessIndex * 0.14), 0.0, 100.0));
        clusterScores.put("Biotech & Life Sciences", clamp(biotechFitIndex, 0.0, 100.0));
        clusterScores.put("Computer Science & AI", clamp(aiSystemsFitIndex, 0.0, 100.0));
        clusterScores.put("Data, Analytics & FinTech", clamp((catFitIndex * 0.36) + (aptitudeScore * 0.28) + (aiReadinessIndex * 0.24) + (examReadinessIndex * 0.12), 0.0, 100.0));
        clusterScores.put("Cybersecurity & Digital Trust", clamp((aiReadinessIndex * 0.34) + (aptitudeScore * 0.32) + (examReadinessIndex * 0.20) + (mentalPreparednessIndex * 0.14), 0.0, 100.0));
        clusterScores.put("Design, UX & Creative Technology", clamp(productDesignFitIndex, 0.0, 100.0));
        clusterScores.put("Architecture & Built Environment", clamp((aptitudeScore * 0.36) + (interestScore * 0.26) + (examReadinessIndex * 0.20) + (alignmentIndex * 0.18), 0.0, 100.0));
        clusterScores.put("Law, Policy & Governance", clamp(lawFitIndex, 0.0, 100.0));
        clusterScores.put("Business, Commerce & Management", clamp((catFitIndex * 0.44) + (interestScore * 0.20) + (alignmentIndex * 0.18) + (mentalPreparednessIndex * 0.18), 0.0, 100.0));
        clusterScores.put("Economics, Finance & Accounting", clamp((catFitIndex * 0.46) + (aptitudeScore * 0.28) + (examReadinessIndex * 0.16) + (alignmentIndex * 0.10), 0.0, 100.0));
        clusterScores.put("Marketing, Media & Communication", clamp((interestScore * 0.42) + (alignmentIndex * 0.24) + (mentalPreparednessIndex * 0.18) + (aiReadinessIndex * 0.16), 0.0, 100.0));
        clusterScores.put("Education, Psychology & Guidance", clamp((interestScore * 0.36) + (mentalPreparednessIndex * 0.26) + (alignmentIndex * 0.20) + (examReadinessIndex * 0.18), 0.0, 100.0));
        clusterScores.put("Humanities, Languages & Social Impact", clamp((interestScore * 0.38) + (alignmentIndex * 0.24) + (mentalPreparednessIndex * 0.22) + ((100.0 - wellbeingRiskIndex) * 0.16), 0.0, 100.0));
        clusterScores.put("Aviation & Aerospace", clamp((spaceTechFitIndex * 0.42) + (examReadinessIndex * 0.24) + (mentalPreparednessIndex * 0.18) + (alignmentIndex * 0.16), 0.0, 100.0));
        clusterScores.put("Defense & Public Safety", clamp((aptitudeScore * 0.30) + (examReadinessIndex * 0.30) + (mentalPreparednessIndex * 0.24) + ((100.0 - wellbeingRiskIndex) * 0.16), 0.0, 100.0));
        clusterScores.put("Agriculture & Food Systems", clamp((interestScore * 0.34) + (alignmentIndex * 0.22) + (examReadinessIndex * 0.22) + (parentContextScore * 0.22), 0.0, 100.0));
        clusterScores.put("Environmental & Climate Systems", clamp(climateTechFitIndex, 0.0, 100.0));
        clusterScores.put("Hospitality, Travel & Service", clamp((interestScore * 0.36) + (alignmentIndex * 0.22) + (mentalPreparednessIndex * 0.22) + ((100.0 - wellbeingRiskIndex) * 0.20), 0.0, 100.0));
        clusterScores.put("Logistics & Supply Chain", clamp((aptitudeScore * 0.34) + (examReadinessIndex * 0.24) + (alignmentIndex * 0.24) + (aiReadinessIndex * 0.18), 0.0, 100.0));
        clusterScores.put("Entrepreneurship & Venture", clamp(entrepreneurialFitIndex, 0.0, 100.0));
        clusterScores.put("Skilled Trades & Applied Vocational", clamp((interestScore * 0.30) + (parentContextScore * 0.26) + (alignmentIndex * 0.22) + (aptitudeScore * 0.22), 0.0, 100.0));
        clusterScores.put("Sports, Fitness & Wellness", clamp((interestScore * 0.34) + (mentalPreparednessIndex * 0.26) + (examReadinessIndex * 0.22) + ((100.0 - wellbeingRiskIndex) * 0.18), 0.0, 100.0));
        clusterScores.put("Robotics, Drones & Autonomous Systems", clamp((roboticsFitIndex * 0.45) + (droneAutonomyFitIndex * 0.25) + (aiReadinessIndex * 0.16) + (examReadinessIndex * 0.14), 0.0, 100.0));
        List<RDCICareerAdjustment> adjustmentCatalog = ciCareerMappingService
                .getActiveAdjustments("APTIPATH", ASSESSMENT_VERSION);
        boolean dbAdjusted = applyCatalogAdjustments(
                clusterScores,
                selectedCareerIntents,
                studentSelfSignals,
                subjectAffinitySignals,
                adjustmentCatalog);
        if (!dbAdjusted) {
            applyIntentBoosts(clusterScores, selectedCareerIntents);
            applySelfSignalAdjustments(clusterScores, studentSelfSignals);
            applySubjectAffinityAdjustments(clusterScores, subjectAffinitySignals);
        }
        for (Map.Entry<String, Double> entry : new ArrayList<>(clusterScores.entrySet())) {
            clusterScores.put(entry.getKey(), clamp(entry.getValue(), 0.0, 100.0));
        }
        for (Map.Entry<String, Double> entry : new ArrayList<>(clusterScores.entrySet())) {
            clusterScores.put(entry.getKey(), calibrateFitIndex(entry.getValue(), assessedAccuracyPercent));
        }

        Map<String, List<String>> clusterRoles = new LinkedHashMap<>();
        clusterRoles.put("Engineering & Core Technology", List.of(
                "Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Chemical Engineer", "Materials Engineer",
                "Industrial Engineer", "Instrumentation Engineer", "Production Engineer", "Automotive Engineer", "Energy Systems Engineer"));
        clusterRoles.put("Medical & Clinical Pathways", List.of(
                "MBBS Doctor", "Dentist", "BAMS Physician", "BHMS Physician", "Veterinary Doctor",
                "Surgeon (Long-term Track)", "Pediatrician (Long-term Track)", "Dermatology Specialist (Long-term Track)", "Anesthesiologist (Long-term Track)", "Emergency Medicine Specialist"));
        clusterRoles.put("Allied Health & Care", List.of(
                "Physiotherapist", "Nurse", "Occupational Therapist", "Speech and Language Therapist", "Medical Lab Technologist",
                "Radiology Technologist", "Optometrist", "Dialysis Technologist", "Nutrition and Dietetics Specialist", "Public Health Educator"));
        clusterRoles.put("Biotech & Life Sciences", List.of(
                "Biotechnologist", "Microbiologist", "Genetic Counselor", "Bioinformatics Analyst", "Clinical Research Associate",
                "Molecular Biology Scientist", "Pharmaceutical Scientist", "Neuroscience Researcher", "Biomedical Data Analyst", "Life Science Product Specialist"));
        clusterRoles.put("Computer Science & AI", List.of(
                "Software Engineer", "AI/ML Engineer", "Full Stack Developer", "Backend Engineer", "Mobile App Developer",
                "Cloud Application Engineer", "NLP Engineer", "Computer Vision Engineer", "AI Product Engineer", "MLOps Engineer"));
        clusterRoles.put("Data, Analytics & FinTech", List.of(
                "Data Analyst", "Data Scientist", "Business Intelligence Analyst", "Quantitative Analyst", "Financial Data Analyst",
                "Risk Analytics Specialist", "FinTech Product Analyst", "Credit Analytics Associate", "Pricing Analyst", "Decision Science Associate"));
        clusterRoles.put("Cybersecurity & Digital Trust", List.of(
                "Cybersecurity Analyst", "Security Operations Analyst", "Ethical Hacker", "Cloud Security Engineer", "Digital Forensics Analyst",
                "Threat Intelligence Analyst", "GRC Risk Analyst", "Identity and Access Specialist", "Security Compliance Associate", "Privacy Analyst"));
        clusterRoles.put("Design, UX & Creative Technology", List.of(
                "UX Designer", "UI Designer", "Product Designer", "Interaction Designer", "Graphic Designer",
                "Motion Graphics Designer", "Game UI Designer", "AR/VR Experience Designer", "Design Researcher", "Creative Technologist"));
        clusterRoles.put("Architecture & Built Environment", List.of(
                "Architect", "Interior Designer", "Urban Planner", "Landscape Architect", "Construction Project Planner",
                "Structural Designer", "BIM Specialist", "Sustainable Building Consultant", "Quantity Surveyor", "Smart City Planner"));
        clusterRoles.put("Law, Policy & Governance", List.of(
                "Corporate Lawyer", "Litigation Lawyer", "Legal Analyst", "Policy Research Associate", "Civil Services Officer",
                "Judicial Services Aspirant", "Compliance Officer", "Cyber Law Specialist", "Public Policy Consultant", "International Relations Analyst"));
        clusterRoles.put("Business, Commerce & Management", List.of(
                "Business Analyst", "Operations Manager", "HR Manager", "Sales Strategy Associate", "Supply Chain Manager",
                "Retail Manager", "Program Manager", "Project Coordinator", "Management Consultant", "Product Manager"));
        clusterRoles.put("Economics, Finance & Accounting", List.of(
                "Chartered Accountant", "Cost Accountant", "Company Secretary", "Investment Analyst", "Equity Research Associate",
                "Banking Specialist", "Treasury Analyst", "Financial Planner", "Tax Consultant", "Actuarial Analyst"));
        clusterRoles.put("Marketing, Media & Communication", List.of(
                "Digital Marketing Specialist", "Brand Manager", "Social Media Strategist", "Content Strategist", "Public Relations Executive",
                "Advertising Copywriter", "Market Research Analyst", "Communication Specialist", "Journalist", "Media Planner"));
        clusterRoles.put("Education, Psychology & Guidance", List.of(
                "School Teacher", "Subject Mentor", "Instructional Designer", "Educational Counselor", "Clinical Psychologist",
                "School Psychologist", "Special Educator", "Career Counselor", "Learning Experience Designer", "Education Program Manager"));
        clusterRoles.put("Humanities, Languages & Social Impact", List.of(
                "Linguist", "Historian", "Sociologist", "Development Studies Researcher", "NGO Program Associate",
                "Community Development Officer", "International Development Analyst", "Public Communication Writer", "Social Research Analyst", "Cultural Studies Specialist"));
        clusterRoles.put("Aviation & Aerospace", List.of(
                "Commercial Pilot", "Air Traffic Controller", "Flight Dispatcher", "Cabin Crew Professional", "Airport Operations Specialist",
                "Aircraft Maintenance Engineer", "Aerospace Engineer", "Avionics Engineer", "Ground Safety Officer", "Airline Revenue Analyst"));
        clusterRoles.put("Defense & Public Safety", List.of(
                "Armed Forces Officer", "Navy Officer", "Air Force Officer", "Coast Guard Officer", "Police Service Officer",
                "Disaster Management Specialist", "Intelligence Analyst", "Fire and Safety Officer", "Homeland Security Analyst", "Emergency Response Planner"));
        clusterRoles.put("Agriculture & Food Systems", List.of(
                "Agronomist", "Agricultural Engineer", "Food Technologist", "Dairy Technologist", "Fisheries Scientist",
                "Horticulture Specialist", "Soil Scientist", "Agri Business Manager", "Precision Farming Analyst", "Agri Supply Chain Specialist"));
        clusterRoles.put("Environmental & Climate Systems", List.of(
                "Environmental Scientist", "Climate Risk Analyst", "Sustainability Consultant", "Renewable Energy Analyst", "Carbon Accounting Specialist",
                "Waste Management Specialist", "Water Resource Planner", "ESG Reporting Analyst", "Conservation Biologist", "Climate Policy Associate"));
        clusterRoles.put("Hospitality, Travel & Service", List.of(
                "Hotel Manager", "Hospitality Operations Executive", "Tourism Specialist", "Event Manager", "Culinary Professional",
                "Travel Consultant", "Customer Experience Manager", "Aviation Hospitality Specialist", "Luxury Services Associate", "Resort Operations Manager"));
        clusterRoles.put("Logistics & Supply Chain", List.of(
                "Logistics Planner", "Warehouse Operations Specialist", "Procurement Analyst", "Distribution Manager", "Shipping Coordinator",
                "Freight Operations Specialist", "Inventory Analyst", "E-commerce Fulfillment Manager", "Transport Planner", "Global Trade Associate"));
        clusterRoles.put("Entrepreneurship & Venture", List.of(
                "Startup Founder", "Startup Operations Lead", "Product Venture Associate", "Growth Marketing Lead", "Business Development Manager",
                "Innovation Program Associate", "Venture Analyst", "Entrepreneur in Residence", "New Business Incubator Associate", "Small Business Owner"));
        clusterRoles.put("Skilled Trades & Applied Vocational", List.of(
                "CNC Programmer", "EV Service Technician", "Solar PV Technician", "Industrial Electrician", "Mechatronics Technician",
                "Robotics Maintenance Technician", "Drone Service Technician", "HVAC Technician", "Welding Specialist", "Automotive Service Advisor"));
        clusterRoles.put("Sports, Fitness & Wellness", List.of(
                "Sports Coach", "Fitness Trainer", "Sports Physiologist", "Performance Analyst", "Strength and Conditioning Specialist",
                "Yoga and Wellness Coach", "Sports Nutrition Associate", "Sports Psychologist", "Athletic Trainer", "Recreational Program Manager"));
        clusterRoles.put("Robotics, Drones & Autonomous Systems", List.of(
                "Robotics Engineer", "Embedded Systems Engineer", "Drone Pilot", "UAV Mission Planner", "Automation Engineer",
                "PLC Programmer", "Autonomous Vehicle Systems Associate", "Robot Simulation Engineer", "Industrial IoT Specialist", "Field Robotics Operator"));

        Map<String, String> roleFitStrategy = new LinkedHashMap<>();
        Map<String, String> rolePathwayHints = new LinkedHashMap<>();
        Map<String, String> roleExamHints = new LinkedHashMap<>();
        Map<String, String> rolePrereqSummary = new LinkedHashMap<>();
        Map<String, String> roleRequiredSubjects = new LinkedHashMap<>();
        Map<String, String> roleEntranceExams = new LinkedHashMap<>();
        Map<String, String> roleTargetPhase = new LinkedHashMap<>();
        Map<String, Map<String, Integer>> roleCutoffMap = new LinkedHashMap<>();
        Map<String, String> roleCodes = new LinkedHashMap<>();
        String academicPhase = resolveAcademicCareerPhase(academicProfile);
        List<RDCICareerCatalog> allCareerCatalog = ciCareerMappingService
                .getActiveCareerCatalog("APTIPATH", ASSESSMENT_VERSION);
        List<RDCICareerCatalog> careerCatalog = filterCareerCatalogByAcademicContext(allCareerCatalog, academicProfile);
        careerCatalog = prioritizePrimaryCareerCatalog(careerCatalog, 65);
        if (careerCatalog == null || careerCatalog.isEmpty()) {
            careerCatalog = prioritizePrimaryCareerCatalog(allCareerCatalog, 65);
        }
        if (careerCatalog != null && !careerCatalog.isEmpty()) {
            clusterRoles.clear();
            for (RDCICareerCatalog catalogRow : careerCatalog) {
                if (catalogRow == null
                        || catalogRow.getClusterName() == null
                        || catalogRow.getCareerName() == null) {
                    continue;
                }
                String clusterName = catalogRow.getClusterName().trim();
                String careerName = catalogRow.getCareerName().trim();
                if (clusterName.isEmpty() || careerName.isEmpty()) {
                    continue;
                }
                clusterRoles.computeIfAbsent(clusterName, ignored -> new ArrayList<>()).add(careerName);
                roleFitStrategy.put(careerName, nz(catalogRow.getFitStrategy()));
                rolePathwayHints.put(careerName, nz(catalogRow.getPathwayHint()));
                roleExamHints.put(careerName, nz(catalogRow.getExamHint()));
                rolePrereqSummary.put(careerName, nz(catalogRow.getPrerequisiteSummary()));
                roleRequiredSubjects.put(careerName, nz(catalogRow.getRequiredSubjectsCsv()));
                roleEntranceExams.put(careerName, nz(catalogRow.getEntranceExamsCsv()));
                roleTargetPhase.put(careerName, nz(catalogRow.getTargetPhase()));
                Map<String, Integer> cutoffRow = new LinkedHashMap<>();
                cutoffRow.put("math", nzInt(catalogRow.getMinMathLevel()));
                cutoffRow.put("physics", nzInt(catalogRow.getMinPhysicsLevel()));
                cutoffRow.put("chemistry", nzInt(catalogRow.getMinChemistryLevel()));
                cutoffRow.put("biology", nzInt(catalogRow.getMinBiologyLevel()));
                cutoffRow.put("language", nzInt(catalogRow.getMinLanguageLevel()));
                roleCutoffMap.put(careerName, cutoffRow);
                roleCodes.put(careerName, nz(catalogRow.getCareerCode()));
            }
        }

        List<String> topSignals = topSignalLabels(
                aptitudeScore,
                interestScore,
                examReadinessIndex,
                aiReadinessIndex,
                mentalPreparednessIndex,
                alignmentIndex,
                wellbeingRiskIndex);
        String reasonSignalText = topSignals.size() >= 2
                ? (topSignals.get(0) + " and " + topSignals.get(1))
                : (topSignals.isEmpty() ? "overall readiness" : topSignals.get(0));
        String intentReason = selectedCareerIntents == null || selectedCareerIntents.isEmpty()
                ? ""
                : (" Intent cues: " + String.join(", ", intentLabels(selectedCareerIntents)) + ".");

        List<Map<String, Object>> careers = new ArrayList<>();
        for (Map.Entry<String, List<String>> clusterEntry : clusterRoles.entrySet()) {
            String cluster = clusterEntry.getKey();
            double base = clusterScores.getOrDefault(cluster, 50.0);
            List<String> roles = clusterEntry.getValue();
            if (roles == null || roles.isEmpty()) {
                continue;
            }
            for (String role : roles) {
                double fit = base + roleVariance(role);
                String strategy = normalizeFitStrategy(roleFitStrategy.get(role));
                if (!strategy.isEmpty() && !"DEFAULT_CLUSTER_BASE".equals(strategy)) {
                    fit = fitByStrategy(
                            strategy,
                            base,
                            roleVariance(role),
                            aptitudeScore,
                            interestScore,
                            examReadinessIndex,
                            aiReadinessIndex,
                            mentalPreparednessIndex,
                            alignmentIndex,
                            catFitIndex,
                            lawFitIndex,
                            roboticsFitIndex,
                            droneAutonomyFitIndex,
                            spaceTechFitIndex);
                } else {
                    String roleU = role.toUpperCase(Locale.ENGLISH);
                    if (roleU.contains("PILOT") || roleU.contains("AIR TRAFFIC") || roleU.contains("AEROSPACE")) {
                        fit = (spaceTechFitIndex * 0.42) + (examReadinessIndex * 0.24) + (mentalPreparednessIndex * 0.20) + (alignmentIndex * 0.14) + roleVariance(role);
                    } else if (roleU.contains("LAWYER") || roleU.contains("LEGAL") || roleU.contains("JUDICIAL")) {
                        fit = (lawFitIndex * 0.46) + (interestScore * 0.22) + (mentalPreparednessIndex * 0.18) + (alignmentIndex * 0.14) + roleVariance(role);
                    } else if (roleU.contains("CHARTERED ACCOUNTANT") || roleU.contains("ACTUARIAL") || roleU.contains("EQUITY") || roleU.contains("TREASURY")) {
                        fit = (catFitIndex * 0.44) + (aptitudeScore * 0.30) + (examReadinessIndex * 0.16) + (alignmentIndex * 0.10) + roleVariance(role);
                    } else if (roleU.contains("JOURNALIST") || roleU.contains("COPYWRITER") || roleU.contains("LINGUIST")) {
                        fit = (interestScore * 0.44) + (alignmentIndex * 0.26) + (mentalPreparednessIndex * 0.20) + (aiReadinessIndex * 0.10) + roleVariance(role);
                    } else if (roleU.contains("PSYCHOLOGIST") || roleU.contains("COUNSELOR") || roleU.contains("TEACHER")) {
                        fit = (interestScore * 0.36) + (mentalPreparednessIndex * 0.28) + (alignmentIndex * 0.24) + (examReadinessIndex * 0.12) + roleVariance(role);
                    } else if (roleU.contains("ROBOTICS") || roleU.contains("DRONE") || roleU.contains("UAV")) {
                        fit = (roboticsFitIndex * 0.42) + (droneAutonomyFitIndex * 0.24) + (aiReadinessIndex * 0.20) + (examReadinessIndex * 0.14) + roleVariance(role);
                    }
                }
                fit += academicProgramCareerBoost(cluster, role, academicProfile);

                Map<String, Integer> roleCutoffs = roleCutoffMap.get(role);
                List<String> prerequisiteGaps = buildPrerequisiteGaps(roleCutoffs, subjectAffinitySignals);
                double cutoffPenalty = prerequisitePenalty(roleCutoffs, subjectAffinitySignals);
                fit = fit - cutoffPenalty;
                fit = calibrateFitIndex(fit, assessedAccuracyPercent);
                fit = clamp(fit, 12.0, 99.0);
                String pathwayHint = rolePathwayHints.get(role);
                if (pathwayHint == null || pathwayHint.trim().isEmpty()) {
                    pathwayHint = clusterPathwayHint(cluster);
                }
                String examHint = roleExamHints.get(role);
                if (examHint == null || examHint.trim().isEmpty()) {
                    examHint = clusterExamHint(cluster);
                }
                String prerequisiteSummary = rolePrereqSummary.get(role);
                if (prerequisiteSummary == null || prerequisiteSummary.trim().isEmpty()) {
                    prerequisiteSummary = defaultPrerequisiteSummary(cluster);
                }
                String requiredSubjects = roleRequiredSubjects.getOrDefault(role, "");
                String entranceExams = roleEntranceExams.getOrDefault(role, "");
                String targetPhase = roleTargetPhase.getOrDefault(role, "Post-12");
                double phasePenalty = careerPhasePenalty(targetPhase, academicPhase);
                if (phasePenalty > 0.0) {
                    fit = clamp(fit - phasePenalty, 12.0, 99.0);
                }
                List<String> evidenceTrace = buildCareerEvidenceTrace(
                        cluster,
                        sectionScores,
                        subjectAffinitySignals,
                        selectedCareerIntents,
                        prerequisiteGaps,
                        cutoffPenalty,
                        requiredSubjects,
                        entranceExams);
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("careerCode", roleCodes.getOrDefault(role, ""));
                row.put("careerName", role);
                row.put("cluster", cluster);
                row.put("fitScore", round1(fit));
                row.put("fitBand", fitBandLabel(fit));
                row.put("pathwayHint", pathwayHint);
                row.put("examHint", examHint);
                row.put("prerequisiteSummary", prerequisiteSummary);
                row.put("requiredSubjects", requiredSubjects);
                row.put("entranceExams", entranceExams);
                row.put("targetPhase", targetPhase);
                row.put("academicPhase", academicPhase);
                row.put("evidenceTrace", evidenceTrace);
                row.put("reason", "Strong signal in " + reasonSignalText + " for this pathway." + intentReason);
                careers.add(row);
            }
        }
        return careers;
    }

    private double academicProgramCareerBoost(String cluster, String role, Map<String, String> academicProfile) {
        if (academicProfile == null || academicProfile.isEmpty()) {
            return 0.0;
        }
        String stream = nz(academicProfile.get(STUDENT_INTAKE_STREAM_CODE)).trim().toUpperCase(Locale.ENGLISH);
        String program = nz(academicProfile.get(STUDENT_INTAKE_PROGRAM_CODE)).trim().toUpperCase(Locale.ENGLISH);
        if (stream.isEmpty() && program.isEmpty()) {
            return 0.0;
        }

        String roleText = (nz(cluster) + " " + nz(role)).toUpperCase(Locale.ENGLISH);
        boolean techTrack = containsAny(stream,
                "ENGINEERING", "TECH", "COMPUTER", "DATA", "AI", "ELECTRONICS", "ELECTRICAL",
                "MECHANICAL", "CIVIL", "ROBOTICS", "AUTOMATION")
                || containsAny(program,
                "BTECH", "BE_", "MTECH", "ME", "CSE", "AI", "DATA", "CYBER", "IOT",
                "ECE", "EEE", "MECH", "CIVIL", "ROBOTICS", "AUTOMOBILE", "MECHATRONICS");
        if (techTrack) {
            if (containsAny(roleText, "COMPUTER", "AI", "ROBOT", "AUTONOM", "ENGINEER", "AEROSPACE", "DRONE")) {
                return 6.0;
            }
            if (containsAny(roleText, "MEDICAL", "LAW", "LEGAL", "CLINICAL")) {
                return -3.0;
            }
        }

        boolean medicalTrack = containsAny(stream, "HEALTH", "MEDICAL", "BIO", "LIFE_SCI")
                || containsAny(program, "MBBS", "BDS", "BAMS", "BHMS", "BUMS", "BVSC", "BPHARM",
                "PHARMD", "NURSING", "BPT", "BOT", "BMLT", "BOPTOM", "BASLP", "BIOTECH");
        if (medicalTrack) {
            if (containsAny(roleText, "MEDICAL", "HEALTH", "CLINICAL", "BIO", "PHARMA", "LIFE SCIENCE")) {
                return 7.0;
            }
            if (containsAny(roleText, "LAW", "FINANCE", "ACCOUNT", "TREASURY")) {
                return -2.5;
            }
        }

        boolean commerceTrack = containsAny(stream, "COMMERCE", "BUSINESS", "FINANCE", "ECONOMICS", "MANAGEMENT")
                || containsAny(program, "BBA", "BCOM", "BMS", "BFM", "BAF", "BBI", "MBA", "MCOM", "PGDM", "CA_CS_CMA");
        if (commerceTrack) {
            if (containsAny(roleText, "FINANCE", "ACCOUNT", "ECONOM", "BUSINESS", "ENTREPRENEUR", "PRODUCT", "SUPPLY CHAIN")) {
                return 6.0;
            }
            if (containsAny(roleText, "CLINICAL", "SURGEON", "MEDICAL")) {
                return -3.0;
            }
        }

        boolean lawPolicyTrack = containsAny(stream, "LAW", "POLICY", "GOV", "HUMANITIES", "SOCIAL", "MEDIA", "COMM")
                || containsAny(program, "LLB", "BALLB", "BBALLB", "BCOMLLB", "LLM", "BA_", "MA", "JOURNALISM");
        if (lawPolicyTrack) {
            if (containsAny(roleText, "LAW", "LEGAL", "POLICY", "GOVERNANCE", "PUBLIC IMPACT", "COMMUNICATION")) {
                return 6.0;
            }
        }

        boolean designTrack = containsAny(stream, "ARCH", "DESIGN", "CREATIVE", "MEDIA", "PERFORMING")
                || containsAny(program, "BARCH", "BPLAN", "BDES", "BFA", "BID", "BFD", "ANIMATION", "VFX", "BPA");
        if (designTrack && containsAny(roleText, "DESIGN", "UX", "MEDIA", "CREATIVE", "PRODUCT")) {
            return 5.5;
        }

        boolean researchTrack = containsAny(stream, "SCIENCE", "RESEARCH", "AGRI", "ENV")
                || containsAny(program, "BSC", "MSC", "BSC_", "MSC_", "AGRICULTURE", "FORENSIC", "ENVIRONMENT", "MPH");
        if (researchTrack && containsAny(roleText, "SCIENTIST", "RESEARCH", "LAB", "CLIMATE", "BIOTECH")) {
            return 4.5;
        }

        boolean serviceTrack = containsAny(stream, "HOSPITALITY", "TOURISM", "DEFENCE", "AVIATION", "MARITIME", "SPORTS")
                || containsAny(program, "BHM", "BBA_HOSPITALITY", "BBA_AVIATION", "DIPLOMA_HOSPITALITY", "BTECH_MARINE", "BPED");
        if (serviceTrack && containsAny(roleText, "OPERATIONS", "HOSPITALITY", "AVIATION", "MARITIME", "FITNESS", "WELLNESS")) {
            return 4.0;
        }
        return 0.0;
    }

    private List<String> topSignalLabels(double aptitudeScore,
                                         double interestScore,
                                         double examReadinessIndex,
                                         double aiReadinessIndex,
                                         double mentalPreparednessIndex,
                                         double alignmentIndex,
                                         double wellbeingRiskIndex) {
        Map<String, Double> signals = new LinkedHashMap<>();
        signals.put("Analytical Aptitude", aptitudeScore);
        signals.put("Interest Clarity", interestScore);
        signals.put("Exam Discipline", examReadinessIndex);
        signals.put("AI-Era Skills", aiReadinessIndex);
        signals.put("Mental Preparedness", mentalPreparednessIndex);
        signals.put("Parent-Student Alignment", alignmentIndex);
        signals.put("Pressure Management", 100.0 - wellbeingRiskIndex);
        return signals.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private double roleVariance(String role) {
        if (role == null || role.isEmpty()) {
            return 0.0;
        }
        int mod = Math.abs(role.hashCode()) % 9;
        return mod - 4.0;
    }

    private String fitBandLabel(double fitScore) {
        if (fitScore >= 80.0) {
            return "High Match";
        }
        if (fitScore >= 68.0) {
            return "Strong Potential";
        }
        if (fitScore >= 55.0) {
            return "Developing Fit";
        }
        return "Exploratory";
    }

    private String clusterPathwayHint(String cluster) {
        if (cluster == null) {
            return "Review eligibility, skill requirements, and roadmap milestones.";
        }
        switch (cluster) {
            case "Medical & Clinical Pathways":
                return "Focus on PCB depth, NEET pattern practice, and clinical exposure awareness.";
            case "Aviation & Aerospace":
                return "Track PCM readiness, medical fitness, and simulator plus flight pathway planning.";
            case "Law, Policy & Governance":
                return "Build reading, argumentation, legal reasoning, and current affairs consistency.";
            case "Computer Science & AI":
            case "Robotics, Drones & Autonomous Systems":
                return "Strengthen math-logic base, coding practice, and project portfolio execution.";
            case "Economics, Finance & Accounting":
                return "Develop quantitative fluency, commerce fundamentals, and exam-specific mock rhythm.";
            default:
                return "Use a 90-day milestone plan with practice targets, mentor review, and evidence tracking.";
        }
    }

    private String clusterExamHint(String cluster) {
        if (cluster == null) {
            return "Recommended exams and pathways vary by board, state, and target institution.";
        }
        switch (cluster) {
            case "Engineering & Core Technology":
            case "Computer Science & AI":
            case "Robotics, Drones & Autonomous Systems":
                return "Exam route: JEE Main, JEE Advanced, state CETs, institute-specific entrance tests.";
            case "Medical & Clinical Pathways":
            case "Allied Health & Care":
                return "Exam route: NEET UG, state health admissions, allied-health specific programs.";
            case "Law, Policy & Governance":
                return "Exam route: CLAT, AILET, LSAT India, state law entrance tracks.";
            case "Business, Commerce & Management":
            case "Economics, Finance & Accounting":
                return "Exam route: CUET UG, IPMAT, NPAT, university-specific commerce and management tests.";
            case "Aviation & Aerospace":
                return "Exam route: DGCA-linked tracks, AME CET pathways, institute-level aviation screening.";
            default:
                return "Exam route: combine national/state entrances, portfolio/interview tracks, and institute criteria.";
        }
    }

    private String defaultPrerequisiteSummary(String cluster) {
        if (cluster == null) {
            return "Baseline readiness across core subjects and consistent study discipline is recommended.";
        }
        switch (cluster) {
            case "Engineering & Core Technology":
            case "Computer Science & AI":
            case "Robotics, Drones & Autonomous Systems":
            case "Aviation & Aerospace":
                return "Strong PCM fundamentals, logical reasoning, and regular mock practice are expected.";
            case "Medical & Clinical Pathways":
            case "Allied Health & Care":
            case "Biotech & Life Sciences":
                return "Strong PCB fundamentals, scientific reasoning, and sustained exam discipline are expected.";
            case "Law, Policy & Governance":
            case "Marketing, Media & Communication":
            case "Humanities, Languages & Social Impact":
                return "High reading comprehension, language expression, and argument clarity are expected.";
            case "Business, Commerce & Management":
            case "Economics, Finance & Accounting":
                return "Numeracy, data interpretation, and decision-making discipline are expected.";
            default:
                return "Baseline readiness across relevant subjects and consistent study discipline is recommended.";
        }
    }

    private List<String> buildCareerEvidenceTrace(String cluster,
                                                  Map<String, Double> sectionScores,
                                                  Map<String, Integer> subjectSignals,
                                                  List<String> selectedCareerIntents,
                                                  List<String> prerequisiteGaps,
                                                  double cutoffPenalty,
                                                  String requiredSubjects,
                                                  String entranceExams) {
        List<String> evidence = new ArrayList<>();
        evidence.add("Section evidence: " + topSectionEvidence(sectionScores, 2));
        evidence.add("Subject evidence: " + subjectEvidenceLine(subjectSignals, requiredSubjects));
        if (selectedCareerIntents != null && !selectedCareerIntents.isEmpty()) {
            evidence.add("Intent evidence: " + String.join(", ", intentLabels(selectedCareerIntents)));
        }
        if (prerequisiteGaps != null && !prerequisiteGaps.isEmpty()) {
            evidence.add("Prerequisite gap: " + String.join(", ", prerequisiteGaps));
        } else if (hasAnySubjectSignal(subjectSignals)) {
            evidence.add("Prerequisite fit: current subject signals are aligned for this path.");
        } else {
            evidence.add("Prerequisite fit: subject affinity survey not captured; fit uses assessment responses and section behavior.");
        }
        if (cutoffPenalty > 0.0) {
            evidence.add("Cutoff adjustment applied: -" + round1(cutoffPenalty) + " fit points due to subject readiness gap.");
        }
        if (entranceExams != null && !entranceExams.trim().isEmpty()) {
            evidence.add("Exam route: " + entranceExams);
        } else {
            evidence.add("Exam route: " + clusterExamHint(cluster));
        }
        return evidence.stream().filter(s -> s != null && !s.trim().isEmpty()).limit(5).collect(Collectors.toList());
    }

    private String topSectionEvidence(Map<String, Double> sectionScores, int limit) {
        if (sectionScores == null || sectionScores.isEmpty() || limit <= 0) {
            return "insufficient section evidence";
        }
        return sectionScores.entrySet().stream()
                .sorted((a, b) -> Double.compare(
                        b.getValue() == null ? 0.0 : b.getValue(),
                        a.getValue() == null ? 0.0 : a.getValue()))
                .limit(limit)
                .map(entry -> sectionLabel(entry.getKey()) + " " + round1(entry.getValue() == null ? 0.0 : entry.getValue()) + "/100")
                .collect(Collectors.joining(", "));
    }

    private String subjectEvidenceLine(Map<String, Integer> subjectSignals, String requiredSubjectsCsv) {
        if (!hasAnySubjectSignal(subjectSignals)) {
            return "subject affinity survey not captured";
        }
        String base = "Math " + subjectSignals.getOrDefault("math", 0)
                + "/5, Physics " + subjectSignals.getOrDefault("physics", 0)
                + "/5, Chemistry " + subjectSignals.getOrDefault("chemistry", 0)
                + "/5, Biology " + subjectSignals.getOrDefault("biology", 0)
                + "/5, Language " + subjectSignals.getOrDefault("language", 0)
                + "/5";
        if (requiredSubjectsCsv == null || requiredSubjectsCsv.trim().isEmpty()) {
            return base;
        }
        return base + ". Required: " + requiredSubjectsCsv;
    }

    private boolean hasAnySubjectSignal(Map<String, Integer> subjectSignals) {
        if (subjectSignals == null || subjectSignals.isEmpty()) {
            return false;
        }
        return subjectSignals.values().stream().anyMatch(v -> v != null && v > 0);
    }

    private String sectionLabel(String sectionCode) {
        if (sectionCode == null) {
            return "Section";
        }
        switch (sectionCode.trim().toUpperCase(Locale.ENGLISH)) {
            case "CORE_APTITUDE": return "Core Aptitude";
            case "APPLIED_CHALLENGE": return "Applied Challenge";
            case "INTEREST_WORK": return "Interest and Work";
            case "VALUES_MOTIVATION": return "Values and Motivation";
            case "LEARNING_BEHAVIOR": return "Learning Behavior";
            case "AI_READINESS": return "AI Readiness";
            case "CAREER_REALITY": return "Career Reality";
            case "STEM_FOUNDATION": return "STEM Foundation";
            case "BIOLOGY_FOUNDATION": return "Biology Foundation";
            case "GENERAL_AWARENESS": return "General Awareness";
            case "REASONING_IQ": return "Reasoning and IQ";
            default: return sectionCode;
        }
    }

    private double prerequisitePenalty(Map<String, Integer> roleCutoffs, Map<String, Integer> subjectSignals) {
        if (roleCutoffs == null || roleCutoffs.isEmpty() || !hasAnySubjectSignal(subjectSignals)) {
            return 0.0;
        }
        double penalty = 0.0;
        penalty += subjectGapPenalty(subjectSignals.getOrDefault("math", 0), roleCutoffs.getOrDefault("math", 0));
        penalty += subjectGapPenalty(subjectSignals.getOrDefault("physics", 0), roleCutoffs.getOrDefault("physics", 0));
        penalty += subjectGapPenalty(subjectSignals.getOrDefault("chemistry", 0), roleCutoffs.getOrDefault("chemistry", 0));
        penalty += subjectGapPenalty(subjectSignals.getOrDefault("biology", 0), roleCutoffs.getOrDefault("biology", 0));
        penalty += subjectGapPenalty(subjectSignals.getOrDefault("language", 0), roleCutoffs.getOrDefault("language", 0));
        return clamp(penalty, 0.0, 18.0);
    }

    private List<String> buildPrerequisiteGaps(Map<String, Integer> roleCutoffs, Map<String, Integer> subjectSignals) {
        List<String> gaps = new ArrayList<>();
        if (roleCutoffs == null || roleCutoffs.isEmpty() || !hasAnySubjectSignal(subjectSignals)) {
            return gaps;
        }
        addGap(gaps, "Math", subjectSignals.getOrDefault("math", 0), roleCutoffs.getOrDefault("math", 0));
        addGap(gaps, "Physics", subjectSignals.getOrDefault("physics", 0), roleCutoffs.getOrDefault("physics", 0));
        addGap(gaps, "Chemistry", subjectSignals.getOrDefault("chemistry", 0), roleCutoffs.getOrDefault("chemistry", 0));
        addGap(gaps, "Biology", subjectSignals.getOrDefault("biology", 0), roleCutoffs.getOrDefault("biology", 0));
        addGap(gaps, "Language", subjectSignals.getOrDefault("language", 0), roleCutoffs.getOrDefault("language", 0));
        return gaps;
    }

    private void addGap(List<String> gaps, String label, int signal, int cutoff) {
        if (cutoff <= 0 || signal <= 0 || signal >= cutoff || gaps == null) {
            return;
        }
        gaps.add(label + " needs " + cutoff + "/5 (current " + signal + "/5)");
    }

    private double subjectGapPenalty(int signal, int cutoff) {
        if (cutoff <= 0 || signal <= 0 || signal >= cutoff) {
            return 0.0;
        }
        return (cutoff - signal) * 2.8;
    }

    private boolean applyCatalogAdjustments(Map<String, Double> clusterScores,
                                            List<String> selectedCareerIntents,
                                            Map<String, Integer> studentSelfSignals,
                                            Map<String, Integer> subjectAffinitySignals,
                                            List<RDCICareerAdjustment> adjustmentCatalog) {
        if (clusterScores == null || clusterScores.isEmpty() || adjustmentCatalog == null || adjustmentCatalog.isEmpty()) {
            return false;
        }
        for (String intentCode : selectedCareerIntents == null ? List.<String>of() : selectedCareerIntents) {
            applyAdjustmentRows(clusterScores, adjustmentCatalog, "INTENT", intentCode, "ANY");
        }

        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SELF_SIGNAL", "numeric",
                signalBandForScale(studentSelfSignals == null ? 0 : studentSelfSignals.getOrDefault("numeric", 0)));
        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SELF_SIGNAL", "language",
                signalBandForScale(studentSelfSignals == null ? 0 : studentSelfSignals.getOrDefault("language", 0)));
        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SELF_SIGNAL", "discipline",
                signalBandForScale(studentSelfSignals == null ? 0 : studentSelfSignals.getOrDefault("discipline", 0)));
        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SELF_SIGNAL", "spatial",
                signalBandForScale(studentSelfSignals == null ? 0 : studentSelfSignals.getOrDefault("spatial", 0)));

        int numeric = studentSelfSignals == null ? 0 : studentSelfSignals.getOrDefault("numeric", 0);
        int language = studentSelfSignals == null ? 0 : studentSelfSignals.getOrDefault("language", 0);
        if (numeric > 0 && language > 0 && numeric <= 2 && language >= 4) {
            applyAdjustmentRows(clusterScores, adjustmentCatalog, "SELF_COMPOSITE", "NUMERIC_LOW_LANGUAGE_HIGH", "ANY");
        }

        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SUBJECT_SIGNAL", "math",
                signalBandForScale(subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("math", 0)));
        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SUBJECT_SIGNAL", "physics",
                signalBandForScale(subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("physics", 0)));
        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SUBJECT_SIGNAL", "chemistry",
                signalBandForScale(subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("chemistry", 0)));
        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SUBJECT_SIGNAL", "biology",
                signalBandForScale(subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("biology", 0)));
        applyAdjustmentRows(clusterScores, adjustmentCatalog, "SUBJECT_SIGNAL", "language",
                signalBandForScale(subjectAffinitySignals == null ? 0 : subjectAffinitySignals.getOrDefault("language", 0)));
        return true;
    }

    private void applyAdjustmentRows(Map<String, Double> clusterScores,
                                     List<RDCICareerAdjustment> adjustmentCatalog,
                                     String signalType,
                                     String signalCode,
                                     String signalBand) {
        if (clusterScores == null || clusterScores.isEmpty()
                || adjustmentCatalog == null || adjustmentCatalog.isEmpty()
                || signalType == null || signalCode == null || signalBand == null
                || signalBand.trim().isEmpty()) {
            return;
        }
        String normalizedType = signalType.trim().toUpperCase(Locale.ENGLISH);
        String normalizedCode = signalCode.trim().toUpperCase(Locale.ENGLISH);
        String normalizedBand = signalBand.trim().toUpperCase(Locale.ENGLISH);

        for (RDCICareerAdjustment row : adjustmentCatalog) {
            if (row == null) {
                continue;
            }
            String rowType = nz(row.getSignalType()).trim().toUpperCase(Locale.ENGLISH);
            String rowCode = nz(row.getSignalCode()).trim().toUpperCase(Locale.ENGLISH);
            String rowBand = nz(row.getSignalBand()).trim().toUpperCase(Locale.ENGLISH);
            if (!normalizedType.equals(rowType) || !normalizedCode.equals(rowCode)) {
                continue;
            }
            if (!"ANY".equals(rowBand) && !normalizedBand.equals(rowBand)) {
                continue;
            }
            addClusterBoost(clusterScores, row.getClusterName(), toDouble(row.getBoostValue()));
        }
    }

    private double fitByStrategy(String strategy,
                                 double baseScore,
                                 double roleVariance,
                                 double aptitudeScore,
                                 double interestScore,
                                 double examReadinessIndex,
                                 double aiReadinessIndex,
                                 double mentalPreparednessIndex,
                                 double alignmentIndex,
                                 double catFitIndex,
                                 double lawFitIndex,
                                 double roboticsFitIndex,
                                 double droneAutonomyFitIndex,
                                 double spaceTechFitIndex) {
        switch (strategy) {
            case "AVIATION_SPECIAL":
                return (spaceTechFitIndex * 0.42) + (examReadinessIndex * 0.24) + (mentalPreparednessIndex * 0.20)
                        + (alignmentIndex * 0.14) + roleVariance;
            case "LAW_SPECIAL":
                return (lawFitIndex * 0.46) + (interestScore * 0.22) + (mentalPreparednessIndex * 0.18)
                        + (alignmentIndex * 0.14) + roleVariance;
            case "FINANCE_SPECIAL":
                return (catFitIndex * 0.44) + (aptitudeScore * 0.30) + (examReadinessIndex * 0.16)
                        + (alignmentIndex * 0.10) + roleVariance;
            case "LANGUAGE_SPECIAL":
                return (interestScore * 0.44) + (alignmentIndex * 0.26) + (mentalPreparednessIndex * 0.20)
                        + (aiReadinessIndex * 0.10) + roleVariance;
            case "EDUPSYCH_SPECIAL":
                return (interestScore * 0.36) + (mentalPreparednessIndex * 0.28) + (alignmentIndex * 0.24)
                        + (examReadinessIndex * 0.12) + roleVariance;
            case "ROBOTICS_SPECIAL":
                return (roboticsFitIndex * 0.42) + (droneAutonomyFitIndex * 0.24) + (aiReadinessIndex * 0.20)
                        + (examReadinessIndex * 0.14) + roleVariance;
            default:
                return baseScore + roleVariance;
        }
    }

    private double toDouble(Number number) {
        return number == null ? 0.0 : number.doubleValue();
    }

    private int nzInt(Integer value) {
        return value == null ? 0 : value;
    }

    private String normalizeFitStrategy(String value) {
        if (value == null || value.trim().isEmpty()) {
            return "";
        }
        return value.trim().toUpperCase(Locale.ENGLISH);
    }

    private List<RDCICareerCatalog> prioritizePrimaryCareerCatalog(List<RDCICareerCatalog> rows, int primaryLimit) {
        if (rows == null || rows.isEmpty() || primaryLimit <= 0) {
            return rows;
        }
        List<RDCICareerCatalog> primary = rows.stream()
                .filter(this::isPrimary65Career)
                .sorted((a, b) -> Integer.compare(careerCodeSequence(a), careerCodeSequence(b)))
                .collect(Collectors.toList());
        if (primary.size() >= primaryLimit) {
            if (clusterDiversityCount(primary) >= 8) {
                return new ArrayList<>(primary.subList(0, primaryLimit));
            }
            return pickDiverseCareerCatalog(rows, primaryLimit);
        }
        if (primary.isEmpty()) {
            return pickDiverseCareerCatalog(rows, primaryLimit);
        }
        List<RDCICareerCatalog> ordered = new ArrayList<>(primary);
        rows.stream()
                .filter(row -> !isPrimary65Career(row))
                .forEach(ordered::add);
        return pickDiverseCareerCatalog(ordered, primaryLimit);
    }

    private int clusterDiversityCount(List<RDCICareerCatalog> rows) {
        if (rows == null || rows.isEmpty()) {
            return 0;
        }
        return (int) rows.stream()
                .map(row -> nz(row == null ? null : row.getClusterName()).trim().toUpperCase(Locale.ENGLISH))
                .filter(s -> !s.isEmpty())
                .distinct()
                .count();
    }

    private List<RDCICareerCatalog> pickDiverseCareerCatalog(List<RDCICareerCatalog> rows, int limit) {
        if (rows == null || rows.isEmpty() || limit <= 0) {
            return rows == null ? List.of() : rows;
        }
        List<RDCICareerCatalog> orderedRows = rows.stream()
                .filter(row -> row != null)
                .sorted((a, b) -> Integer.compare(careerCodeSequence(a), careerCodeSequence(b)))
                .collect(Collectors.toList());
        if (orderedRows.size() <= limit) {
            return orderedRows;
        }

        Map<String, List<RDCICareerCatalog>> byCluster = new LinkedHashMap<>();
        for (RDCICareerCatalog row : orderedRows) {
            String cluster = nz(row.getClusterName()).trim();
            if (cluster.isEmpty()) {
                cluster = "UNSPECIFIED";
            }
            byCluster.computeIfAbsent(cluster, key -> new ArrayList<>()).add(row);
        }

        List<RDCICareerCatalog> selected = new ArrayList<>();
        while (selected.size() < limit) {
            boolean added = false;
            for (Map.Entry<String, List<RDCICareerCatalog>> entry : byCluster.entrySet()) {
                List<RDCICareerCatalog> clusterRows = entry.getValue();
                if (clusterRows == null || clusterRows.isEmpty() || selected.size() >= limit) {
                    continue;
                }
                selected.add(clusterRows.remove(0));
                added = true;
            }
            if (!added) {
                break;
            }
        }
        return selected;
    }

    private boolean isPrimary65Career(RDCICareerCatalog row) {
        int sequence = careerCodeSequence(row);
        return sequence >= 1 && sequence <= 65;
    }

    private int careerCodeSequence(RDCICareerCatalog row) {
        if (row == null) {
            return Integer.MAX_VALUE;
        }
        String code = nz(row.getCareerCode()).trim().toUpperCase(Locale.ENGLISH);
        if (!code.startsWith("AP3_CAR_") || code.length() < 12) {
            return Integer.MAX_VALUE;
        }
        String suffix = code.substring(code.length() - 4);
        try {
            return Integer.parseInt(suffix);
        } catch (NumberFormatException ex) {
            return Integer.MAX_VALUE;
        }
    }

    private String resolveAcademicCareerPhase(Map<String, String> academicProfile) {
        String stage = resolveAcademicStage(academicProfile);
        if ("FOUNDATION_8_9".equals(stage)) {
            return "FOUNDATION";
        }
        if ("SECONDARY_10_12".equals(stage)) {
            return "SECONDARY";
        }
        if ("POST12_COLLEGE".equals(stage)) {
            return "POST12";
        }
        return "SECONDARY";
    }

    private List<RDCICareerCatalog> filterCareerCatalogByAcademicContext(List<RDCICareerCatalog> rows,
                                                                          Map<String, String> academicProfile) {
        if (rows == null || rows.isEmpty()) {
            return rows;
        }
        String academicPhase = resolveAcademicCareerPhase(academicProfile);
        List<RDCICareerCatalog> filtered = rows.stream()
                .filter(row -> isCareerPhaseCompatible(nz(row == null ? null : row.getTargetPhase()), academicPhase))
                .collect(Collectors.toList());
        if (!filtered.isEmpty()) {
            return filtered;
        }
        return rows;
    }

    private boolean isCareerPhaseCompatible(String targetPhaseRaw, String academicPhase) {
        String targetPhase = nz(targetPhaseRaw).trim().toUpperCase(Locale.ENGLISH);
        if (targetPhase.isEmpty()) {
            return true;
        }
        String normalizedPhase = nz(academicPhase).trim().toUpperCase(Locale.ENGLISH);
        if (normalizedPhase.isEmpty()) {
            return true;
        }

        if (containsAny(targetPhase, "ALL", "COMMON", "ANY")) {
            return true;
        }
        if ("FOUNDATION".equals(normalizedPhase)) {
            return containsAny(targetPhase, "FOUNDATION", "8_10", "8_TO_10", "POST_8_TO_10", "POST_10_TO_POST12");
        }
        if ("SECONDARY".equals(normalizedPhase)) {
            return containsAny(targetPhase, "SECONDARY", "10_12", "10_TO_12", "POST_10_TO_12", "POST_10_TO_POST12");
        }
        if ("POST12".equals(normalizedPhase)) {
            return containsAny(targetPhase, "POST12", "POST_12", "UG", "PG", "COLLEGE", "IMMEDIATE", "POST_10_TO_POST12");
        }
        return true;
    }

    private double careerPhasePenalty(String targetPhaseRaw, String academicPhase) {
        if (isCareerPhaseCompatible(targetPhaseRaw, academicPhase)) {
            return 0.0;
        }
        String targetPhase = nz(targetPhaseRaw).trim().toUpperCase(Locale.ENGLISH);
        String phase = nz(academicPhase).trim().toUpperCase(Locale.ENGLISH);
        if (phase.isEmpty() || targetPhase.isEmpty()) {
            return 0.0;
        }
        if ("FOUNDATION".equals(phase) && containsAny(targetPhase, "POST12", "POST_12", "UG", "PG", "COLLEGE")) {
            return 12.0;
        }
        if ("POST12".equals(phase) && containsAny(targetPhase, "FOUNDATION", "8_10", "8_TO_10")) {
            return 10.0;
        }
        return 6.0;
    }

    private String signalBandForScale(int scale) {
        if (scale >= 4) {
            return "HIGH";
        }
        if (scale > 0 && scale <= 2) {
            return "LOW";
        }
        return "";
    }

    private String careerNameAt(List<Map<String, Object>> careers, int index, String fallback) {
        if (careers == null || index < 0 || index >= careers.size()) {
            return fallback;
        }
        Object raw = careers.get(index).get("careerName");
        if (raw == null) {
            return fallback;
        }
        String value = raw.toString().trim();
        return value.isEmpty() ? fallback : value;
    }

    private String resolveCareerScoreBand(int careerScore) {
        if (careerScore >= 780) {
            return "Advanced";
        }
        if (careerScore >= 700) {
            return "Growth";
        }
        if (careerScore >= 620) {
            return "Developing";
        }
        return "Foundation";
    }

    private List<String> parseCareerIntents(String csv) {
        if (csv == null || csv.trim().isEmpty()) {
            return List.of();
        }
        Set<String> allowed = Set.of(
                "COMMERCIAL_PILOT",
                "LAW_POLICY",
                "MEDICAL_HEALTH",
                "CS_AI",
                "ROBOTICS_DRONE",
                "DESIGN_CREATIVE",
                "BUSINESS_FINANCE",
                "CIVIL_SERVICES",
                "PSYCHOLOGY_EDU",
                "MEDIA_COMM",
                "CORE_ENGINEERING",
                "SKILLED_VOCATIONAL");
        return java.util.Arrays.stream(csv.split(","))
                .map(String::trim)
                .map(v -> v.toUpperCase(Locale.ENGLISH))
                .filter(v -> !v.isEmpty() && allowed.contains(v))
                .distinct()
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<String> intentLabels(List<String> intentCodes) {
        if (intentCodes == null || intentCodes.isEmpty()) {
            return List.of();
        }
        return intentCodes.stream().map(this::intentLabel).collect(Collectors.toList());
    }

    private String intentLabel(String code) {
        if (code == null) {
            return "General Exploration";
        }
        switch (code.trim().toUpperCase(Locale.ENGLISH)) {
            case "COMMERCIAL_PILOT": return "Commercial Pilot and Aviation";
            case "LAW_POLICY": return "Law and Public Policy";
            case "MEDICAL_HEALTH": return "Medicine and Health";
            case "CS_AI": return "Computer Science and AI";
            case "ROBOTICS_DRONE": return "Robotics and Drones";
            case "DESIGN_CREATIVE": return "Design and Creative Technology";
            case "BUSINESS_FINANCE": return "Business and Finance";
            case "CIVIL_SERVICES": return "Civil Services and Governance";
            case "PSYCHOLOGY_EDU": return "Psychology and Education";
            case "MEDIA_COMM": return "Media and Communication";
            case "CORE_ENGINEERING": return "Core Engineering";
            case "SKILLED_VOCATIONAL": return "Skilled Vocational Tracks";
            default: return "General Exploration";
        }
    }

    private Map<String, Integer> parseStudentSelfSignals(Map<String, String> formData) {
        Map<String, Integer> signals = new LinkedHashMap<>();
        signals.put("numeric", clampScale(formData.get("selfNumeric")));
        signals.put("language", clampScale(formData.get("selfLanguage")));
        signals.put("discipline", clampScale(formData.get("selfDiscipline")));
        signals.put("spatial", clampScale(formData.get("selfSpatial")));
        return signals;
    }

    private Map<String, Integer> parseSubjectAffinitySignals(Map<String, String> formData) {
        Map<String, Integer> signals = new LinkedHashMap<>();
        signals.put("math", clampScale(formData.get("subjectMath")));
        signals.put("physics", clampScale(formData.get("subjectPhysics")));
        signals.put("chemistry", clampScale(formData.get("subjectChemistry")));
        signals.put("biology", clampScale(formData.get("subjectBiology")));
        signals.put("language", clampScale(formData.get("subjectLanguage")));
        return signals;
    }

    private double affinityPercent(int scale, double fallback) {
        if (scale <= 0) {
            return 50.0;
        }
        return clamp(scale * 20.0, 20.0, 100.0);
    }

    private double blendWithSubject(double baseScore, double subjectScore, double weight) {
        double w = clamp(weight, 0.0, 0.6);
        return clamp((baseScore * (1.0 - w)) + (subjectScore * w), 0.0, 100.0);
    }

    private int clampScale(String value) {
        Integer parsed = toInteger(value);
        if (parsed == null) {
            return 0;
        }
        if (parsed < 1) {
            return 1;
        }
        if (parsed > 5) {
            return 5;
        }
        return parsed;
    }

    private List<String> buildSelfSignalInsights(List<String> selectedCareerIntents, Map<String, Integer> selfSignals) {
        List<String> insights = new ArrayList<>();
        int numeric = selfSignals == null ? 0 : selfSignals.getOrDefault("numeric", 0);
        int language = selfSignals == null ? 0 : selfSignals.getOrDefault("language", 0);
        int discipline = selfSignals == null ? 0 : selfSignals.getOrDefault("discipline", 0);
        int spatial = selfSignals == null ? 0 : selfSignals.getOrDefault("spatial", 0);

        if (numeric >= 4) {
            insights.add("Self-signal indicates strong numeric comfort.");
        } else if (numeric > 0 && numeric <= 2) {
            insights.add("Self-signal indicates low numeric comfort currently; career mapping de-emphasized heavy math tracks.");
        }
        if (language >= 4) {
            insights.add("Language and expression strength is high; communication-heavy careers are boosted.");
        }
        if (discipline >= 4) {
            insights.add("High preparation discipline signal supports exam-intensive pathways.");
        } else if (discipline > 0 && discipline <= 2) {
            insights.add("Preparation endurance needs support; recommended pathways include lower initial pressure tracks.");
        }
        if (spatial >= 4) {
            insights.add("Spatial comfort is high; aviation, design, and robotics-aligned roles receive additional weight.");
        }
        if (selectedCareerIntents != null && selectedCareerIntents.contains("COMMERCIAL_PILOT")) {
            insights.add("Commercial pilot intent captured; aviation-fit scoring includes discipline, spatial, and readiness signals.");
        }
        if (insights.isEmpty()) {
            insights.add("No self-signal adjustments captured; scoring used assessment responses and baseline indices.");
        }
        return insights;
    }

    private List<String> buildSubjectAffinityInsights(Map<String, Integer> subjectSignals, List<String> selectedCareerIntents) {
        List<String> insights = new ArrayList<>();
        int math = subjectSignals == null ? 0 : subjectSignals.getOrDefault("math", 0);
        int physics = subjectSignals == null ? 0 : subjectSignals.getOrDefault("physics", 0);
        int chemistry = subjectSignals == null ? 0 : subjectSignals.getOrDefault("chemistry", 0);
        int biology = subjectSignals == null ? 0 : subjectSignals.getOrDefault("biology", 0);
        int language = subjectSignals == null ? 0 : subjectSignals.getOrDefault("language", 0);

        if (biology > 0 && biology <= 2) {
            insights.add("Biology affinity is currently low; medicine-heavy paths were moderated.");
        } else if (biology >= 4) {
            insights.add("Biology affinity is high; health and life-science pathways received positive weight.");
        }
        if (math > 0 && math <= 2) {
            insights.add("Math affinity is currently low; high-quant tracks were adjusted unless other strengths were strong.");
        } else if (math >= 4) {
            insights.add("Math affinity is high; engineering, AI, and analytics pathways received positive weight.");
        }
        if (language >= 4) {
            insights.add("Language affinity is high; communication, law, policy, and media pathways were strengthened.");
        }
        if (selectedCareerIntents != null && selectedCareerIntents.contains("MEDICAL_HEALTH") && biology > 0 && biology <= 2) {
            insights.add("Medical intent selected with low biology affinity; recommendation keeps medicine as exploratory unless readiness improves.");
        }
        if (selectedCareerIntents != null && selectedCareerIntents.contains("CORE_ENGINEERING") && math > 0 && math <= 2) {
            insights.add("Engineering intent selected with low math affinity; recommendation shifts toward adjacent options with support plan.");
        }
        if (insights.isEmpty()) {
            if (hasAnySubjectSignal(subjectSignals)) {
                insights.add("Subject affinity signals are balanced; mapping used full assessment evidence.");
            } else {
                insights.add("No subject affinity responses captured; mapping used assessment responses and confidence trends.");
            }
        }
        return insights;
    }

    private void applyIntentBoosts(Map<String, Double> clusterScores, List<String> selectedCareerIntents) {
        if (clusterScores == null || clusterScores.isEmpty() || selectedCareerIntents == null || selectedCareerIntents.isEmpty()) {
            return;
        }
        for (String intent : selectedCareerIntents) {
            switch (intent) {
                case "COMMERCIAL_PILOT":
                    addClusterBoost(clusterScores, "Aviation & Aerospace", 14);
                    addClusterBoost(clusterScores, "Engineering & Core Technology", 4);
                    addClusterBoost(clusterScores, "Defense & Public Safety", 3);
                    break;
                case "LAW_POLICY":
                    addClusterBoost(clusterScores, "Law, Policy & Governance", 11);
                    addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", 6);
                    break;
                case "MEDICAL_HEALTH":
                    addClusterBoost(clusterScores, "Medical & Clinical Pathways", 12);
                    addClusterBoost(clusterScores, "Allied Health & Care", 8);
                    addClusterBoost(clusterScores, "Biotech & Life Sciences", 6);
                    break;
                case "CS_AI":
                    addClusterBoost(clusterScores, "Computer Science & AI", 12);
                    addClusterBoost(clusterScores, "Data, Analytics & FinTech", 8);
                    addClusterBoost(clusterScores, "Cybersecurity & Digital Trust", 7);
                    break;
                case "ROBOTICS_DRONE":
                    addClusterBoost(clusterScores, "Robotics, Drones & Autonomous Systems", 13);
                    addClusterBoost(clusterScores, "Engineering & Core Technology", 7);
                    addClusterBoost(clusterScores, "Computer Science & AI", 5);
                    break;
                case "DESIGN_CREATIVE":
                    addClusterBoost(clusterScores, "Design, UX & Creative Technology", 12);
                    addClusterBoost(clusterScores, "Marketing, Media & Communication", 7);
                    addClusterBoost(clusterScores, "Architecture & Built Environment", 5);
                    break;
                case "BUSINESS_FINANCE":
                    addClusterBoost(clusterScores, "Business, Commerce & Management", 11);
                    addClusterBoost(clusterScores, "Economics, Finance & Accounting", 11);
                    break;
                case "CIVIL_SERVICES":
                    addClusterBoost(clusterScores, "Law, Policy & Governance", 8);
                    addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", 9);
                    addClusterBoost(clusterScores, "Defense & Public Safety", 4);
                    break;
                case "PSYCHOLOGY_EDU":
                    addClusterBoost(clusterScores, "Education, Psychology & Guidance", 12);
                    addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", 6);
                    break;
                case "MEDIA_COMM":
                    addClusterBoost(clusterScores, "Marketing, Media & Communication", 12);
                    addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", 7);
                    break;
                case "CORE_ENGINEERING":
                    addClusterBoost(clusterScores, "Engineering & Core Technology", 12);
                    addClusterBoost(clusterScores, "Robotics, Drones & Autonomous Systems", 6);
                    break;
                case "SKILLED_VOCATIONAL":
                    addClusterBoost(clusterScores, "Skilled Trades & Applied Vocational", 13);
                    addClusterBoost(clusterScores, "Logistics & Supply Chain", 5);
                    addClusterBoost(clusterScores, "Agriculture & Food Systems", 3);
                    break;
                default:
                    break;
            }
        }
    }

    private void applySelfSignalAdjustments(Map<String, Double> clusterScores, Map<String, Integer> selfSignals) {
        if (clusterScores == null || clusterScores.isEmpty() || selfSignals == null || selfSignals.isEmpty()) {
            return;
        }
        int numeric = selfSignals.getOrDefault("numeric", 0);
        int language = selfSignals.getOrDefault("language", 0);
        int discipline = selfSignals.getOrDefault("discipline", 0);
        int spatial = selfSignals.getOrDefault("spatial", 0);

        if (numeric >= 4) {
            addClusterBoost(clusterScores, "Engineering & Core Technology", 4);
            addClusterBoost(clusterScores, "Computer Science & AI", 4);
            addClusterBoost(clusterScores, "Economics, Finance & Accounting", 4);
            addClusterBoost(clusterScores, "Data, Analytics & FinTech", 3);
        } else if (numeric > 0 && numeric <= 2) {
            addClusterBoost(clusterScores, "Engineering & Core Technology", -6);
            addClusterBoost(clusterScores, "Economics, Finance & Accounting", -5);
            addClusterBoost(clusterScores, "Data, Analytics & FinTech", -4);
            addClusterBoost(clusterScores, "Computer Science & AI", -3);
        }

        if (language >= 4) {
            addClusterBoost(clusterScores, "Law, Policy & Governance", 5);
            addClusterBoost(clusterScores, "Marketing, Media & Communication", 5);
            addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", 4);
            addClusterBoost(clusterScores, "Education, Psychology & Guidance", 3);
        } else if (language > 0 && language <= 2) {
            addClusterBoost(clusterScores, "Law, Policy & Governance", -3);
            addClusterBoost(clusterScores, "Marketing, Media & Communication", -3);
            addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", -2);
        }

        if (discipline >= 4) {
            addClusterBoost(clusterScores, "Medical & Clinical Pathways", 4);
            addClusterBoost(clusterScores, "Engineering & Core Technology", 3);
            addClusterBoost(clusterScores, "Law, Policy & Governance", 3);
            addClusterBoost(clusterScores, "Aviation & Aerospace", 4);
        } else if (discipline > 0 && discipline <= 2) {
            addClusterBoost(clusterScores, "Medical & Clinical Pathways", -5);
            addClusterBoost(clusterScores, "Engineering & Core Technology", -3);
            addClusterBoost(clusterScores, "Aviation & Aerospace", -4);
            addClusterBoost(clusterScores, "Hospitality, Travel & Service", 2);
            addClusterBoost(clusterScores, "Design, UX & Creative Technology", 2);
        }

        if (spatial >= 4) {
            addClusterBoost(clusterScores, "Aviation & Aerospace", 6);
            addClusterBoost(clusterScores, "Architecture & Built Environment", 5);
            addClusterBoost(clusterScores, "Robotics, Drones & Autonomous Systems", 4);
            addClusterBoost(clusterScores, "Engineering & Core Technology", 3);
        } else if (spatial > 0 && spatial <= 2) {
            addClusterBoost(clusterScores, "Aviation & Aerospace", -4);
            addClusterBoost(clusterScores, "Architecture & Built Environment", -3);
            addClusterBoost(clusterScores, "Robotics, Drones & Autonomous Systems", -2);
        }

        if (numeric > 0 && language > 0 && numeric <= 2 && language >= 4) {
            addClusterBoost(clusterScores, "Law, Policy & Governance", 4);
            addClusterBoost(clusterScores, "Marketing, Media & Communication", 4);
            addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", 5);
            addClusterBoost(clusterScores, "Education, Psychology & Guidance", 3);
            addClusterBoost(clusterScores, "Engineering & Core Technology", -5);
        }
    }

    private void applySubjectAffinityAdjustments(Map<String, Double> clusterScores, Map<String, Integer> subjectSignals) {
        if (clusterScores == null || clusterScores.isEmpty() || subjectSignals == null || subjectSignals.isEmpty()) {
            return;
        }
        int math = subjectSignals.getOrDefault("math", 0);
        int physics = subjectSignals.getOrDefault("physics", 0);
        int chemistry = subjectSignals.getOrDefault("chemistry", 0);
        int biology = subjectSignals.getOrDefault("biology", 0);
        int language = subjectSignals.getOrDefault("language", 0);

        if (math >= 4) {
            addClusterBoost(clusterScores, "Engineering & Core Technology", 5);
            addClusterBoost(clusterScores, "Computer Science & AI", 4);
            addClusterBoost(clusterScores, "Data, Analytics & FinTech", 4);
            addClusterBoost(clusterScores, "Economics, Finance & Accounting", 3);
        } else if (math > 0 && math <= 2) {
            addClusterBoost(clusterScores, "Engineering & Core Technology", -7);
            addClusterBoost(clusterScores, "Computer Science & AI", -5);
            addClusterBoost(clusterScores, "Data, Analytics & FinTech", -4);
            addClusterBoost(clusterScores, "Economics, Finance & Accounting", -3);
            addClusterBoost(clusterScores, "Marketing, Media & Communication", 2);
            addClusterBoost(clusterScores, "Law, Policy & Governance", 2);
        }

        if (physics >= 4) {
            addClusterBoost(clusterScores, "Aviation & Aerospace", 5);
            addClusterBoost(clusterScores, "Engineering & Core Technology", 3);
            addClusterBoost(clusterScores, "Robotics, Drones & Autonomous Systems", 3);
        } else if (physics > 0 && physics <= 2) {
            addClusterBoost(clusterScores, "Aviation & Aerospace", -5);
            addClusterBoost(clusterScores, "Engineering & Core Technology", -3);
            addClusterBoost(clusterScores, "Robotics, Drones & Autonomous Systems", -2);
        }

        if (chemistry >= 4) {
            addClusterBoost(clusterScores, "Medical & Clinical Pathways", 2);
            addClusterBoost(clusterScores, "Biotech & Life Sciences", 3);
            addClusterBoost(clusterScores, "Engineering & Core Technology", 2);
        } else if (chemistry > 0 && chemistry <= 2) {
            addClusterBoost(clusterScores, "Medical & Clinical Pathways", -2);
            addClusterBoost(clusterScores, "Biotech & Life Sciences", -3);
        }

        if (biology >= 4) {
            addClusterBoost(clusterScores, "Medical & Clinical Pathways", 8);
            addClusterBoost(clusterScores, "Allied Health & Care", 5);
            addClusterBoost(clusterScores, "Biotech & Life Sciences", 4);
        } else if (biology > 0 && biology <= 2) {
            addClusterBoost(clusterScores, "Medical & Clinical Pathways", -9);
            addClusterBoost(clusterScores, "Allied Health & Care", -4);
            addClusterBoost(clusterScores, "Biotech & Life Sciences", -4);
            addClusterBoost(clusterScores, "Business, Commerce & Management", 2);
            addClusterBoost(clusterScores, "Design, UX & Creative Technology", 2);
        }

        if (language >= 4) {
            addClusterBoost(clusterScores, "Law, Policy & Governance", 5);
            addClusterBoost(clusterScores, "Marketing, Media & Communication", 5);
            addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", 4);
            addClusterBoost(clusterScores, "Education, Psychology & Guidance", 3);
        } else if (language > 0 && language <= 2) {
            addClusterBoost(clusterScores, "Law, Policy & Governance", -3);
            addClusterBoost(clusterScores, "Marketing, Media & Communication", -3);
            addClusterBoost(clusterScores, "Humanities, Languages & Social Impact", -2);
        }
    }

    private void addClusterBoost(Map<String, Double> clusterScores, String cluster, double boost) {
        if (clusterScores == null || cluster == null || !clusterScores.containsKey(cluster)) {
            return;
        }
        clusterScores.put(cluster, clusterScores.get(cluster) + boost);
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }

    private double round1(double value) {
        return Math.round(value * 10.0d) / 10.0d;
    }

    private String normalizeConfidence(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String normalized = value.trim().toUpperCase(Locale.ENGLISH);
        if ("LOW".equals(normalized) || "MEDIUM".equals(normalized) || "HIGH".equals(normalized)) {
            return normalized;
        }
        return null;
    }

    private String safeJson(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\"", "\\\"");
    }

    private Map<String, Double> computeSectionScores(List<RDCIQuestionBank> questions, Map<String, String> formData) {
        Map<String, Double> weightedScoreSum = new LinkedHashMap<>();
        Map<String, Double> weightSum = new LinkedHashMap<>();

        for (RDCIQuestionBank question : questions) {
            if (question == null || question.getQuestionCode() == null) {
                continue;
            }
            String selected = formData.get("Q_" + question.getQuestionCode());
            if (selected == null || selected.trim().isEmpty()) {
                continue;
            }
            String section = question.getSectionCode() == null ? "" : question.getSectionCode().trim().toUpperCase(Locale.ENGLISH);
            String correctOption = trimToNull(question.getCorrectOption());
            boolean hasCorrectOption = correctOption != null;
            boolean isCorrect = hasCorrectOption && correctOption.equalsIgnoreCase(selected);
            double score = hasCorrectOption ? (isCorrect ? 100.0 : 0.0) : 55.0;
            String confidence = normalizeConfidence(formData.get("C_" + question.getQuestionCode()));
            if ("HIGH".equals(confidence)) {
                score += hasCorrectOption ? (isCorrect ? 2.0 : -8.0) : 4.0;
            } else if ("LOW".equals(confidence)) {
                score += hasCorrectOption ? (isCorrect ? -2.0 : 4.0) : -4.0;
            }
            score = clamp(score, 0.0, 100.0);
            double weight = question.getWeightage() == null ? 1.0 : question.getWeightage().doubleValue();
            weightedScoreSum.put(section, weightedScoreSum.getOrDefault(section, 0.0) + (score * weight));
            weightSum.put(section, weightSum.getOrDefault(section, 0.0) + weight);
        }

        Map<String, Double> averages = new LinkedHashMap<>();
        for (Map.Entry<String, Double> entry : weightedScoreSum.entrySet()) {
            double denominator = weightSum.getOrDefault(entry.getKey(), 0.0);
            if (denominator <= 0.0) {
                continue;
            }
            averages.put(entry.getKey(), round1(entry.getValue() / denominator));
        }
        return averages;
    }

    private List<Map<String, Object>> buildScoreDriverQuestions(List<RDCIQuestionBank> servedQuestions,
                                                                Map<String, String> formData,
                                                                int limit) {
        if (servedQuestions == null || servedQuestions.isEmpty() || formData == null || formData.isEmpty()) {
            return List.of();
        }
        List<Map<String, Object>> rows = new ArrayList<>();
        for (RDCIQuestionBank question : servedQuestions) {
            if (question == null || question.getQuestionCode() == null) {
                continue;
            }
            String code = question.getQuestionCode().trim();
            if (code.isEmpty()) {
                continue;
            }
            String selected = trimToNull(formData.get("Q_" + code));
            if (selected == null) {
                continue;
            }
            String correctOption = trimToNull(question.getCorrectOption());
            boolean hasCorrectOption = correctOption != null;
            boolean isCorrect = hasCorrectOption && correctOption.equalsIgnoreCase(selected);
            double weight = question.getWeightage() == null ? 1.0 : question.getWeightage().doubleValue();
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("questionCode", code);
            row.put("section", sectionLabel(question.getSectionCode()));
            row.put("questionText", clipText(nz(question.getQuestionText()), 180));
            row.put("selectedOption", selected.toUpperCase(Locale.ENGLISH));
            row.put("correctOption", hasCorrectOption ? correctOption.toUpperCase(Locale.ENGLISH) : "-");
            row.put("confidence", nz(normalizeConfidence(formData.get("C_" + code))));
            row.put("isCorrect", isCorrect);
            row.put("verdict", isCorrect ? "Correct" : "Incorrect");
            row.put("weight", round1(weight));
            row.put("pointsEarned", round1(isCorrect ? weight : 0.0));
            row.put("pointsLost", round1(isCorrect ? 0.0 : weight));
            rows.add(row);
        }
        rows.sort((a, b) -> {
            double lostA = parseDoubleValue(a.get("pointsLost"), 0.0);
            double lostB = parseDoubleValue(b.get("pointsLost"), 0.0);
            int lostCompare = Double.compare(lostB, lostA);
            if (lostCompare != 0) {
                return lostCompare;
            }
            double earnedA = parseDoubleValue(a.get("pointsEarned"), 0.0);
            double earnedB = parseDoubleValue(b.get("pointsEarned"), 0.0);
            return Double.compare(earnedB, earnedA);
        });
        if (limit > 0 && rows.size() > limit) {
            return new ArrayList<>(rows.subList(0, limit));
        }
        return rows;
    }

    private String clipText(String text, int maxLength) {
        if (text == null) {
            return "";
        }
        if (maxLength <= 0 || text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, Math.max(0, maxLength - 1)).trim() + "...";
    }

    private double weightedAverage(Map<String, Double> sectionScores,
                                   String sectionA,
                                   double weightA,
                                   String sectionB,
                                   double weightB) {
        double a = sectionScores.getOrDefault(sectionA, 50.0);
        double b = sectionScores.getOrDefault(sectionB, 50.0);
        double total = weightA + weightB;
        if (total <= 0) {
            return 50.0;
        }
        return clamp(((a * weightA) + (b * weightB)) / total, 0.0, 100.0);
    }

    private double computeParentContextScore(List<RDCIIntakeResponse> intakeRows) {
        if (intakeRows == null || intakeRows.isEmpty()) {
            return 50.0;
        }
        Map<String, String> answers = intakeRows.stream()
                .filter(row -> row != null && "PARENT".equalsIgnoreCase(nz(row.getRespondentType())))
                .filter(row -> row.getQuestionCode() != null && row.getAnswerValue() != null)
                .collect(Collectors.toMap(
                        row -> row.getQuestionCode().trim().toUpperCase(Locale.ENGLISH),
                        row -> row.getAnswerValue().trim().toUpperCase(Locale.ENGLISH),
                        (left, right) -> right,
                        LinkedHashMap::new));

        double score = 52.0;
        String budget = answers.get("P_BUDGET_01");
        if ("BUDGET_FLEXIBLE".equals(budget)) {
            score += 12;
        } else if ("BUDGET_MEDIUM".equals(budget)) {
            score += 9;
        } else if ("BUDGET_TIGHT".equals(budget)) {
            score += 5;
        }
        if (answers.containsKey("P_LANGUAGE_01")) {
            score += 4;
        }
        if (answers.containsKey("P_GEOGRAPHY_01")) {
            score += 6;
        }
        if (answers.containsKey("P_COACHING_01")) {
            score += 6;
        }
        if (answers.containsKey("P_MODEL_01")) {
            score += 6;
        }
        return clamp(score, 35.0, 95.0);
    }

    private double computeAlignmentIndex(List<RDCIIntakeResponse> intakeRows) {
        if (intakeRows == null || intakeRows.isEmpty()) {
            return 55.0;
        }
        Map<String, String> answers = intakeRows.stream()
                .filter(row -> row != null && "PARENT".equalsIgnoreCase(nz(row.getRespondentType())))
                .filter(row -> row.getQuestionCode() != null && row.getAnswerValue() != null)
                .collect(Collectors.toMap(
                        row -> row.getQuestionCode().trim().toUpperCase(Locale.ENGLISH),
                        row -> row.getAnswerValue().trim().toUpperCase(Locale.ENGLISH),
                        (left, right) -> right,
                        LinkedHashMap::new));
        double score = 58.0;
        if (answers.containsKey("P_GOAL_01")) {
            score += 15;
        }
        if ("ACADEMIC_YEAR".equals(answers.get("P_TIMELINE_01"))) {
            score += 6;
        } else if ("QUARTER".equals(answers.get("P_TIMELINE_01"))) {
            score += 3;
        }
        if ("MEDIUM".equals(answers.get("P_SUPPORT_01")) || "LOW".equals(answers.get("P_SUPPORT_01"))) {
            score += 5;
        }
        return clamp(score, 30.0, 96.0);
    }

    private double clamp(double value, double min, double max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    private String validateCoverage(String assessmentVersion,
                                    List<RDCIQuestionBank> questions,
                                    Map<String, String> formData,
                                    String academicStage) {
        if (questions == null || questions.isEmpty()) {
            return "Question bank is empty.";
        }

        int attempted = 0;
        Map<String, Integer> answeredBySection = new LinkedHashMap<>();
        Map<String, Integer> totalBySection = new LinkedHashMap<>();
        for (RDCIQuestionBank question : questions) {
            if (question == null || question.getQuestionCode() == null) {
                continue;
            }
            String section = question.getSectionCode() == null ? "" : question.getSectionCode().trim().toUpperCase(Locale.ENGLISH);
            totalBySection.put(section, totalBySection.getOrDefault(section, 0) + 1);
            String answer = formData.get("Q_" + question.getQuestionCode());
            if (answer != null && !answer.trim().isEmpty()) {
                attempted++;
                answeredBySection.put(section, answeredBySection.getOrDefault(section, 0) + 1);
            }
        }

        boolean isV3 = "v3".equalsIgnoreCase(nz(assessmentVersion));
        Map<String, Integer> required = requiredSectionCoverageByStage(isV3, academicStage);
        int requiredSum = required.values().stream().mapToInt(Integer::intValue).sum();
        int minimumOverall = Math.min(requiredSum, questions.size());
        if (attempted < minimumOverall) {
            return "Please answer at least " + minimumOverall + " questions before submit.";
        }

        Set<String> premiumSections = Set.of(
                "CORE_APTITUDE",
                "APPLIED_CHALLENGE",
                "INTEREST_WORK",
                "VALUES_MOTIVATION",
                "LEARNING_BEHAVIOR",
                "AI_READINESS",
                "CAREER_REALITY",
                "STEM_FOUNDATION",
                "BIOLOGY_FOUNDATION",
                "GENERAL_AWARENESS",
                "REASONING_IQ");
        boolean hasPremiumStructure = totalBySection.keySet().stream().anyMatch(premiumSections::contains);
        if (!hasPremiumStructure) {
            return null;
        }

        for (Map.Entry<String, Integer> rule : required.entrySet()) {
            String section = rule.getKey();
            int total = totalBySection.getOrDefault(section, 0);
            if (total == 0) {
                continue;
            }
            int expected = Math.min(total, rule.getValue());
            int answered = answeredBySection.getOrDefault(section, 0);
            if (answered < expected) {
                return "Please complete required items in section " + section + " (" + answered + "/" + expected + ").";
            }
        }
        return null;
    }

    private Map<String, Integer> requiredSectionCoverageByStage(boolean isV3, String academicStage) {
        String stage = nz(academicStage).trim().toUpperCase(Locale.ENGLISH);
        Map<String, Integer> required = new LinkedHashMap<>();
        if (!isV3) {
            required.put("CORE_APTITUDE", 8);
            required.put("APPLIED_CHALLENGE", 5);
            required.put("INTEREST_WORK", 4);
            required.put("VALUES_MOTIVATION", 3);
            required.put("LEARNING_BEHAVIOR", 3);
            required.put("AI_READINESS", 2);
            required.put("CAREER_REALITY", 2);
            required.put("STEM_FOUNDATION", 2);
            required.put("BIOLOGY_FOUNDATION", 2);
            required.put("GENERAL_AWARENESS", 1);
            required.put("REASONING_IQ", 2);
            return required;
        }
        if ("FOUNDATION_8_9".equals(stage)) {
            // Grade 8/9 CSV: CA(10) AC(8) IW(8) VM(6) LB(6) AIR(4) CR(4) GA(6) RIQ(4) SF(4) = 60
            // Required ~77% minimum coverage (46/60)
            required.put("CORE_APTITUDE", 8);
            required.put("APPLIED_CHALLENGE", 6);
            required.put("INTEREST_WORK", 6);
            required.put("VALUES_MOTIVATION", 5);
            required.put("LEARNING_BEHAVIOR", 5);
            required.put("AI_READINESS", 3);
            required.put("CAREER_REALITY", 3);
            required.put("STEM_FOUNDATION", 3);
            required.put("BIOLOGY_FOUNDATION", 0);
            required.put("GENERAL_AWARENESS", 4);
            required.put("REASONING_IQ", 3);
            return required;
        }
        if ("POST12_COLLEGE".equals(stage)) {
            required.put("CORE_APTITUDE", 14);
            required.put("APPLIED_CHALLENGE", 10);
            required.put("INTEREST_WORK", 6);
            required.put("VALUES_MOTIVATION", 5);
            required.put("LEARNING_BEHAVIOR", 5);
            required.put("AI_READINESS", 6);
            required.put("CAREER_REALITY", 5);
            required.put("STEM_FOUNDATION", 8);
            required.put("BIOLOGY_FOUNDATION", 5);
            required.put("GENERAL_AWARENESS", 4);
            required.put("REASONING_IQ", 4);
            return required;
        }
        // Grade 10 CSV: CA(12) AC(10) IW(8) VM(6) LB(6) AIR(6) CR(6) SF(6) BF(4) GA(4) RIQ(2) = 70
        // Required ~81% minimum coverage (57/70)
        required.put("CORE_APTITUDE", 10);
        required.put("APPLIED_CHALLENGE", 8);
        required.put("INTEREST_WORK", 6);
        required.put("VALUES_MOTIVATION", 5);
        required.put("LEARNING_BEHAVIOR", 5);
        required.put("AI_READINESS", 5);
        required.put("CAREER_REALITY", 5);
        required.put("STEM_FOUNDATION", 5);
        required.put("BIOLOGY_FOUNDATION", 3);
        required.put("GENERAL_AWARENESS", 3);
        required.put("REASONING_IQ", 2);
        return required;
    }

    private int computeTargetQuestionCountForStage(List<RDCIQuestionBank> questions, String academicStage) {
        if (questions == null || questions.isEmpty()) {
            return 0;
        }
        Map<String, Integer> required = requiredSectionCoverageByStage(true, academicStage);
        Map<String, Integer> availableBySection = new LinkedHashMap<>();
        for (RDCIQuestionBank question : questions) {
            if (question == null) {
                continue;
            }
            String section = nz(question.getSectionCode()).trim().toUpperCase(Locale.ENGLISH);
            if (section.isEmpty()) {
                continue;
            }
            availableBySection.put(section, availableBySection.getOrDefault(section, 0) + 1);
        }
        int total = 0;
        for (Map.Entry<String, Integer> rule : required.entrySet()) {
            int available = availableBySection.getOrDefault(rule.getKey(), 0);
            int expected = Math.max(0, rule.getValue() == null ? 0 : rule.getValue());
            total += Math.min(available, expected);
        }
        return total > 0 ? total : questions.size();
    }

    private String resolveAcademicStage(Map<String, String> academicProfile) {
        String gradeCode = academicProfile == null ? "" : nz(academicProfile.get(STUDENT_INTAKE_GRADE_CODE));
        gradeCode = gradeCode.trim().toUpperCase(Locale.ENGLISH);
        if ("8".equals(gradeCode) || "9".equals(gradeCode)) {
            return "FOUNDATION_8_9";
        }
        if ("10".equals(gradeCode) || "11".equals(gradeCode) || "12".equals(gradeCode)) {
            return "SECONDARY_10_12";
        }
        if (isPost12Grade(gradeCode)) {
            return "POST12_COLLEGE";
        }
        return "SECONDARY_10_12";
    }

    private List<RDCIQuestionBank> filterQuestionsByAcademicGrade(List<RDCIQuestionBank> source,
                                                                   Map<String, String> academicProfile) {
        if (source == null || source.isEmpty()) {
            return List.of();
        }
        String gradeCode = normalizeAcademicGradeCode(academicProfile);
        if (gradeCode.isEmpty()) {
            return source;
        }

        String expectedGradeLevel = "GRADE_" + gradeCode;

        // Primary: match by grade_level column (new data)
        List<RDCIQuestionBank> matched = new ArrayList<>();
        for (RDCIQuestionBank question : source) {
            String gl = nz(question.getGradeLevel()).trim().toUpperCase(Locale.ENGLISH);
            if (expectedGradeLevel.equals(gl)) {
                matched.add(question);
            }
        }
        if (!matched.isEmpty()) {
            return matched;
        }

        // Fallback: match by question code pattern (legacy data)
        for (RDCIQuestionBank question : source) {
            if (matchesAcademicGradeQuestion(question, gradeCode)) {
                matched.add(question);
            }
        }
        return matched.isEmpty() ? source : matched;
    }

    private String normalizeAcademicGradeCode(Map<String, String> academicProfile) {
        String raw = academicProfile == null ? "" : nz(academicProfile.get(STUDENT_INTAKE_GRADE_CODE));
        String grade = raw.trim().toUpperCase(Locale.ENGLISH).replace('-', '_').replace(' ', '_');
        if (grade.isEmpty()) {
            return "";
        }
        if (containsAny(grade, "GRADE_8", "GRADE8", "CLASS_8", "CLASS8") || "8".equals(grade)) {
            return "8";
        }
        if (containsAny(grade, "GRADE_9", "GRADE9", "CLASS_9", "CLASS9") || "9".equals(grade)) {
            return "9";
        }
        if (containsAny(grade, "GRADE_10", "GRADE10", "CLASS_10", "CLASS10") || "10".equals(grade)) {
            return "10";
        }
        return "";
    }

    private boolean matchesAcademicGradeQuestion(RDCIQuestionBank question, String gradeCode) {
        if (question == null || gradeCode == null || gradeCode.isEmpty()) {
            return false;
        }
        String code = nz(question.getQuestionCode()).trim().toUpperCase(Locale.ENGLISH);
        String text = nz(question.getQuestionText()).trim().toUpperCase(Locale.ENGLISH);
        switch (gradeCode) {
            case "8":
                return containsAny(code, "_G8_", "-G8-", "GRADE_8", "GRADE8", "CLASS_8", "CLASS8", "APG8_")
                        || containsAny(text, "GRADE 8", "CLASS 8");
            case "9":
                return containsAny(code, "_G9_", "-G9-", "GRADE_9", "GRADE9", "CLASS_9", "CLASS9", "APG9_")
                        || containsAny(text, "GRADE 9", "CLASS 9");
            case "10":
                return containsAny(code, "_G10_", "-G10-", "GRADE_10", "GRADE10", "CLASS_10", "CLASS10", "APG10_")
                        || containsAny(text, "GRADE 10", "CLASS 10");
            default:
                return false;
        }
    }

    private List<RDCIQuestionBank> filterQuestionsByAcademicStage(List<RDCIQuestionBank> source,
                                                                  String academicStage,
                                                                  Map<String, String> academicProfile) {
        if (source == null || source.isEmpty()) {
            return List.of();
        }
        Map<String, Integer> required = requiredSectionCoverageByStage(true, academicStage);
        String stage = nz(academicStage).trim().toUpperCase(Locale.ENGLISH);
        Map<String, List<RDCIQuestionBank>> bySection = new LinkedHashMap<>();
        for (RDCIQuestionBank question : source) {
            if (question == null || question.getQuestionCode() == null) {
                continue;
            }
            String section = nz(question.getSectionCode()).trim().toUpperCase(Locale.ENGLISH);
            bySection.computeIfAbsent(section, key -> new ArrayList<>()).add(question);
        }

        List<RDCIQuestionBank> filtered = new ArrayList<>();
        for (Map.Entry<String, Integer> rule : required.entrySet()) {
            String section = rule.getKey();
            int target = Math.max(0, rule.getValue());
            List<RDCIQuestionBank> sectionRows = bySection.getOrDefault(section, List.of());
            if (sectionRows.isEmpty() || target <= 0) {
                continue;
            }
            List<RDCIQuestionBank> ordered = new ArrayList<>(sectionRows);
            ordered.sort((a, b) -> Integer.compare(
                    a.getSequenceNo() == null ? Integer.MAX_VALUE : a.getSequenceNo(),
                    b.getSequenceNo() == null ? Integer.MAX_VALUE : b.getSequenceNo()));
            filtered.addAll(pickStageQuestionSlice(ordered, target, stage, academicProfile));
        }
        if (filtered.isEmpty()) {
            return source;
        }
        filtered.sort((a, b) -> Integer.compare(
                a.getSequenceNo() == null ? Integer.MAX_VALUE : a.getSequenceNo(),
                b.getSequenceNo() == null ? Integer.MAX_VALUE : b.getSequenceNo()));
        return filtered;
    }

    private List<RDCIQuestionBank> pickStageQuestionSlice(List<RDCIQuestionBank> ordered,
                                                          int target,
                                                          String academicStage,
                                                          Map<String, String> academicProfile) {
        if (ordered == null || ordered.isEmpty() || target <= 0) {
            return List.of();
        }
        String stage = nz(academicStage).trim().toUpperCase(Locale.ENGLISH);
        List<RDCIQuestionBank> stageTagged = new ArrayList<>();
        for (RDCIQuestionBank question : ordered) {
            if (matchesAcademicStageKeyword(question, stage)
                    || matchesAcademicProgramKeyword(question, academicProfile)) {
                stageTagged.add(question);
            }
        }

        List<RDCIQuestionBank> selected = new ArrayList<>();
        Set<String> selectedCodes = new HashSet<>();
        addFromStageWindow(selected, selectedCodes, stageTagged, target, stage);
        if (selected.size() < target) {
            addFromStageWindow(selected, selectedCodes, ordered, target, stage);
        }
        return selected;
    }

    private void addFromStageWindow(List<RDCIQuestionBank> selected,
                                    Set<String> selectedCodes,
                                    List<RDCIQuestionBank> pool,
                                    int target,
                                    String academicStage) {
        if (selected == null || selectedCodes == null || pool == null || pool.isEmpty() || target <= 0) {
            return;
        }
        int size = pool.size();
        List<Integer> order = stageIndexTraversalOrder(size, academicStage);
        for (Integer idx : order) {
            if (idx == null || idx < 0 || idx >= size || selected.size() >= target) {
                continue;
            }
            if (!withinPrimaryStageWindow(idx, size, academicStage)) {
                continue;
            }
            RDCIQuestionBank question = pool.get(idx);
            String code = questionCodeKey(question);
            if (code == null || selectedCodes.contains(code)) {
                continue;
            }
            selected.add(question);
            selectedCodes.add(code);
        }
        if (selected.size() >= target) {
            return;
        }
        for (Integer idx : order) {
            if (idx == null || idx < 0 || idx >= size || selected.size() >= target) {
                continue;
            }
            RDCIQuestionBank question = pool.get(idx);
            String code = questionCodeKey(question);
            if (code == null || selectedCodes.contains(code)) {
                continue;
            }
            selected.add(question);
            selectedCodes.add(code);
        }
    }

    private List<Integer> stageIndexTraversalOrder(int size, String academicStage) {
        List<Integer> order = new ArrayList<>();
        if (size <= 0) {
            return order;
        }
        String stage = nz(academicStage).trim().toUpperCase(Locale.ENGLISH);
        if ("POST12_COLLEGE".equals(stage)) {
            for (int i = size - 1; i >= 0; i--) {
                order.add(i);
            }
            return order;
        }
        if ("SECONDARY_10_12".equals(stage)) {
            int center = size / 2;
            order.add(center);
            int offset = 1;
            while (order.size() < size) {
                int right = center + offset;
                int left = center - offset;
                if (right < size) {
                    order.add(right);
                }
                if (left >= 0) {
                    order.add(left);
                }
                offset++;
            }
            return order;
        }
        for (int i = 0; i < size; i++) {
            order.add(i);
        }
        return order;
    }

    private boolean withinPrimaryStageWindow(int index, int size, String academicStage) {
        if (size <= 0 || index < 0 || index >= size) {
            return false;
        }
        String stage = nz(academicStage).trim().toUpperCase(Locale.ENGLISH);
        if ("FOUNDATION_8_9".equals(stage)) {
            int max = Math.max(0, (int) Math.ceil(size * 0.65d) - 1);
            return index <= max;
        }
        if ("SECONDARY_10_12".equals(stage)) {
            int min = (int) Math.floor(size * 0.20d);
            int max = Math.max(min, (int) Math.ceil(size * 0.90d) - 1);
            return index >= min && index <= max;
        }
        if ("POST12_COLLEGE".equals(stage)) {
            int min = (int) Math.floor(size * 0.35d);
            return index >= min;
        }
        return true;
    }

    private boolean matchesAcademicStageKeyword(RDCIQuestionBank question, String academicStage) {
        if (question == null) {
            return false;
        }
        String stage = nz(academicStage).trim().toUpperCase(Locale.ENGLISH);
        String text = (nz(question.getQuestionCode()) + " " + nz(question.getQuestionText())).toUpperCase(Locale.ENGLISH);
        if (text.isEmpty()) {
            return false;
        }
        if ("FOUNDATION_8_9".equals(stage)) {
            return containsAny(text, "GRADE 8", "GRADE 9", "FOUNDATION", "SCHOOL LEVEL", "BASIC");
        }
        if ("SECONDARY_10_12".equals(stage)) {
            return containsAny(text, "GRADE 10", "GRADE 11", "GRADE 12", "BOARD", "JEE", "NEET");
        }
        if ("POST12_COLLEGE".equals(stage)) {
            return containsAny(
                    text,
                    "COLLEGE", "UNDERGRAD", "UG", "PG", "SEMESTER", "INTERNSHIP", "PLACEMENT",
                    "BTECH", "B.E", "BE ", "MTECH", "M.E", "ENGINEERING",
                    "BARCH", "B.ARCH", "BPLAN", "BDES", "DESIGN", "ARCHITECTURE",
                    "BBA", "BMS", "BCOM", "MBA", "PGDM", "MCOM", "MANAGEMENT", "FINANCE",
                    "LLB", "BALLB", "LLM", "LAW", "LEGAL", "POLICY", "GOVERNANCE",
                    "MBBS", "BDS", "BAMS", "BHMS", "BPHARM", "NURSING", "BPT", "PHARMD",
                    "BSC", "MSC", "MCA", "DATA SCIENCE", "CYBER", "AI", "MACHINE LEARNING",
                    "AGRICULTURE", "VETERINARY", "HOSPITALITY", "TOURISM", "AVIATION", "MARITIME");
        }
        return false;
    }

    private boolean matchesAcademicProgramKeyword(RDCIQuestionBank question, Map<String, String> academicProfile) {
        if (question == null || academicProfile == null || academicProfile.isEmpty()) {
            return false;
        }
        String stream = nz(academicProfile.get(STUDENT_INTAKE_STREAM_CODE)).trim().toUpperCase(Locale.ENGLISH);
        String program = nz(academicProfile.get(STUDENT_INTAKE_PROGRAM_CODE)).trim().toUpperCase(Locale.ENGLISH);
        if (stream.isEmpty() && program.isEmpty()) {
            return false;
        }
        String text = (nz(question.getQuestionCode()) + " " + nz(question.getQuestionText())).toUpperCase(Locale.ENGLISH);
        if (text.isEmpty()) {
            return false;
        }

        boolean techTrack = containsAny(stream,
                "PCM", "ENGINEERING", "TECH", "COMPUTER", "DATA", "AI", "ELECTRONICS", "ELECTRICAL",
                "MECHANICAL", "CIVIL", "MANUFACTURING", "ROBOTICS")
                || containsAny(program,
                "BTECH", "BE_", "MTECH", "ME", "CSE", "AI", "DATA", "CYBER", "IOT",
                "ECE", "EEE", "MECH", "CIVIL", "ROBOTICS", "AUTOMOBILE", "MECHATRONICS", "INDUSTRIAL");
        if (techTrack) {
            return containsAny(text,
                    "ENGINEERING", "TECH", "AI", "CODING", "PROGRAMMING", "ALGORITHM", "DATA",
                    "ROBOT", "AUTONOM", "SYSTEM", "ELECTRONIC", "CIRCUIT", "SOFTWARE", "HARDWARE");
        }

        boolean medicalTrack = containsAny(stream,
                "PCB", "HEALTH", "MEDICAL", "LIFE_SCI", "BIOTECH", "BIO")
                || containsAny(program,
                "MBBS", "BDS", "BAMS", "BHMS", "BUMS", "BVSC", "BPHARM", "PHARMD",
                "NURSING", "BPT", "BOT", "BMLT", "BOPTOM", "BASLP", "BIOTECH", "MICROBIOLOGY");
        if (medicalTrack) {
            return containsAny(text,
                    "MEDICAL", "BIOLOGY", "HEALTH", "CLINICAL", "LIFE SCIENCE", "BIO",
                    "ANATOMY", "PHYSIOLOGY", "PATIENT", "DIAGNOS", "PHARMA", "NEET");
        }

        boolean commerceTrack = containsAny(stream,
                "COMMERCE", "BUSINESS", "FINANCE", "ECONOMICS", "MANAGEMENT")
                || containsAny(program,
                "BBA", "BCOM", "BMS", "BFM", "BAF", "BBI", "MBA", "MCOM", "PGDM", "CA_CS_CMA");
        if (commerceTrack) {
            return containsAny(text,
                    "BUSINESS", "FINANCE", "COMMERCE", "MANAGEMENT", "CAT", "MARKET",
                    "ANALYTICS", "ECON", "ACCOUNT", "BANK", "INVEST", "SUPPLY CHAIN", "OPERATIONS");
        }

        boolean lawPolicyTrack = containsAny(stream,
                "LAW", "POLICY", "GOV", "HUMANITIES", "SOCIAL", "MEDIA", "COMM")
                || containsAny(program,
                "LLB", "BALLB", "BBALLB", "BCOMLLB", "LLM", "BA_", "MA", "JOURNALISM");
        if (lawPolicyTrack) {
            return containsAny(text,
                    "LAW", "LEGAL", "CLAT", "POLICY", "GOVERNANCE", "PUBLIC ADMIN", "CONSTITUTION",
                    "HUMANITIES", "SOCIAL", "LANGUAGE", "COMMUNICATION", "CURRENT AFFAIRS");
        }

        boolean designCreativeTrack = containsAny(stream,
                "ARCH", "DESIGN", "CREATIVE", "MEDIA", "PERFORMING")
                || containsAny(program,
                "BARCH", "BPLAN", "BDES", "BFA", "BID", "BFD", "ANIMATION", "VFX", "BPA");
        if (designCreativeTrack) {
            return containsAny(text,
                    "DESIGN", "CREATIVE", "UX", "UI", "VISUAL", "MEDIA", "PRODUCT", "ARCHITECTURE", "PORTFOLIO");
        }

        boolean scienceResearchTrack = containsAny(stream,
                "SCIENCE", "PURE_SCIENCES", "RESEARCH", "AGRI", "FOOD", "ENV")
                || containsAny(program,
                "BSC", "MSC", "BSC_", "MSC_", "AGRICULTURE", "FORENSIC", "ENVIRONMENT", "MPH");
        if (scienceResearchTrack) {
            return containsAny(text,
                    "RESEARCH", "SCIENTIFIC", "LAB", "EXPERIMENT", "STATISTICS", "ANALYSIS",
                    "ENVIRONMENT", "SUSTAIN", "AGRICULTURE", "BIO", "CHEMISTRY", "PHYSICS");
        }

        boolean serviceTrack = containsAny(stream,
                "HOSPITALITY", "TOURISM", "DEFENCE", "AVIATION", "MARITIME", "SPORTS")
                || containsAny(program,
                "BHM", "BBA_HOSPITALITY", "BBA_AVIATION", "DIPLOMA_HOSPITALITY", "BTECH_MARINE", "BPED");
        if (serviceTrack) {
            return containsAny(text,
                    "OPERATIONS", "SERVICE", "HOSPITALITY", "CUSTOMER", "AVIATION", "MARITIME",
                    "TRAVEL", "DISCIPLINE", "TEAM", "LEADERSHIP");
        }
        return false;
    }

    private boolean containsAny(String source, String... needles) {
        if (source == null || source.isEmpty() || needles == null || needles.length == 0) {
            return false;
        }
        for (String needle : needles) {
            if (needle != null && !needle.isEmpty() && source.contains(needle)) {
                return true;
            }
        }
        return false;
    }

    private String questionCodeKey(RDCIQuestionBank question) {
        if (question == null || question.getQuestionCode() == null) {
            return null;
        }
        String code = question.getQuestionCode().trim().toUpperCase(Locale.ENGLISH);
        return code.isEmpty() ? null : code;
    }

    private List<RDCIQuestionBank> resolveServedQuestions(List<RDCIQuestionBank> allQuestions, String questionOrderCsv) {
        if (allQuestions == null || allQuestions.isEmpty()) {
            return List.of();
        }
        if (questionOrderCsv == null || questionOrderCsv.trim().isEmpty()) {
            return allQuestions;
        }
        Set<String> servedCodes = java.util.Arrays.stream(questionOrderCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.toUpperCase(Locale.ENGLISH))
                .collect(Collectors.toCollection(java.util.LinkedHashSet::new));
        if (servedCodes.isEmpty()) {
            return allQuestions;
        }
        List<RDCIQuestionBank> served = allQuestions.stream()
                .filter(q -> q != null
                        && q.getQuestionCode() != null
                        && servedCodes.contains(q.getQuestionCode().trim().toUpperCase(Locale.ENGLISH)))
                .collect(Collectors.toList());
        return served.isEmpty() ? allQuestions : served;
    }

    private SessionScoreSummary normalizeAdaptiveScoreSummary(SessionScoreSummary original,
                                                              List<RDCIQuestionBank> servedQuestions,
                                                              Map<String, String> formData) {
        SessionScoreSummary summary = original == null ? new SessionScoreSummary() : original;
        if (servedQuestions == null || servedQuestions.isEmpty() || formData == null) {
            return summary;
        }

        Map<String, RDCIQuestionBank> servedByCode = new LinkedHashMap<>();
        for (RDCIQuestionBank question : servedQuestions) {
            if (question == null || question.getQuestionCode() == null) {
                continue;
            }
            servedByCode.put(question.getQuestionCode().trim().toUpperCase(Locale.ENGLISH), question);
        }

        List<RDCIQuestionBank> effectiveQuestions = servedQuestions;
        Set<String> formQuestionCodes = resolveFormQuestionCodes(formData);
        if (!formQuestionCodes.isEmpty()) {
            List<RDCIQuestionBank> filtered = new ArrayList<>();
            for (String code : formQuestionCodes) {
                RDCIQuestionBank question = servedByCode.get(code);
                if (question != null) {
                    filtered.add(question);
                }
            }
            if (!filtered.isEmpty()) {
                effectiveQuestions = filtered;
            }
        }

        int attempted = 0;
        int correct = 0;
        BigDecimal totalScore = BigDecimal.ZERO;
        BigDecimal maxScore = BigDecimal.ZERO;

        for (RDCIQuestionBank question : effectiveQuestions) {
            if (question == null || question.getQuestionCode() == null) {
                continue;
            }
            BigDecimal weight = question.getWeightage() == null ? BigDecimal.ONE : question.getWeightage();
            maxScore = maxScore.add(weight);

            String selected = trimToNull(formData.get("Q_" + question.getQuestionCode()));
            if (selected == null) {
                continue;
            }
            attempted++;
            String correctOption = trimToNull(question.getCorrectOption());
            if (correctOption != null && correctOption.equalsIgnoreCase(selected)) {
                correct++;
                totalScore = totalScore.add(weight);
            }
        }

        summary.setTotalQuestions(effectiveQuestions.size());
        summary.setAttemptedQuestions(attempted);
        summary.setCorrectAnswers(correct);
        summary.setTotalScore(totalScore);
        summary.setMaxScore(maxScore);
        summary.setScorePercent(calculatePercent(totalScore, maxScore));
        return summary;
    }

    private Set<String> resolveFormQuestionCodes(Map<String, String> formData) {
        Set<String> codes = new java.util.LinkedHashSet<>();
        if (formData == null || formData.isEmpty()) {
            return codes;
        }
        for (String key : formData.keySet()) {
            if (key == null || !key.startsWith("Q_")) {
                continue;
            }
            String code = key.substring(2).trim();
            if (!code.isEmpty()) {
                codes.add(code.toUpperCase(Locale.ENGLISH));
            }
        }
        return codes;
    }

    private double calculatePercent(BigDecimal score, BigDecimal maxScore) {
        if (score == null || maxScore == null || maxScore.compareTo(BigDecimal.ZERO) <= 0) {
            return 0.0;
        }
        return score.multiply(BigDecimal.valueOf(100))
                .divide(maxScore, 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private List<?> parseOptions(String optionsJson) {
        if (optionsJson == null || optionsJson.trim().isEmpty()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(optionsJson, new TypeReference<List<Object>>() {});
        } catch (Exception ex) {
            return List.of();
        }
    }

    private String toJson(Object value, String fallback) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception ex) {
            return fallback;
        }
    }
}
