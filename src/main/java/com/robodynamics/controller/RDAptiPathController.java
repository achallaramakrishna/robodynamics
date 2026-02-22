package com.robodynamics.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.robodynamics.model.RDCIAssessmentSession;
import com.robodynamics.model.RDCIIntakeResponse;
import com.robodynamics.model.RDCIRecommendationSnapshot;
import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDAptiPathAnalyticsService;
import com.robodynamics.service.RDCIAssessmentSessionService;
import com.robodynamics.service.RDCIIntakeService;
import com.robodynamics.service.RDCIRecommendationService;
import com.robodynamics.service.RDCISubscriptionService;
import com.robodynamics.service.RDUserService;

@RestController
@RequestMapping("/aptipath/api")
public class RDAptiPathController {

    @Autowired
    private RDCISubscriptionService ciSubscriptionService;

    @Autowired
    private RDCIAssessmentSessionService ciAssessmentSessionService;

    @Autowired
    private RDUserService rdUserService;

    @Autowired
    private RDCIIntakeService ciIntakeService;

    @Autowired
    private RDCIRecommendationService ciRecommendationService;

    @Autowired
    private RDAptiPathAnalyticsService aptiPathAnalyticsService;

    @PostMapping("/subscriptions")
    public ResponseEntity<?> createSubscription(@RequestBody SubscriptionCreateRequest request) {
        if (request == null || isBlank(request.getPlanKey()) || isBlank(request.getPlanName()) || isBlank(request.getPlanType())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "FAILED", "message", "planKey, planName, and planType are required."));
        }

        RDUser parentUser = findUser(request.getParentUserId());
        RDUser studentUser = findUser(request.getStudentUserId());

        RDCISubscription subscription = ciSubscriptionService.recordCheckoutSuccess(
                parentUser,
                studentUser,
                request.getPlanKey(),
                request.getPlanName(),
                request.getPlanType(),
                request.getBillingLabel(),
                request.getBaseAmount(),
                request.getGstAmount(),
                request.getTotalAmount(),
                request.getGstPercentLabel(),
                request.getProviderName(),
                request.getProviderOrderId(),
                request.getProviderPaymentId(),
                request.getProviderSignature(),
                request.getCourseId());

        return ResponseEntity.status(HttpStatus.CREATED).body(toSubscriptionResponse(subscription));
    }

    @GetMapping("/subscriptions/{subscriptionId}")
    public ResponseEntity<?> getSubscription(@PathVariable Long subscriptionId) {
        RDCISubscription subscription = ciSubscriptionService.getById(subscriptionId);
        if (subscription == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "NOT_FOUND", "message", "Subscription not found."));
        }
        return ResponseEntity.ok(toSubscriptionResponse(subscription));
    }

    @GetMapping("/subscriptions/parent/{parentUserId}")
    public ResponseEntity<?> getSubscriptionsByParent(@PathVariable Integer parentUserId) {
        List<Map<String, Object>> rows = ciSubscriptionService.getByParentUserId(parentUserId)
                .stream()
                .map(this::toSubscriptionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rows);
    }

    @PostMapping("/sessions")
    public ResponseEntity<?> createAssessmentSession(@RequestBody SessionCreateRequest request) {
        if (request == null || request.getSubscriptionId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "FAILED", "message", "subscriptionId is required."));
        }
        try {
            RDCIAssessmentSession session = ciAssessmentSessionService.createSession(
                    request.getSubscriptionId(),
                    request.getStudentUserId(),
                    request.getAssessmentVersion());
            return ResponseEntity.status(HttpStatus.CREATED).body(toSessionResponse(session));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", ex.getMessage()));
        }
    }

    @PostMapping("/sessions/{sessionId}/start")
    public ResponseEntity<?> startAssessmentSession(@PathVariable Long sessionId) {
        try {
            RDCIAssessmentSession session = ciAssessmentSessionService.markInProgress(sessionId);
            return ResponseEntity.ok(toSessionResponse(session));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "NOT_FOUND", "message", ex.getMessage()));
        }
    }

    @PostMapping("/sessions/{sessionId}/complete")
    public ResponseEntity<?> completeAssessmentSession(@PathVariable Long sessionId,
                                                       @RequestBody(required = false) CompleteSessionRequest request) {
        Integer durationSeconds = request == null ? null : request.getDurationSeconds();
        try {
            RDCIAssessmentSession session = ciAssessmentSessionService.completeSession(sessionId, durationSeconds);
            return ResponseEntity.ok(toSessionResponse(session));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "NOT_FOUND", "message", ex.getMessage()));
        }
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<?> getAssessmentSession(@PathVariable Long sessionId) {
        RDCIAssessmentSession session = ciAssessmentSessionService.getById(sessionId);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "NOT_FOUND", "message", "Assessment session not found."));
        }
        return ResponseEntity.ok(toSessionResponse(session));
    }

    @GetMapping("/sessions/student/{studentUserId}")
    public ResponseEntity<?> getAssessmentSessionsByStudent(@PathVariable Integer studentUserId) {
        List<Map<String, Object>> rows = ciAssessmentSessionService.getByStudentUserId(studentUserId)
                .stream()
                .map(this::toSessionResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rows);
    }

    @PostMapping("/intake")
    public ResponseEntity<?> saveIntakeResponse(@RequestBody IntakeSaveRequest request) {
        if (request == null || request.getSubscriptionId() == null
                || isBlank(request.getRespondentType())
                || isBlank(request.getQuestionCode())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILED",
                    "message", "subscriptionId, respondentType, and questionCode are required."));
        }
        try {
            RDCIIntakeResponse row = ciIntakeService.saveResponse(
                    request.getSubscriptionId(),
                    request.getParentUserId(),
                    request.getStudentUserId(),
                    request.getRespondentType(),
                    request.getSectionCode(),
                    request.getQuestionCode(),
                    request.getAnswerValue(),
                    request.getAnswerJson());
            return ResponseEntity.status(HttpStatus.CREATED).body(toIntakeResponse(row));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", ex.getMessage()));
        }
    }

    @PostMapping("/intake/bulk")
    public ResponseEntity<?> saveIntakeResponses(@RequestBody IntakeBulkSaveRequest request) {
        if (request == null || request.getSubscriptionId() == null
                || isBlank(request.getRespondentType())
                || request.getItems() == null || request.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILED",
                    "message", "subscriptionId, respondentType, and at least one item are required."));
        }
        try {
            List<Map<String, Object>> saved = request.getItems().stream()
                    .filter(item -> item != null && !isBlank(item.getQuestionCode()))
                    .map(item -> ciIntakeService.saveResponse(
                            request.getSubscriptionId(),
                            request.getParentUserId(),
                            request.getStudentUserId(),
                            request.getRespondentType(),
                            request.getSectionCode(),
                            item.getQuestionCode(),
                            item.getAnswerValue(),
                            item.getAnswerJson()))
                    .map(this::toIntakeResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", ex.getMessage()));
        }
    }

    @GetMapping("/intake/subscription/{subscriptionId}")
    public ResponseEntity<?> getIntakeBySubscription(@PathVariable Long subscriptionId) {
        List<Map<String, Object>> rows = ciIntakeService.getBySubscriptionId(subscriptionId)
                .stream()
                .map(this::toIntakeResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rows);
    }

    @PostMapping("/recommendations")
    public ResponseEntity<?> saveRecommendation(@RequestBody RecommendationSaveRequest request) {
        if (request == null || request.getAssessmentSessionId() == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILED", "message", "assessmentSessionId is required."));
        }
        try {
            RDCIRecommendationSnapshot snapshot = ciRecommendationService.saveSnapshot(
                    request.getAssessmentSessionId(),
                    request.getRecommendationVersion(),
                    request.getStreamFitJson(),
                    request.getCareerClustersJson(),
                    request.getPlanAJson(),
                    request.getPlanBJson(),
                    request.getPlanCJson(),
                    request.getSummaryText());
            return ResponseEntity.status(HttpStatus.CREATED).body(toRecommendationResponse(snapshot));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", ex.getMessage()));
        }
    }

    @GetMapping("/recommendations/session/{assessmentSessionId}")
    public ResponseEntity<?> getRecommendationsBySession(@PathVariable Long assessmentSessionId) {
        List<Map<String, Object>> rows = ciRecommendationService.getByAssessmentSessionId(assessmentSessionId)
                .stream()
                .map(this::toRecommendationResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rows);
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getAnalyticsSummary() {
        return ResponseEntity.ok(aptiPathAnalyticsService.getSummary());
    }

    private RDUser findUser(Integer userId) {
        if (userId == null) {
            return null;
        }
        return rdUserService.getRDUser(userId);
    }

    private Map<String, Object> toSubscriptionResponse(RDCISubscription subscription) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("subscriptionId", subscription.getCiSubscriptionId());
        response.put("parentUserId", subscription.getParentUser() == null ? null : subscription.getParentUser().getUserID());
        response.put("studentUserId", subscription.getStudentUser() == null ? null : subscription.getStudentUser().getUserID());
        response.put("planKey", subscription.getPlanKey());
        response.put("planName", subscription.getPlanName());
        response.put("planType", subscription.getPlanType());
        response.put("moduleCode", subscription.getModuleCode());
        response.put("billingLabel", subscription.getBillingLabel());
        response.put("status", subscription.getStatus());
        response.put("baseAmount", subscription.getBaseAmount());
        response.put("gstAmount", subscription.getGstAmount());
        response.put("totalAmount", subscription.getTotalAmount());
        response.put("gstPercent", subscription.getGstPercent());
        response.put("currency", subscription.getCurrency());
        response.put("paymentProvider", subscription.getPaymentProvider());
        response.put("providerOrderId", subscription.getProviderOrderId());
        response.put("providerPaymentId", subscription.getProviderPaymentId());
        response.put("courseId", subscription.getCourseId());
        response.put("startAt", subscription.getStartAt());
        response.put("endAt", subscription.getEndAt());
        response.put("createdAt", subscription.getCreatedAt());
        response.put("updatedAt", subscription.getUpdatedAt());
        return response;
    }

    private Map<String, Object> toSessionResponse(RDCIAssessmentSession session) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("sessionId", session.getCiAssessmentSessionId());
        response.put("subscriptionId", session.getSubscription() == null ? null : session.getSubscription().getCiSubscriptionId());
        response.put("studentUserId", session.getStudentUser() == null ? null : session.getStudentUser().getUserID());
        response.put("assessmentVersion", session.getAssessmentVersion());
        response.put("status", session.getStatus());
        response.put("attemptNo", session.getAttemptNo());
        response.put("startedAt", session.getStartedAt());
        response.put("completedAt", session.getCompletedAt());
        response.put("durationSeconds", session.getDurationSeconds());
        response.put("createdAt", session.getCreatedAt());
        response.put("updatedAt", session.getUpdatedAt());
        return response;
    }

    private Map<String, Object> toIntakeResponse(RDCIIntakeResponse responseRow) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("intakeResponseId", responseRow.getCiIntakeResponseId());
        response.put("subscriptionId", responseRow.getSubscription() == null ? null : responseRow.getSubscription().getCiSubscriptionId());
        response.put("parentUserId", responseRow.getParentUser() == null ? null : responseRow.getParentUser().getUserID());
        response.put("studentUserId", responseRow.getStudentUser() == null ? null : responseRow.getStudentUser().getUserID());
        response.put("respondentType", responseRow.getRespondentType());
        response.put("sectionCode", responseRow.getSectionCode());
        response.put("questionCode", responseRow.getQuestionCode());
        response.put("answerValue", responseRow.getAnswerValue());
        response.put("answerJson", responseRow.getAnswerJson());
        response.put("createdAt", responseRow.getCreatedAt());
        response.put("updatedAt", responseRow.getUpdatedAt());
        return response;
    }

    private Map<String, Object> toRecommendationResponse(RDCIRecommendationSnapshot snapshot) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("recommendationSnapshotId", snapshot.getCiRecommendationSnapshotId());
        response.put("assessmentSessionId", snapshot.getAssessmentSession() == null ? null : snapshot.getAssessmentSession().getCiAssessmentSessionId());
        response.put("recommendationVersion", snapshot.getRecommendationVersion());
        response.put("streamFitJson", snapshot.getStreamFitJson());
        response.put("careerClustersJson", snapshot.getCareerClustersJson());
        response.put("planAJson", snapshot.getPlanAJson());
        response.put("planBJson", snapshot.getPlanBJson());
        response.put("planCJson", snapshot.getPlanCJson());
        response.put("summaryText", snapshot.getSummaryText());
        response.put("createdAt", snapshot.getCreatedAt());
        response.put("updatedAt", snapshot.getUpdatedAt());
        return response;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    public static class SubscriptionCreateRequest {
        private Integer parentUserId;
        private Integer studentUserId;
        private String planKey;
        private String planName;
        private String planType;
        private String billingLabel;
        private Integer baseAmount;
        private Integer gstAmount;
        private Integer totalAmount;
        private String gstPercentLabel;
        private String providerName;
        private String providerOrderId;
        private String providerPaymentId;
        private String providerSignature;
        private Integer courseId;

        public Integer getParentUserId() {
            return parentUserId;
        }

        public void setParentUserId(Integer parentUserId) {
            this.parentUserId = parentUserId;
        }

        public Integer getStudentUserId() {
            return studentUserId;
        }

        public void setStudentUserId(Integer studentUserId) {
            this.studentUserId = studentUserId;
        }

        public String getPlanKey() {
            return planKey;
        }

        public void setPlanKey(String planKey) {
            this.planKey = planKey;
        }

        public String getPlanName() {
            return planName;
        }

        public void setPlanName(String planName) {
            this.planName = planName;
        }

        public String getPlanType() {
            return planType;
        }

        public void setPlanType(String planType) {
            this.planType = planType;
        }

        public String getBillingLabel() {
            return billingLabel;
        }

        public void setBillingLabel(String billingLabel) {
            this.billingLabel = billingLabel;
        }

        public Integer getBaseAmount() {
            return baseAmount;
        }

        public void setBaseAmount(Integer baseAmount) {
            this.baseAmount = baseAmount;
        }

        public Integer getGstAmount() {
            return gstAmount;
        }

        public void setGstAmount(Integer gstAmount) {
            this.gstAmount = gstAmount;
        }

        public Integer getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(Integer totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getGstPercentLabel() {
            return gstPercentLabel;
        }

        public void setGstPercentLabel(String gstPercentLabel) {
            this.gstPercentLabel = gstPercentLabel;
        }

        public String getProviderName() {
            return providerName;
        }

        public void setProviderName(String providerName) {
            this.providerName = providerName;
        }

        public String getProviderOrderId() {
            return providerOrderId;
        }

        public void setProviderOrderId(String providerOrderId) {
            this.providerOrderId = providerOrderId;
        }

        public String getProviderPaymentId() {
            return providerPaymentId;
        }

        public void setProviderPaymentId(String providerPaymentId) {
            this.providerPaymentId = providerPaymentId;
        }

        public String getProviderSignature() {
            return providerSignature;
        }

        public void setProviderSignature(String providerSignature) {
            this.providerSignature = providerSignature;
        }

        public Integer getCourseId() {
            return courseId;
        }

        public void setCourseId(Integer courseId) {
            this.courseId = courseId;
        }
    }

    public static class SessionCreateRequest {
        private Long subscriptionId;
        private Integer studentUserId;
        private String assessmentVersion;

        public Long getSubscriptionId() {
            return subscriptionId;
        }

        public void setSubscriptionId(Long subscriptionId) {
            this.subscriptionId = subscriptionId;
        }

        public Integer getStudentUserId() {
            return studentUserId;
        }

        public void setStudentUserId(Integer studentUserId) {
            this.studentUserId = studentUserId;
        }

        public String getAssessmentVersion() {
            return assessmentVersion;
        }

        public void setAssessmentVersion(String assessmentVersion) {
            this.assessmentVersion = assessmentVersion;
        }
    }

    public static class CompleteSessionRequest {
        private Integer durationSeconds;

        public Integer getDurationSeconds() {
            return durationSeconds;
        }

        public void setDurationSeconds(Integer durationSeconds) {
            this.durationSeconds = durationSeconds;
        }
    }

    public static class IntakeSaveRequest {
        private Long subscriptionId;
        private Integer parentUserId;
        private Integer studentUserId;
        private String respondentType;
        private String sectionCode;
        private String questionCode;
        private String answerValue;
        private String answerJson;

        public Long getSubscriptionId() {
            return subscriptionId;
        }

        public void setSubscriptionId(Long subscriptionId) {
            this.subscriptionId = subscriptionId;
        }

        public Integer getParentUserId() {
            return parentUserId;
        }

        public void setParentUserId(Integer parentUserId) {
            this.parentUserId = parentUserId;
        }

        public Integer getStudentUserId() {
            return studentUserId;
        }

        public void setStudentUserId(Integer studentUserId) {
            this.studentUserId = studentUserId;
        }

        public String getRespondentType() {
            return respondentType;
        }

        public void setRespondentType(String respondentType) {
            this.respondentType = respondentType;
        }

        public String getSectionCode() {
            return sectionCode;
        }

        public void setSectionCode(String sectionCode) {
            this.sectionCode = sectionCode;
        }

        public String getQuestionCode() {
            return questionCode;
        }

        public void setQuestionCode(String questionCode) {
            this.questionCode = questionCode;
        }

        public String getAnswerValue() {
            return answerValue;
        }

        public void setAnswerValue(String answerValue) {
            this.answerValue = answerValue;
        }

        public String getAnswerJson() {
            return answerJson;
        }

        public void setAnswerJson(String answerJson) {
            this.answerJson = answerJson;
        }
    }

    public static class IntakeBulkSaveRequest {
        private Long subscriptionId;
        private Integer parentUserId;
        private Integer studentUserId;
        private String respondentType;
        private String sectionCode;
        private List<IntakeItem> items;

        public Long getSubscriptionId() {
            return subscriptionId;
        }

        public void setSubscriptionId(Long subscriptionId) {
            this.subscriptionId = subscriptionId;
        }

        public Integer getParentUserId() {
            return parentUserId;
        }

        public void setParentUserId(Integer parentUserId) {
            this.parentUserId = parentUserId;
        }

        public Integer getStudentUserId() {
            return studentUserId;
        }

        public void setStudentUserId(Integer studentUserId) {
            this.studentUserId = studentUserId;
        }

        public String getRespondentType() {
            return respondentType;
        }

        public void setRespondentType(String respondentType) {
            this.respondentType = respondentType;
        }

        public String getSectionCode() {
            return sectionCode;
        }

        public void setSectionCode(String sectionCode) {
            this.sectionCode = sectionCode;
        }

        public List<IntakeItem> getItems() {
            return items;
        }

        public void setItems(List<IntakeItem> items) {
            this.items = items;
        }
    }

    public static class IntakeItem {
        private String questionCode;
        private String answerValue;
        private String answerJson;

        public String getQuestionCode() {
            return questionCode;
        }

        public void setQuestionCode(String questionCode) {
            this.questionCode = questionCode;
        }

        public String getAnswerValue() {
            return answerValue;
        }

        public void setAnswerValue(String answerValue) {
            this.answerValue = answerValue;
        }

        public String getAnswerJson() {
            return answerJson;
        }

        public void setAnswerJson(String answerJson) {
            this.answerJson = answerJson;
        }
    }

    public static class RecommendationSaveRequest {
        private Long assessmentSessionId;
        private String recommendationVersion;
        private String streamFitJson;
        private String careerClustersJson;
        private String planAJson;
        private String planBJson;
        private String planCJson;
        private String summaryText;

        public Long getAssessmentSessionId() {
            return assessmentSessionId;
        }

        public void setAssessmentSessionId(Long assessmentSessionId) {
            this.assessmentSessionId = assessmentSessionId;
        }

        public String getRecommendationVersion() {
            return recommendationVersion;
        }

        public void setRecommendationVersion(String recommendationVersion) {
            this.recommendationVersion = recommendationVersion;
        }

        public String getStreamFitJson() {
            return streamFitJson;
        }

        public void setStreamFitJson(String streamFitJson) {
            this.streamFitJson = streamFitJson;
        }

        public String getCareerClustersJson() {
            return careerClustersJson;
        }

        public void setCareerClustersJson(String careerClustersJson) {
            this.careerClustersJson = careerClustersJson;
        }

        public String getPlanAJson() {
            return planAJson;
        }

        public void setPlanAJson(String planAJson) {
            this.planAJson = planAJson;
        }

        public String getPlanBJson() {
            return planBJson;
        }

        public void setPlanBJson(String planBJson) {
            this.planBJson = planBJson;
        }

        public String getPlanCJson() {
            return planCJson;
        }

        public void setPlanCJson(String planCJson) {
            this.planCJson = planCJson;
        }

        public String getSummaryText() {
            return summaryText;
        }

        public void setSummaryText(String summaryText) {
            this.summaryText = summaryText;
        }
    }
}
