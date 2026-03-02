package com.robodynamics.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCISubscriptionService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/plans")
public class RDSubscriptionCheckoutController {

    @Autowired
    private RDCISubscriptionService ciSubscriptionService;

    @Autowired
    private RDUserService rdUserService;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:}")
    private String razorpayKeySecret;

    @Value("${rd.pricing.gst.percent:18.0}")
    private double gstPercent;

    @Value("${rd.checkout.bypass.enabled:true}")
    private boolean checkoutBypassEnabled;

    @GetMapping("/checkout")
    public String checkout(@RequestParam(value = "plan", defaultValue = "career-basic") String planKey,
                           @RequestParam(value = "courseId", required = false) Integer courseId,
                           @RequestParam(value = "studentId", required = false) Integer studentId,
                           Model model,
                           HttpSession session) {

        Plan plan = Plan.from(planKey);
        if (plan == null) {
            plan = Plan.CAREER_BASIC;
        }

        String registrationRedirect = buildRegistrationRedirectIfRequired(session, plan.getKey(), courseId, studentId);
        if (registrationRedirect != null) {
            return registrationRedirect;
        }
        if (studentId != null) {
            session.setAttribute("checkoutStudentId", studentId);
        }

        if ("tuition".equals(plan.getTrackType())) {
            String redirect = "redirect:/parents/demo?source=tuition_pricing_quote&selectedPlan=" + plan.getKey();
            if (courseId != null) {
                redirect += "&courseId=" + courseId;
            }
            return redirect;
        }

        model.addAttribute("planKey", plan.getKey());
        model.addAttribute("courseId", courseId);
        model.addAttribute("studentId", studentId);
        model.addAttribute("bypassEnabled", checkoutBypassEnabled);
        model.addAttribute("planName", plan.getDisplayName());
        model.addAttribute("planAmount", plan.getAmount());
        model.addAttribute("planDescription", plan.getDescription());
        model.addAttribute("planFeatures", plan.getFeatures());
        model.addAttribute("planType", plan.getTrackType());
        model.addAttribute("billingLabel", plan.getBillingLabel());

        int baseAmount = plan.getAmount();
        int gstAmount = calculateGstAmount(baseAmount);
        int totalPayable = baseAmount + gstAmount;

        model.addAttribute("planBaseAmount", baseAmount);
        model.addAttribute("planGstAmount", gstAmount);
        model.addAttribute("planTotalPayable", totalPayable);
        model.addAttribute("gstPercentLabel", getGstPercentLabel());

        if (isBlank(razorpayKeyId) || isBlank(razorpayKeySecret)) {
            model.addAttribute("paymentEnabled", false);
            model.addAttribute("paymentError",
                    "Online payment is temporarily unavailable. Please book a doubt-clearing session and our team will help you subscribe.");
            return "subscription-checkout";
        }

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", totalPayable * 100);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "RD_SUB_"
                    + plan.getKey().toUpperCase(Locale.ENGLISH)
                    + "_"
                    + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);

            Order order = client.orders.create(orderRequest);
            String orderId = String.valueOf(order.get("id"));

            model.addAttribute("paymentEnabled", true);
            model.addAttribute("razorpayKey", razorpayKeyId);
            model.addAttribute("razorpayOrderId", orderId);

            session.setAttribute("checkoutPlan", plan.getKey());
            session.setAttribute("checkoutOrderId", orderId);
            session.setAttribute("checkoutCourseId", courseId);
        } catch (Exception ex) {
            model.addAttribute("paymentEnabled", false);
            model.addAttribute("paymentError",
                    "We could not start checkout right now. Please try again or book a doubt-clearing session.");
        }

        return "subscription-checkout";
    }

    @PostMapping(value = "/verify", produces = "application/json")
    @ResponseBody
    public Map<String, String> verify(@RequestBody Map<String, String> payload,
                                      HttpSession session) throws Exception {

        String orderId = trim(payload.get("orderId"));
        String paymentId = trim(payload.get("paymentId"));
        String signature = trim(payload.get("signature"));

        String checkoutOrderId = (String) session.getAttribute("checkoutOrderId");
        String checkoutPlan = (String) session.getAttribute("checkoutPlan");
        Integer checkoutCourseId = (Integer) session.getAttribute("checkoutCourseId");

        if (isBlank(orderId)
                || isBlank(paymentId)
                || isBlank(signature)
                || isBlank(checkoutOrderId)
                || !checkoutOrderId.equals(orderId)
                || isBlank(checkoutPlan)
                || isBlank(razorpayKeySecret)) {
            return Map.of("status", "FAILED");
        }

        String signedPayload = orderId + "|" + paymentId;
        boolean valid = Utils.verifySignature(signedPayload, signature, razorpayKeySecret);
        if (!valid) {
            return Map.of("status", "FAILED");
        }

        Plan plan = Plan.from(checkoutPlan);
        if (plan == null) {
            plan = Plan.CAREER_BASIC;
        }

        session.setAttribute("lastSubscriptionPlanName", plan.getDisplayName());
        session.setAttribute("lastSubscriptionPlanKey", plan.getKey());
        session.setAttribute("lastSubscriptionAmount", plan.getAmount());
        session.setAttribute("lastSubscriptionPaymentId", paymentId);
        session.setAttribute("lastSubscriptionOrderId", orderId);
        session.setAttribute("lastSubscriptionPlanType", plan.getTrackType());
        session.setAttribute("lastSubscriptionCourseId", checkoutCourseId);

        int baseAmount = plan.getAmount();
        int gstAmount = calculateGstAmount(baseAmount);
        int totalAmount = baseAmount + gstAmount;
        Long ciSubscriptionId = persistSubscriptionRecord(
                session,
                plan,
                baseAmount,
                gstAmount,
                totalAmount,
                orderId,
                paymentId,
                signature,
                checkoutCourseId,
                "RAZORPAY");
        if (ciSubscriptionId == null) {
            return Map.of("status", "FAILED");
        }
        if (ciSubscriptionId != null) {
            session.setAttribute("lastCiSubscriptionId", ciSubscriptionId);
        }
        session.setAttribute("lastSubscriptionBaseAmount", baseAmount);
        session.setAttribute("lastSubscriptionGstAmount", gstAmount);
        session.setAttribute("lastSubscriptionTotalAmount", totalAmount);
        session.setAttribute("lastSubscriptionGstPercentLabel", getGstPercentLabel());

        session.removeAttribute("checkoutPlan");
        session.removeAttribute("checkoutOrderId");
        session.removeAttribute("checkoutCourseId");
        session.removeAttribute("checkoutStudentId");

        return Map.of(
                "status", "SUCCESS",
                "redirectUrl", "/plans/success");
    }

    @PostMapping("/bypass")
    public String bypass(@RequestParam(value = "plan", defaultValue = "exam-basic") String planKey,
                         @RequestParam(value = "courseId", required = false) Integer courseId,
                         @RequestParam(value = "studentId", required = false) Integer studentId,
                         HttpSession session) {

        Plan plan = Plan.from(planKey);
        if (plan == null) {
            plan = Plan.EXAM_BASIC;
        }

        String registrationRedirect = buildRegistrationRedirectIfRequired(session, plan.getKey(), courseId, studentId);
        if (registrationRedirect != null) {
            return registrationRedirect;
        }
        if (studentId != null) {
            session.setAttribute("checkoutStudentId", studentId);
        }

        if ("tuition".equals(plan.getTrackType())) {
            String redirect = "redirect:/parents/demo?source=tuition_pricing_quote&selectedPlan=" + plan.getKey();
            if (courseId != null) {
                redirect += "&courseId=" + courseId;
            }
            return redirect;
        }

        if (!checkoutBypassEnabled) {
            String fallback = "redirect:/plans/checkout?plan=" + plan.getKey();
            if (courseId != null) {
                fallback += "&courseId=" + courseId;
            }
            return fallback;
        }

        int baseAmount = plan.getAmount();
        int gstAmount = calculateGstAmount(baseAmount);
        int totalAmount = baseAmount + gstAmount;
        String marker = String.valueOf(System.currentTimeMillis());

        session.setAttribute("lastSubscriptionPlanName", plan.getDisplayName());
        session.setAttribute("lastSubscriptionPlanKey", plan.getKey());
        session.setAttribute("lastSubscriptionAmount", plan.getAmount());
        session.setAttribute("lastSubscriptionPaymentId", "BYPASS_PAY_" + marker);
        session.setAttribute("lastSubscriptionOrderId", "BYPASS_ORDER_" + marker);
        session.setAttribute("lastSubscriptionPlanType", plan.getTrackType());
        session.setAttribute("lastSubscriptionBaseAmount", baseAmount);
        session.setAttribute("lastSubscriptionGstAmount", gstAmount);
        session.setAttribute("lastSubscriptionTotalAmount", totalAmount);
        session.setAttribute("lastSubscriptionGstPercentLabel", getGstPercentLabel());
        session.setAttribute("lastSubscriptionCourseId", courseId);
        Long ciSubscriptionId = persistSubscriptionRecord(
                session,
                plan,
                baseAmount,
                gstAmount,
                totalAmount,
                "BYPASS_ORDER_" + marker,
                "BYPASS_PAY_" + marker,
                null,
                courseId,
                "BYPASS");
        if (ciSubscriptionId == null) {
            String fallback = "redirect:/plans/checkout?plan=" + plan.getKey();
            if (courseId != null) {
                fallback += "&courseId=" + courseId;
            }
            if (studentId != null) {
                fallback += "&studentId=" + studentId;
            }
            return fallback;
        }
        if (ciSubscriptionId != null) {
            session.setAttribute("lastCiSubscriptionId", ciSubscriptionId);
        }

        return "redirect:/plans/success?bypass=true";
    }

    @GetMapping("/success")
    public String success(Model model, HttpSession session) {
        String planName = (String) session.getAttribute("lastSubscriptionPlanName");
        String planKey = (String) session.getAttribute("lastSubscriptionPlanKey");
        Integer amount = (Integer) session.getAttribute("lastSubscriptionAmount");
        String paymentId = (String) session.getAttribute("lastSubscriptionPaymentId");
        String orderId = (String) session.getAttribute("lastSubscriptionOrderId");
        String planType = (String) session.getAttribute("lastSubscriptionPlanType");
        Integer courseId = (Integer) session.getAttribute("lastSubscriptionCourseId");
        Integer baseAmount = (Integer) session.getAttribute("lastSubscriptionBaseAmount");
        Integer gstAmount = (Integer) session.getAttribute("lastSubscriptionGstAmount");
        Integer totalAmount = (Integer) session.getAttribute("lastSubscriptionTotalAmount");
        String gstPercentLabel = (String) session.getAttribute("lastSubscriptionGstPercentLabel");
        Long ciSubscriptionId = toLong(session.getAttribute("lastCiSubscriptionId"));

        int resolvedBase = baseAmount != null ? baseAmount : (amount != null ? amount : 0);
        int resolvedGst = gstAmount != null ? gstAmount : calculateGstAmount(resolvedBase);
        int resolvedTotal = totalAmount != null ? totalAmount : (resolvedBase + resolvedGst);

        model.addAttribute("planName", isBlank(planName) ? "Selected Plan" : planName);
        model.addAttribute("amount", resolvedTotal);
        model.addAttribute("baseAmount", resolvedBase);
        model.addAttribute("gstAmount", resolvedGst);
        model.addAttribute("totalAmount", resolvedTotal);
        model.addAttribute("gstPercentLabel", isBlank(gstPercentLabel) ? getGstPercentLabel() : gstPercentLabel);
        model.addAttribute("paymentId", isBlank(paymentId) ? "NA" : paymentId);
        model.addAttribute("orderId", isBlank(orderId) ? "NA" : orderId);
        model.addAttribute("planType", isBlank(planType) ? "exam" : planType);
        model.addAttribute("planKey", isBlank(planKey) ? "" : planKey);
        model.addAttribute("courseId", courseId);
        model.addAttribute("ciSubscriptionId", ciSubscriptionId);

        return "subscription-success";
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private int calculateGstAmount(int baseAmount) {
        return (int) Math.round(baseAmount * gstPercent / 100.0d);
    }

    private String getGstPercentLabel() {
        if (gstPercent == Math.floor(gstPercent)) {
            return String.valueOf((int) gstPercent);
        }
        return String.format(Locale.ENGLISH, "%.2f", gstPercent);
    }

    private Long persistSubscriptionRecord(HttpSession session,
                                           Plan plan,
                                           int baseAmount,
                                           int gstAmount,
                                           int totalAmount,
                                           String orderId,
                                           String paymentId,
                                           String signature,
                                           Integer courseId,
                                           String providerName) {
        if (plan == null) {
            return null;
        }
        try {
            RDUser loggedInUser = resolveLoggedInUser(session);
            RDUser parentUser = resolveParentUser(loggedInUser);
            RDUser studentUser = resolveStudentUser(session, loggedInUser, parentUser);

            RDCISubscription subscription = ciSubscriptionService.recordCheckoutSuccess(
                    parentUser,
                    studentUser,
                    plan.getKey(),
                    plan.getDisplayName(),
                    plan.getTrackType(),
                    plan.getBillingLabel(),
                    baseAmount,
                    gstAmount,
                    totalAmount,
                    getGstPercentLabel(),
                    providerName,
                    orderId,
                    paymentId,
                    signature,
                    courseId);

            return subscription == null ? null : subscription.getCiSubscriptionId();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    private String buildRegistrationRedirectIfRequired(HttpSession session,
                                                       String planKey,
                                                       Integer courseId,
                                                       Integer studentId) {
        RDUser loggedInUser = resolveLoggedInUser(session);
        if (!requiresParentChildRegistration(loggedInUser)) {
            return null;
        }
        StringBuilder checkoutTarget = new StringBuilder("/plans/checkout?plan=").append(planKey);
        if (courseId != null) {
            checkoutTarget.append("&courseId=").append(courseId);
        }
        if (studentId != null) {
            checkoutTarget.append("&studentId=").append(studentId);
        }
        String encodedRedirect = URLEncoder.encode(checkoutTarget.toString(), StandardCharsets.UTF_8);
        StringBuilder registerRedirect = new StringBuilder("redirect:/registerParentChild?plan=").append(planKey);
        if (courseId != null) {
            registerRedirect.append("&courseId=").append(courseId);
        }
        registerRedirect.append("&redirect=").append(encodedRedirect);
        return registerRedirect.toString();
    }

    private boolean requiresParentChildRegistration(RDUser user) {
        if (user == null || user.getUserID() == null) {
            return true;
        }
        if (user.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
            List<RDUser> children = rdUserService.getRDChilds(user.getUserID());
            return children == null || children.isEmpty();
        }
        if (user.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
            return (user.getMom() == null || user.getMom().getUserID() == null)
                    && (user.getDad() == null || user.getDad().getUserID() == null);
        }
        return true;
    }

    private RDUser resolveLoggedInUser(HttpSession session) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return null;
        }
        RDUser sessionUser = (RDUser) rawUser;
        if (sessionUser.getUserID() == null) {
            return null;
        }
        return rdUserService.getRDUser(sessionUser.getUserID());
    }

    private RDUser resolveParentUser(RDUser loggedInUser) {
        if (loggedInUser == null) {
            return null;
        }

        if (loggedInUser.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
            return loggedInUser;
        }

        if (loggedInUser.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
            if (loggedInUser.getMom() != null && loggedInUser.getMom().getUserID() != null) {
                return rdUserService.getRDUser(loggedInUser.getMom().getUserID());
            }
            if (loggedInUser.getDad() != null && loggedInUser.getDad().getUserID() != null) {
                return rdUserService.getRDUser(loggedInUser.getDad().getUserID());
            }
        }

        return loggedInUser;
    }

    private RDUser resolveStudentUser(HttpSession session, RDUser loggedInUser, RDUser parentUser) {
        Integer selectedStudentId = resolveSelectedStudentId(session);
        if (selectedStudentId != null) {
            return rdUserService.getRDUser(selectedStudentId);
        }

        if (loggedInUser != null && loggedInUser.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
            return loggedInUser;
        }

        if (parentUser != null && parentUser.getUserID() != null) {
            List<RDUser> children = rdUserService.getRDChilds(parentUser.getUserID());
            if (children != null && !children.isEmpty()) {
                return children.get(0);
            }
        }
        return null;
    }

    private Integer resolveSelectedStudentId(HttpSession session) {
        String[] keys = { "checkoutStudentId", "selectedStudentId", "selectedChildId", "childId", "studentId" };
        for (String key : keys) {
            Integer parsed = toInteger(session.getAttribute(key));
            if (parsed != null) {
                return parsed;
            }
        }
        return null;
    }

    private Integer toInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        if (value instanceof String) {
            String raw = ((String) value).trim();
            if (raw.isEmpty()) {
                return null;
            }
            try {
                return Integer.valueOf(raw);
            } catch (NumberFormatException ex) {
                return null;
            }
        }
        return null;
    }

    private Long toLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Long) {
            return (Long) value;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        if (value instanceof String) {
            String raw = ((String) value).trim();
            if (raw.isEmpty()) {
                return null;
            }
            try {
                return Long.valueOf(raw);
            } catch (NumberFormatException ex) {
                return null;
            }
        }
        return null;
    }

    private enum Plan {
        CAREER_BASIC(
                "career-basic",
                "Career Discovery Basic",
                799,
                "Affordable starter assessment for stream and career direction clarity.",
                "career",
                "one-time",
                Arrays.asList(
                        "Career aptitude and interest assessment",
                        "Top direction snapshot for parent discussion",
                        "Strengths and support areas summary",
                        "Starter next-step recommendation")),
        CAREER_PRO(
                "career-pro",
                "Career Discovery Pro",
                999,
                "Comprehensive guidance report with subject strategy and roadmap.",
                "career",
                "one-time",
                Arrays.asList(
                        "Complete career discovery assessment",
                        "Domain-wise strengths and weaknesses map",
                        "Subject and skill action plan",
                        "Phase 2 readiness: exams, colleges, fees, and loan planning")),
        EXAM_BASIC(
                "exam-basic",
                "Next Exam Prep Basic",
                999,
                "Parent-friendly monthly exam prep plan with mentor support.",
                "exam",
                "month",
                Arrays.asList(
                        "2 full exam papers each month",
                        "50 revision flashcards",
                        "4 chapter quizzes",
                        "2 doubt-clearing mentor sessions")),
        EXAM_PRO(
                "exam-pro",
                "Next Exam Prep Pro",
                1799,
                "Higher-intensity exam prep with deeper mentoring and review.",
                "exam",
                "month",
                Arrays.asList(
                        "6 full exam papers each month",
                        "200 revision flashcards",
                        "12 chapter quizzes",
                        "6 doubt-clearing mentor sessions",
                        "Priority mentor response and performance review")),
        TUITION_BASIC(
                "tuition-basic",
                "Online Tuition (Quote Required)",
                3999,
                "Starting package only. Final tuition fee depends on grade and subjects.",
                "tuition",
                "month",
                Arrays.asList(
                        "Custom quote by grade and subject selection",
                        "Small-batch live online tuition classes",
                        "Weekly homework and progress checks",
                        "Mentor-led doubt support",
                        "Monthly parent performance review")),
        TUITION_PRO(
                "tuition-pro",
                "Online Tuition Plus (Quote Required)",
                5999,
                "Starting package only. Final tuition fee depends on grade and subjects.",
                "tuition",
                "month",
                Arrays.asList(
                        "Everything in Tuition base package",
                        "Custom quote by grade and subject selection",
                        "Higher intensity mentoring slots",
                        "Personalized weak-topic remediation plan",
                        "Priority mentor interventions and parent strategy call"));

        private final String key;
        private final String displayName;
        private final int amount;
        private final String description;
        private final String trackType;
        private final String billingLabel;
        private final List<String> features;

        Plan(String key, String displayName, int amount, String description, String trackType, String billingLabel, List<String> features) {
            this.key = key;
            this.displayName = displayName;
            this.amount = amount;
            this.description = description;
            this.trackType = trackType;
            this.billingLabel = billingLabel;
            this.features = features;
        }

        public String getKey() {
            return key;
        }

        public String getDisplayName() {
            return displayName;
        }

        public int getAmount() {
            return amount;
        }

        public String getDescription() {
            return description;
        }

        public String getTrackType() {
            return trackType;
        }

        public String getBillingLabel() {
            return billingLabel;
        }

        public List<String> getFeatures() {
            return features;
        }

        public static Plan from(String raw) {
            if (raw == null) {
                return null;
            }
            String normalized = raw.trim().toLowerCase(Locale.ENGLISH);
            if ("basic".equals(normalized)) {
                return EXAM_BASIC;
            }
            if ("pro".equals(normalized)) {
                return EXAM_PRO;
            }
            for (Plan plan : values()) {
                if (plan.key.equals(normalized)) {
                    return plan;
                }
            }
            return null;
        }
    }
}
