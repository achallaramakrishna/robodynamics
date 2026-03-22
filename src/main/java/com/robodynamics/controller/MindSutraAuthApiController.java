package com.robodynamics.controller;

import com.robodynamics.form.RDRegistrationForm;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.impl.RDAITutorIntegrationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * MindSutra Public Auth API
 * ─────────────────────────
 * REST endpoints for the MindSutra storefront registration / login flow.
 * All responses are JSON. JWT is set as an httpOnly cookie AND returned in body.
 *
 * Endpoints:
 *   POST /robodynamics/api/auth/otp/send     — send OTP to phone
 *   POST /robodynamics/api/auth/otp/verify   — verify OTP
 *   POST /robodynamics/api/auth/register     — create parent + child account
 *   POST /robodynamics/api/auth/login        — login with phone/email + PIN
 */
@RestController
@RequestMapping("/robodynamics/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MindSutraAuthApiController {

    @Autowired private RDUserService userService;
    @Autowired private RDAITutorIntegrationService aiTutorService;

    // In-memory OTP store (phone → {otp, expiresAt, attempts})
    // Replace with Redis or DB-backed store for production scaling
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    // ─────────────────────────────────────────────────────────────────
    // OTP — Send
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/otp/send")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> body) {
        String phone = body.getOrDefault("phone", "").trim().replaceAll("\\D", "");
        if (phone.length() != 10) {
            return ResponseEntity.badRequest().body(error("Invalid phone number"));
        }
        // Generate 6-digit OTP
        String otp = String.format("%06d", (int)(Math.random() * 1_000_000));
        long expiresAt = System.currentTimeMillis() + 5 * 60 * 1000L; // 5 minutes
        otpStore.put(phone, new OtpEntry(otp, expiresAt, 0));

        // TODO: send via SMS gateway (Gupshup / MSG91 / Sarvam)
        // For now: log to console (remove in production)
        System.out.println("[MindSutra OTP] +91" + phone + " → " + otp);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "OTP sent to +91" + phone);
        return ResponseEntity.ok(res);
    }

    // ─────────────────────────────────────────────────────────────────
    // OTP — Verify
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/otp/verify")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> body) {
        String phone = body.getOrDefault("phone", "").trim().replaceAll("\\D", "");
        String otp   = body.getOrDefault("otp", "").trim();
        OtpEntry entry = otpStore.get(phone);

        if (entry == null || System.currentTimeMillis() > entry.expiresAt) {
            return ResponseEntity.badRequest().body(error("OTP expired. Request a new one."));
        }
        if (entry.attempts >= 5) {
            return ResponseEntity.badRequest().body(error("Too many attempts. Request a new OTP."));
        }
        entry.attempts++;
        if (!entry.otp.equals(otp)) {
            return ResponseEntity.badRequest().body(error("Invalid OTP"));
        }
        otpStore.remove(phone);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("verified", true);
        return ResponseEntity.ok(res);
    }

    // ─────────────────────────────────────────────────────────────────
    // Register (parent + child in one call)
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestBody Map<String, Object> body,
            HttpServletResponse response) {

        String parentName   = str(body, "parentName");
        String email        = str(body, "email").toLowerCase();
        String phone        = str(body, "phone").replaceAll("\\D", "");
        String childName    = str(body, "childName");
        String gradeStr     = str(body, "grade");
        String pin          = str(body, "pin");

        // Basic validation
        if (parentName.isEmpty() || email.isEmpty() || phone.length() != 10
                || childName.isEmpty() || gradeStr.isEmpty() || pin.length() < 4) {
            return ResponseEntity.badRequest().body(error("Missing required fields"));
        }
        // Check for duplicate
        if (userService.findByEmail(email) != null) {
            return ResponseEntity.badRequest().body(error("An account with this email already exists. Please login."));
        }
        if (userService.findByCellPhone(phone) != null) {
            return ResponseEntity.badRequest().body(error("An account with this mobile number already exists. Please login."));
        }

        String parentUsername = email;
        String childUsername = phone + "_student";

        RDRegistrationForm.Parent parent = new RDRegistrationForm.Parent();
        parent.setFirstName(parentName.contains(" ") ? parentName.substring(0, parentName.lastIndexOf(' ')).trim() : parentName);
        parent.setLastName(parentName.contains(" ") ? parentName.substring(parentName.lastIndexOf(' ') + 1).trim() : "");
        parent.setEmail(email);
        parent.setPhone(phone);
        parent.setUserName(parentUsername);
        parent.setPassword(hashPin(pin));

        RDRegistrationForm.Child child = new RDRegistrationForm.Child();
        child.setFirstName(childName);
        child.setGrade(gradeStr);
        child.setUserName(childUsername);
        child.setPassword(hashPin(pin));

        try {
            userService.saveParentAndChild(parent, child);
        } catch (Exception e) {
            System.err.println("[MindSutra Register] Error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error("Registration failed. Please try again."));
        }

        RDUser savedParent = userService.findByUserName(parentUsername);
        RDUser savedChild = userService.findByUserName(childUsername);
        if (savedParent == null || savedChild == null) {
            return ResponseEntity.internalServerError().body(error("Registration succeeded, but login session could not be created."));
        }

        // Issue AI Tutor launch token for immediate use
        String module = "VEDIC_MATH_G" + gradeStr;
        String token  = aiTutorService.createLaunchToken(savedChild, savedChild.getUserID(), module, gradeStr);

        setAuthCookie(response, token);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("token", token);
        res.put("userId", savedParent.getUserID());
        res.put("studentId", savedChild.getUserID());
        res.put("grade", gradeStr);
        return ResponseEntity.ok(res);
    }

    // ─────────────────────────────────────────────────────────────────
    // Login (phone or email + PIN)
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> body,
            HttpServletResponse response) {

        String identifier = body.getOrDefault("identifier", "").trim();
        String pin        = body.getOrDefault("pin", "").trim();

        if (identifier.isEmpty() || pin.isEmpty()) {
            return ResponseEntity.badRequest().body(error("Phone/email and PIN are required"));
        }

        // Find user by email or phone
        RDUser user = null;
        if (identifier.contains("@")) {
            user = userService.findByEmail(identifier.toLowerCase());
        } else {
            String phone = identifier.replaceAll("\\D", "");
            if (phone.length() == 10) user = userService.findByCellPhone(phone);
        }

        if (user == null) {
            return ResponseEntity.status(401).body(error("No account found. Please register first."));
        }
        if (!hashPin(pin).equals(user.getPassword())) {
            return ResponseEntity.status(401).body(error("Incorrect PIN. Please try again."));
        }

        // Determine role
        String role = "PARENT";  // default; extend with rd_user_roles lookup if needed
        String module = "VEDIC_MATH_G5"; // default; read from enrollments if available

        String token = aiTutorService.createLaunchToken(user, user.getUserID(), module, "5");
        setAuthCookie(response, token);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("token", token);
        res.put("role", role);
        res.put("userId", user.getUserID());
        return ResponseEntity.ok(res);
    }

    // ─────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────
    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie c = new Cookie("rd_auth_token", token);
        c.setHttpOnly(true);
        c.setPath("/");
        c.setMaxAge(60 * 60 * 24 * 30); // 30 days
        // c.setSecure(true); // enable in production (HTTPS only)
        response.addCookie(c);
    }

    private String hashPin(String pin) {
        // Simple SHA-256 hash — upgrade to BCrypt in production
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(pin.getBytes("UTF-8"));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception e) {
            return pin; // fallback (never happens)
        }
    }

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v == null ? "" : v.toString().trim();
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("success", false);
        m.put("message", message);
        return m;
    }

    // OTP store entry
    private static class OtpEntry {
        final String otp;
        final long expiresAt;
        int attempts;
        OtpEntry(String otp, long expiresAt, int attempts) {
            this.otp = otp; this.expiresAt = expiresAt; this.attempts = attempts;
        }
    }
}
