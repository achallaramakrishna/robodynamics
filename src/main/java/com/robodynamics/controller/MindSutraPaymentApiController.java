package com.robodynamics.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.impl.RDAITutorIntegrationService;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.time.LocalDate;
import java.util.*;

/**
 * MindSutra Vedic Math Payment API
 * ─────────────────────────────────
 * Handles Razorpay order creation and webhook for the MindSutra storefront.
 *
 * Flow:
 *   1. Frontend calls POST /robodynamics/api/payment/create-order
 *   2. Java creates Razorpay order, returns {orderId, amount, keyId}
 *   3. Frontend opens Razorpay modal
 *   4. On payment.captured, Razorpay calls POST /robodynamics/api/payment/mindsutara/webhook
 *   5. Java verifies signature → creates rd_student_enrollments row → responds OK
 */
@RestController
@RequestMapping("/robodynamics/api/payment")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MindSutraPaymentApiController {

    @Value("${razorpay.key.id}")          private String razorpayKeyId;
    @Value("${razorpay.key.secret}")      private String razorpayKeySecret;
    @Value("${razorpay.webhook.secret}")  private String webhookSecret;

    @Autowired private RDUserService               userService;
    @Autowired private RDCourseService             courseService;
    @Autowired private RDCourseOfferingService     offeringService;
    @Autowired private RDStudentEnrollmentService  enrollmentService;
    @Autowired private RDAITutorIntegrationService aiTutorService;

    // Grade → course type mapping
    private static final Map<String, String> GRADE_TO_COURSE_TYPE = new LinkedHashMap<>();
    static {
        GRADE_TO_COURSE_TYPE.put("4", "vedic_math_g4");
        GRADE_TO_COURSE_TYPE.put("5", "vedic_math_g5");
        GRADE_TO_COURSE_TYPE.put("6", "vedic_math_g6");
        GRADE_TO_COURSE_TYPE.put("7", "vedic_math_g7");
        GRADE_TO_COURSE_TYPE.put("8", "vedic_math_g8");
    }

    private static final int PRICE_PAISE        = 149900; // ₹1,499 — single grade, lifetime
    private static final int PRICE_BUNDLE_PAISE = 399900; // ₹3,999 — all grades G4–G8, lifetime
    private static final int PRICE_FAMILY_PAISE = 499900; // ₹4,999 — 2 children G4–G8, lifetime

    // SKU types
    private static final String SKU_SINGLE = "single";
    private static final String SKU_BUNDLE = "bundle_g4_g8";
    private static final String SKU_FAMILY = "bundle_family";

    // Pending order store: razorpayOrderId → {userId, studentId, grade, courseId, sku}
    private final Map<String, OrderMeta> pendingOrders = new java.util.concurrent.ConcurrentHashMap<>();

    // ─────────────────────────────────────────────────────────────────
    // Create Order
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {

        String grade      = str(body, "grade");
        String coupon     = str(body, "couponCode").toUpperCase();
        String sku        = str(body, "sku");  // "single" | "bundle_g4_g8" | "bundle_family"
        if (sku.isEmpty()) sku = SKU_SINGLE;
        String courseType = GRADE_TO_COURSE_TYPE.getOrDefault(grade, "vedic_math_g5");

        // Resolve authenticated user from cookie (optional — allow guest checkout)
        RDUser user = resolveUserFromCookie(request);

        // Find the course by courseType (for single-grade orders)
        RDCourse course = findCourseByType(courseType);
        if (course == null && SKU_SINGLE.equals(sku)) {
            return ResponseEntity.badRequest().body(error("Course not found for grade " + grade));
        }

        // Calculate final amount based on SKU
        int amount;
        switch (sku) {
            case SKU_BUNDLE: amount = PRICE_BUNDLE_PAISE; break;
            case SKU_FAMILY: amount = PRICE_FAMILY_PAISE; break;
            default:         amount = PRICE_PAISE; break;  // single grade
        }
        // Coupon discounts (₹500 off)
        if ("VEDIC20".equals(coupon) || "DEMO".equals(coupon)) amount = Math.max(0, amount - 50000);

        try {
            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderReq = new JSONObject();
            orderReq.put("amount", amount);
            orderReq.put("currency", "INR");
            orderReq.put("receipt", "MS_" + sku.toUpperCase() + "_G" + grade + "_" + System.currentTimeMillis());
            orderReq.put("payment_capture", 1);
            Order order = client.orders.create(orderReq);

            String orderId = order.get("id");
            pendingOrders.put(orderId, new OrderMeta(
                    user != null ? user.getUserID() : null,
                    null, // studentId — set after registration
                    grade,
                    course != null ? course.getCourseId() : -1,
                    sku
            ));

            Map<String, Object> res = new LinkedHashMap<>();
            res.put("orderId",   orderId);
            res.put("amount",    amount);
            res.put("currency",  "INR");
            res.put("keyId",     razorpayKeyId);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            System.err.println("[MindSutra Payment] createOrder failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error("Payment gateway error. Please try again."));
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // Razorpay Webhook → auto-enroll on payment.captured
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/mindsutara/webhook")
    @ResponseBody
    public String handleWebhook(HttpServletRequest request) {
        try {
            // Read raw payload
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = request.getReader()) {
                String line;
                while ((line = reader.readLine()) != null) sb.append(line);
            }
            String payload   = sb.toString();
            String signature = request.getHeader("X-Razorpay-Signature");

            // Verify signature
            if (!Utils.verifyWebhookSignature(payload, signature, webhookSecret)) {
                System.err.println("[MindSutra Webhook] INVALID SIGNATURE");
                return "INVALID_SIGNATURE";
            }

            JSONObject event    = new JSONObject(payload);
            String eventType    = event.getString("event");
            if (!"payment.captured".equals(eventType)) return "IGNORED";

            JSONObject entity   = event.getJSONObject("payload")
                                       .getJSONObject("payment")
                                       .getJSONObject("entity");
            String orderId      = entity.getString("order_id");
            String paymentId    = entity.getString("id");
            String payerEmail   = entity.optString("email", "");
            String payerPhone   = entity.optString("contact", "").replaceAll("\\D", "");
            if (payerPhone.length() == 12) payerPhone = payerPhone.substring(2); // strip +91

            OrderMeta meta = pendingOrders.get(orderId);
            if (meta == null) {
                System.err.println("[MindSutra Webhook] Unknown order: " + orderId);
                return "ORDER_NOT_FOUND";
            }

            // Find (or create) the user for this order
            RDUser user = null;
            if (meta.userId != null) {
                user = userService.getRDUser(meta.userId);
            }
            if (user == null && !payerEmail.isEmpty()) {
                user = userService.findByEmail(payerEmail.toLowerCase());
            }
            if (user == null && payerPhone.length() == 10) {
                user = userService.findByCellPhone(payerPhone);
            }
            if (user == null) {
                System.err.println("[MindSutra Webhook] Could not resolve user for order " + orderId);
                return "USER_NOT_FOUND";
            }

            // Determine which courseTypes to enroll based on SKU
            List<String> courseTypesToEnroll = new ArrayList<>();
            if (SKU_BUNDLE.equals(meta.sku) || SKU_FAMILY.equals(meta.sku)) {
                // Bundle: enroll in all 5 grades
                courseTypesToEnroll.addAll(GRADE_TO_COURSE_TYPE.values()); // g4..g8
            } else {
                // Single grade: enroll in just the purchased grade
                String ct = GRADE_TO_COURSE_TYPE.getOrDefault(meta.grade, "vedic_math_g5");
                courseTypesToEnroll.add(ct);
            }

            int enrolledCount = 0;
            for (String ct : courseTypesToEnroll) {
                RDCourse targetCourse = findCourseByType(ct);
                if (targetCourse == null) {
                    System.err.println("[MindSutra Webhook] Course not found for type: " + ct);
                    continue;
                }
                List<RDCourseOffering> offerings = offeringService.getOfferingsByCategoryAndCourse(null, targetCourse.getCourseId());
                RDCourseOffering offering = offerings != null && !offerings.isEmpty() ? offerings.get(0) : null;
                if (offering == null) {
                    System.err.println("[MindSutra Webhook] No active offering for courseType " + ct);
                    continue;
                }
                // Idempotency — skip if already enrolled
                List<RDStudentEnrollment> existing = enrollmentService.getEnrollmentsByCourseId(targetCourse.getCourseId());
                boolean alreadyEnrolled = false;
                if (existing != null) {
                    for (RDStudentEnrollment e : existing) {
                        if (e != null && e.getStudent() != null
                                && user.getUserID().equals(e.getStudent().getUserID())
                                && e.getStatus() == 1) {
                            alreadyEnrolled = true;
                            break;
                        }
                    }
                }
                if (alreadyEnrolled) {
                    System.out.println("[MindSutra Webhook] Already enrolled in " + ct + ", skipping");
                    continue;
                }
                // Calculate fee for this course (split evenly across bundle courses)
                double fee = SKU_BUNDLE.equals(meta.sku) ? PRICE_BUNDLE_PAISE / 500.0   // 5 courses
                           : SKU_FAMILY.equals(meta.sku) ? PRICE_FAMILY_PAISE / 1000.0  // 5 courses × 2 children
                           : PRICE_PAISE / 100.0;

                RDStudentEnrollment enrollment = new RDStudentEnrollment();
                enrollment.setCourseOffering(offering);
                enrollment.setStudent(user);
                enrollment.setParent(null); // set later via profile
                enrollment.setEnrollmentDate(new java.util.Date());
                enrollment.setDiscountPercent(0d);
                enrollment.setDiscountReason("MindSutra " + meta.sku + " purchase " + paymentId);
                enrollment.setFinalFee(fee);
                enrollment.setStatus(1);
                enrollment.setProgress(0d);
                enrollmentService.saveRDStudentEnrollment(enrollment);
                enrolledCount++;
                System.out.println("[MindSutra Webhook] ✅ Enrolled user " + user.getUserID() + " in " + ct + " (payment=" + paymentId + ")");
            }

            // Clean up pending order
            pendingOrders.remove(orderId);

            if (enrolledCount == 0) return "ALREADY_ENROLLED";
            return "OK";

        } catch (Exception e) {
            System.err.println("[MindSutra Webhook] Exception: " + e.getMessage());
            e.printStackTrace();
            return "ERROR";
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────
    private RDUser resolveUserFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if ("rd_auth_token".equals(c.getName()) && c.getValue() != null && !c.getValue().isBlank()) {
                try {
                    // Decode JWT to get user_id claim (simple base64 decode of payload)
                    String[] parts = c.getValue().split("\\.");
                    if (parts.length >= 2) {
                        String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
                        JSONObject claims = new JSONObject(payload);
                        int userId = claims.optInt("user_id", 0);
                        if (userId > 0) return userService.getRDUser(userId);
                    }
                } catch (Exception ignore) {}
            }
        }
        return null;
    }

    private RDCourse findCourseByType(String courseType) {
        // Scan all courses for matching courseType
        List<RDCourse> all = courseService.getRDCourses();
        if (all == null) return null;
        for (RDCourse c : all) {
            if (courseType.equals(c.getCourseType())) return c;
        }
        return null;
    }

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key); return v == null ? "" : v.toString().trim();
    }

    private Map<String, Object> error(String msg) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("success", false);
        m.put("message", msg);
        return m;
    }

    private static class OrderMeta {
        final Integer userId;
        final Integer studentId;
        final String  grade;
        final int     courseId;
        final String  sku;   // "single" | "bundle_g4_g8" | "bundle_family"
        OrderMeta(Integer userId, Integer studentId, String grade, int courseId, String sku) {
            this.userId = userId; this.studentId = studentId;
            this.grade = grade;   this.courseId = courseId;
            this.sku   = sku != null ? sku : "single";
        }
    }
}
