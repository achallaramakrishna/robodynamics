package com.robodynamics.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dto.RDAITutorEventRequest;
import com.robodynamics.model.RDUser;

@Service
public class RDAITutorIntegrationService {

    private static final String HMAC_SHA_256 = "HmacSHA256";
    private static final String DEFAULT_MODULE = "VEDIC_MATH";
    private static final String DEFAULT_GRADE = "6";
    private static final Map<String, String> MODULE_COURSE_MAP = buildModuleCourseMap();

    @Value("${rd.ai.tutor.jwt.secret:change_me_ai_tutor_secret}")
    private String jwtSecret;

    @Value("${rd.ai.tutor.issuer:robodynamics-java}")
    private String issuer;

    @Value("${rd.ai.tutor.audience:robodynamics-ai-tutor}")
    private String audience;

    @Value("${rd.ai.tutor.token.ttl.seconds:300}")
    private long tokenTtlSeconds;

    @Value("${rd.ai.tutor.web.base-url:https://robodynamics.in}")
    private String aiTutorWebBaseUrl;

    @Value("${rd.ai.tutor.internal.api.key:change_me_ai_tutor_internal_key}")
    private String internalApiKey;

    private final ObjectMapper mapper = new ObjectMapper();
    private final List<RDAITutorEventRequest> eventLog = new CopyOnWriteArrayList<>();

    public String createLaunchToken(RDUser user, Integer childId, String module, String grade) {
        if (user == null || user.getUserID() == null) {
            throw new IllegalArgumentException("User is required to issue tutor token.");
        }

        long now = Instant.now().getEpochSecond();
        long exp = now + Math.max(60, tokenTtlSeconds);
        String role = resolveRole(user);
        Integer effectiveChildId = "STUDENT".equals(role) ? user.getUserID() : childId;

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("iss", issuer);
        payload.put("aud", audience);
        payload.put("sub", "user:" + user.getUserID());
        payload.put("jti", UUID.randomUUID().toString());
        payload.put("iat", now);
        payload.put("exp", exp);
        payload.put("user_id", user.getUserID());
        payload.put("role", role);
        payload.put("child_id", effectiveChildId);
        payload.put("company_code", "RD");
        payload.put("module", normalizeModule(module));
        payload.put("grade", normalizeGrade(grade, user));

        return signJwt(payload);
    }

    public String buildLaunchUrl(String token) {
        return buildLaunchUrl(token, null, DEFAULT_MODULE);
    }

    public String buildLaunchUrl(String token, String learnerName) {
        return buildLaunchUrl(token, learnerName, DEFAULT_MODULE);
    }

    public String buildLaunchUrl(String token, String learnerName, String module) {
        String base = trimTrailingSlash(aiTutorWebBaseUrl);
        String encoded = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String normalizedModule = normalizeModule(module);
        String courseId = courseIdForModule(normalizedModule);
        StringBuilder out = new StringBuilder(base)
                .append("/ai-tutor/vedic?token=")
                .append(encoded)
                .append("&module=")
                .append(URLEncoder.encode(normalizedModule, StandardCharsets.UTF_8))
                .append("&courseId=")
                .append(URLEncoder.encode(courseId, StandardCharsets.UTF_8));
        String cleanName = safe(learnerName, "").trim();
        if (!cleanName.isEmpty()) {
            out.append("&studentName=").append(URLEncoder.encode(cleanName, StandardCharsets.UTF_8));
        }
        return out.toString();
    }

    public long getTokenTtlSeconds() {
        return Math.max(60, tokenTtlSeconds);
    }

    public boolean isValidInternalApiKey(String provided) {
        if (provided == null || provided.isBlank()) {
            return false;
        }
        return constantTimeEquals(internalApiKey, provided.trim());
    }

    public void recordEvent(RDAITutorEventRequest request) {
        if (request == null) {
            return;
        }
        if (request.getCreatedAt() == null || request.getCreatedAt().isBlank()) {
            request.setCreatedAt(Instant.now().toString());
        }
        if (request.getModuleCode() == null || request.getModuleCode().isBlank()) {
            request.setModuleCode(DEFAULT_MODULE);
        }
        eventLog.add(request);
    }

    public Map<String, Object> getSummary(Integer childId, String moduleCode) {
        String module = normalizeModule(moduleCode);
        List<RDAITutorEventRequest> filtered = new ArrayList<>();
        for (RDAITutorEventRequest event : eventLog) {
            if (event == null) {
                continue;
            }
            if (childId != null && !childId.equals(event.getChildId())) {
                continue;
            }
            if (!module.equalsIgnoreCase(safe(event.getModuleCode(), DEFAULT_MODULE))) {
                continue;
            }
            filtered.add(event);
        }

        int attempts = 0;
        int correct = 0;
        int score = 0;
        String lastLesson = "";
        String lastEventAt = "";
        for (RDAITutorEventRequest event : filtered) {
            if ("ANSWER_SUBMITTED".equalsIgnoreCase(safe(event.getEventType(), ""))) {
                attempts++;
                if (Boolean.TRUE.equals(event.getIsCorrect())) {
                    correct++;
                }
            }
            score += event.getScoreDelta() == null ? 0 : event.getScoreDelta();
            if (event.getLessonCode() != null && !event.getLessonCode().isBlank()) {
                lastLesson = event.getLessonCode();
            }
            if (event.getCreatedAt() != null && !event.getCreatedAt().isBlank()) {
                lastEventAt = event.getCreatedAt();
            }
        }

        double accuracy = attempts <= 0 ? 0.0 : (correct * 100.0) / attempts;
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("moduleCode", module);
        out.put("childId", childId);
        out.put("attempts", attempts);
        out.put("correctCount", correct);
        out.put("accuracyPct", Math.round(accuracy * 100.0) / 100.0);
        out.put("score", score);
        out.put("lastLessonCode", lastLesson);
        out.put("lastEventAt", lastEventAt);
        out.put("eventCount", filtered.size());
        return out;
    }

    public List<RDAITutorEventRequest> getRecentEvents(Integer childId, String moduleCode, int limit) {
        String module = normalizeModule(moduleCode);
        int max = Math.max(1, limit);
        List<RDAITutorEventRequest> reversed = new ArrayList<>(eventLog);
        Collections.reverse(reversed);

        List<RDAITutorEventRequest> out = new ArrayList<>();
        for (RDAITutorEventRequest event : reversed) {
            if (event == null) {
                continue;
            }
            if (childId != null && !childId.equals(event.getChildId())) {
                continue;
            }
            if (!module.equalsIgnoreCase(safe(event.getModuleCode(), DEFAULT_MODULE))) {
                continue;
            }
            out.add(event);
            if (out.size() >= max) {
                break;
            }
        }
        return out;
    }

    private String signJwt(Map<String, Object> payload) {
        try {
            Map<String, Object> header = Map.of(
                    "alg", "HS256",
                    "typ", "JWT"
            );
            String headerPart = base64Url(mapper.writeValueAsBytes(header));
            String payloadPart = base64Url(mapper.writeValueAsBytes(payload));
            String signingInput = headerPart + "." + payloadPart;

            Mac mac = Mac.getInstance(HMAC_SHA_256);
            mac.init(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), HMAC_SHA_256));
            String signature = base64Url(mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8)));
            return signingInput + "." + signature;
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to sign AI tutor launch token.", ex);
        }
    }

    private String resolveRole(RDUser user) {
        int profile = user.getProfile_id();
        if (profile == RDUser.profileType.ROBO_STUDENT.getValue()) {
            return "STUDENT";
        }
        return "PARENT";
    }

    private String normalizeModule(String module) {
        String value = safe(module, DEFAULT_MODULE).trim();
        return value.isEmpty() ? DEFAULT_MODULE : value.toUpperCase(Locale.ENGLISH);
    }

    private String courseIdForModule(String module) {
        String normalized = normalizeModule(module);
        String mapped = MODULE_COURSE_MAP.get(normalized);
        return mapped == null || mapped.isBlank() ? "vedic_math" : mapped;
    }

    private String normalizeGrade(String grade, RDUser user) {
        String value = safe(grade, "");
        if (!value.isBlank()) {
            return value.trim();
        }
        String userGrade = user == null ? "" : safe(user.getGrade(), "");
        return userGrade.isBlank() ? DEFAULT_GRADE : userGrade.trim();
    }

    private static String safe(String value, String fallback) {
        return value == null ? fallback : value;
    }

    private static String trimTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return "http://localhost:3000";
        }
        String out = value.trim();
        while (out.endsWith("/")) {
            out = out.substring(0, out.length() - 1);
        }
        return out;
    }

    private static String base64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static boolean constantTimeEquals(String a, String b) {
        byte[] aBytes = a == null ? new byte[0] : a.getBytes(StandardCharsets.UTF_8);
        byte[] bBytes = b == null ? new byte[0] : b.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(aBytes, bBytes);
    }

    private static Map<String, String> buildModuleCourseMap() {
        Map<String, String> map = new HashMap<>();
        map.put("VEDIC_MATH", "vedic_math");
        map.put("NEET_PHYSICS", "neet_physics");
        map.put("NEET_CHEMISTRY", "neet_chemistry");
        map.put("NEET_MATH", "neet_math");
        return map;
    }
}
