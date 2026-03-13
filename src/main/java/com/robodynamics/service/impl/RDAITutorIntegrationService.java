package com.robodynamics.service.impl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
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
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dto.RDAITutorEventRequest;
import com.robodynamics.model.RDUser;

@Service
public class RDAITutorIntegrationService {

    private static final String HMAC_SHA_256 = "HmacSHA256";
    private static final String DEFAULT_MODULE = "VEDIC_MATH";
    private static final String DEFAULT_GRADE = "6";
    private static final String ACTIVE_STATUS = "ACTIVE";
    private static final TypeReference<Map<String, Object>> MAP_TYPE = new TypeReference<Map<String, Object>>() { };
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
    @Value("${rd.ai.tutor.neet.physics.db-course-id:0}")
    private Integer neetPhysicsDbCourseId;
    @Value("${rd.ai.tutor.neet.chemistry.db-course-id:0}")
    private Integer neetChemistryDbCourseId;
    @Value("${rd.ai.tutor.neet.biology.db-course-id:0}")
    private Integer neetBiologyDbCourseId;

    @PersistenceContext
    private EntityManager entityManager;

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

    public String buildLaunchUrl(String token) { return buildLaunchUrl(token, null, DEFAULT_MODULE); }
    public String buildLaunchUrl(String token, String learnerName) { return buildLaunchUrl(token, learnerName, DEFAULT_MODULE); }
    public String buildLaunchUrl(String token, String learnerName, String module) { return buildLaunchUrl(token, learnerName, module, null, null); }

    public String buildLaunchUrl(String token, String learnerName, String module, Integer enrollmentId, Integer dbCourseId) {
        String base = trimTrailingSlash(aiTutorWebBaseUrl);
        String encoded = URLEncoder.encode(token, StandardCharsets.UTF_8);
        String normalizedModule = normalizeModule(module);
        String courseId = courseIdForModule(normalizedModule);
        StringBuilder out = new StringBuilder(base)
                .append("/ai-tutor/learn?token=").append(encoded)
                .append("&module=").append(URLEncoder.encode(normalizedModule, StandardCharsets.UTF_8))
                .append("&courseId=").append(URLEncoder.encode(courseId, StandardCharsets.UTF_8));
        if (enrollmentId != null && enrollmentId.intValue() > 0) out.append("&enrollmentId=").append(enrollmentId.intValue());
        if (dbCourseId != null && dbCourseId.intValue() > 0) out.append("&dbCourseId=").append(dbCourseId.intValue());
        String cleanName = safe(learnerName, "").trim();
        if (!cleanName.isEmpty()) out.append("&studentName=").append(URLEncoder.encode(cleanName, StandardCharsets.UTF_8));
        return out.toString();
    }

    public long getTokenTtlSeconds() { return Math.max(60, tokenTtlSeconds); }

    public boolean isValidInternalApiKey(String provided) {
        return provided != null && !provided.isBlank() && constantTimeEquals(internalApiKey, provided.trim());
    }

    @Transactional
    public void recordEvent(RDAITutorEventRequest request) {
        if (request == null) return;
        normalizeEventRequest(request);
        eventLog.add(request);
        try { persistEvent(request); } catch (Exception ex) { }
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSummary(Integer childId, String moduleCode) {
        String module = normalizeModule(moduleCode);
        try { return getDbSummary(childId, module); } catch (Exception ex) { return getInMemorySummary(childId, module); }
    }

    @Transactional(readOnly = true)
    public List<RDAITutorEventRequest> getRecentEvents(Integer childId, String moduleCode, int limit) {
        String module = normalizeModule(moduleCode);
        try { return getDbRecentEvents(childId, module, limit); } catch (Exception ex) { return getInMemoryRecentEvents(childId, module, limit); }
    }

    private String signJwt(Map<String, Object> payload) {
        try {
            String headerPart = base64Url(mapper.writeValueAsBytes(Map.of("alg", "HS256", "typ", "JWT")));
            String payloadPart = base64Url(mapper.writeValueAsBytes(payload));
            String signingInput = headerPart + "." + payloadPart;
            Mac mac = Mac.getInstance(HMAC_SHA_256);
            mac.init(new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), HMAC_SHA_256));
            return signingInput + "." + base64Url(mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to sign AI tutor launch token.", ex);
        }
    }

    private void persistEvent(RDAITutorEventRequest request) throws Exception {
        Map<String, Object> meta = normalizeMeta(request.getMeta());
        Timestamp ts = parseTimestamp(request.getCreatedAt());
        Integer studentId = sanitizeInteger(request.getChildId() != null ? request.getChildId() : request.getUserId());
        Integer parentId = studentId != null && studentId.equals(request.getUserId()) ? null : sanitizeInteger(request.getUserId());
        String lessonCode = blankToNull(request.getLessonCode() != null ? request.getLessonCode() : stringMeta(meta, "chapterCode"));

        Query sessionQuery = entityManager.createNativeQuery(
                "INSERT INTO rd_ai_tutor_session (session_id,module_code,lesson_code,parent_user_id,student_user_id,child_user_id,grade_level,status,started_at,last_event_at) " +
                "VALUES (:sessionId,:moduleCode,:lessonCode,:parentUserId,:studentUserId,:childUserId,:gradeLevel,:status,:startedAt,:lastEventAt) " +
                "ON DUPLICATE KEY UPDATE module_code=VALUES(module_code), lesson_code=COALESCE(VALUES(lesson_code), lesson_code), " +
                "parent_user_id=COALESCE(VALUES(parent_user_id), parent_user_id), student_user_id=COALESCE(VALUES(student_user_id), student_user_id), " +
                "child_user_id=COALESCE(VALUES(child_user_id), child_user_id), grade_level=COALESCE(VALUES(grade_level), grade_level), " +
                "status=VALUES(status), last_event_at=VALUES(last_event_at)");
        sessionQuery.setParameter("sessionId", request.getSessionId());
        sessionQuery.setParameter("moduleCode", normalizeModule(request.getModuleCode()));
        sessionQuery.setParameter("lessonCode", lessonCode);
        sessionQuery.setParameter("parentUserId", sanitizeInteger(parentId));
        sessionQuery.setParameter("studentUserId", sanitizeInteger(studentId));
        sessionQuery.setParameter("childUserId", sanitizeInteger(request.getChildId()));
        sessionQuery.setParameter("gradeLevel", blankToNull(stringMeta(meta, "grade")));
        sessionQuery.setParameter("status", ACTIVE_STATUS);
        sessionQuery.setParameter("startedAt", ts);
        sessionQuery.setParameter("lastEventAt", ts);
        sessionQuery.executeUpdate();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sessionId", request.getSessionId());
        payload.put("userId", request.getUserId());
        payload.put("childId", request.getChildId());
        payload.put("moduleCode", request.getModuleCode());
        payload.put("eventType", request.getEventType());
        payload.put("lessonCode", request.getLessonCode());
        payload.put("questionId", request.getQuestionId());
        payload.put("isCorrect", request.getIsCorrect());
        payload.put("scoreDelta", request.getScoreDelta());
        payload.put("meta", meta);
        payload.put("createdAt", request.getCreatedAt());

        Query eventQuery = entityManager.createNativeQuery(
                "INSERT INTO rd_ai_tutor_event (session_id,event_type,lesson_code,question_id,is_correct,score_delta,skill_code,payload_json,created_at) " +
                "VALUES (:sessionId,:eventType,:lessonCode,:questionId,:isCorrect,:scoreDelta,:skillCode,:payloadJson,:createdAt)");
        eventQuery.setParameter("sessionId", request.getSessionId());
        eventQuery.setParameter("eventType", safe(request.getEventType(), ""));
        eventQuery.setParameter("lessonCode", lessonCode);
        eventQuery.setParameter("questionId", blankToNull(request.getQuestionId()));
        eventQuery.setParameter("isCorrect", request.getIsCorrect());
        eventQuery.setParameter("scoreDelta", request.getScoreDelta());
        eventQuery.setParameter("skillCode", blankToNull(stringMeta(meta, "skill")));
        eventQuery.setParameter("payloadJson", mapper.writeValueAsString(payload));
        eventQuery.setParameter("createdAt", ts);
        eventQuery.executeUpdate();

        if ("ANSWER_SUBMITTED".equalsIgnoreCase(safe(request.getEventType(), "")) && studentId != null && lessonCode != null) {
            int correctDelta = Boolean.TRUE.equals(request.getIsCorrect()) ? 1 : 0;
            Query progressQuery = entityManager.createNativeQuery(
                    "INSERT INTO rd_ai_tutor_progress (student_user_id,module_code,lesson_code,attempts,correct_count,accuracy_pct,last_practiced_at) " +
                    "VALUES (:studentUserId,:moduleCode,:lessonCode,1,:correctCount,:accuracyPct,:lastPracticedAt) " +
                    "ON DUPLICATE KEY UPDATE attempts=attempts+1, correct_count=correct_count+VALUES(correct_count), " +
                    "accuracy_pct=ROUND(((correct_count+VALUES(correct_count))*100.0)/(attempts+1),2), last_practiced_at=VALUES(last_practiced_at)");
            progressQuery.setParameter("studentUserId", studentId);
            progressQuery.setParameter("moduleCode", normalizeModule(request.getModuleCode()));
            progressQuery.setParameter("lessonCode", lessonCode);
            progressQuery.setParameter("correctCount", correctDelta);
            progressQuery.setParameter("accuracyPct", correctDelta > 0 ? 100.0 : 0.0);
            progressQuery.setParameter("lastPracticedAt", ts);
            progressQuery.executeUpdate();
        }
    }

    private Map<String, Object> getDbSummary(Integer childId, String module) {
        String eventSql = "SELECT COALESCE(SUM(CASE WHEN e.event_type='ANSWER_SUBMITTED' THEN 1 ELSE 0 END),0), " +
                "COALESCE(SUM(CASE WHEN e.event_type='ANSWER_SUBMITTED' AND e.is_correct=1 THEN 1 ELSE 0 END),0), " +
                "COALESCE(SUM(COALESCE(e.score_delta,0)),0), COUNT(e.event_id) " +
                "FROM rd_ai_tutor_event e JOIN rd_ai_tutor_session s ON s.session_id=e.session_id WHERE s.module_code=:moduleCode";
        if (childId != null) eventSql += " AND s.student_user_id=:childId";
        Query q = entityManager.createNativeQuery(eventSql);
        q.setParameter("moduleCode", module);
        if (childId != null) q.setParameter("childId", childId);
        Object[] agg = singleRow(q.getResultList(), 4);
        int attempts = intValue(agg[0]);
        int correct = intValue(agg[1]);
        int score = intValue(agg[2]);
        int eventCount = intValue(agg[3]);

        String sessionSql = "SELECT s.lesson_code, s.last_event_at FROM rd_ai_tutor_session s WHERE s.module_code=:moduleCode";
        if (childId != null) sessionSql += " AND s.student_user_id=:childId";
        sessionSql += " ORDER BY COALESCE(s.last_event_at, s.started_at) DESC, s.started_at DESC";
        Query sq = entityManager.createNativeQuery(sessionSql);
        sq.setParameter("moduleCode", module);
        if (childId != null) sq.setParameter("childId", childId);
        sq.setMaxResults(1);
        List<?> rows = sq.getResultList();
        String lastLesson = "";
        String lastEventAt = "";
        if (!rows.isEmpty()) {
            Object[] row = rowAsArray(rows.get(0), 2);
            lastLesson = stringValue(row[0]);
            lastEventAt = isoTimestamp(row[1]);
        }

        double accuracy = attempts <= 0 ? 0.0 : (correct * 100.0) / attempts;
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("moduleCode", module);
        out.put("childId", childId);
        out.put("attempts", attempts);
        out.put("correctCount", correct);
        out.put("accuracyPct", round2(accuracy));
        out.put("score", score);
        out.put("lastLessonCode", lastLesson);
        out.put("lastEventAt", lastEventAt);
        out.put("eventCount", eventCount);
        return out;
    }

    private List<RDAITutorEventRequest> getDbRecentEvents(Integer childId, String module, int limit) {
        String sql = "SELECT e.session_id, COALESCE(s.parent_user_id,s.student_user_id), s.child_user_id, s.module_code, " +
                "e.event_type, COALESCE(e.lesson_code,s.lesson_code), e.question_id, e.is_correct, e.score_delta, e.payload_json, e.created_at " +
                "FROM rd_ai_tutor_event e JOIN rd_ai_tutor_session s ON s.session_id=e.session_id WHERE s.module_code=:moduleCode";
        if (childId != null) sql += " AND s.student_user_id=:childId";
        sql += " ORDER BY e.created_at DESC, e.event_id DESC";
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("moduleCode", module);
        if (childId != null) q.setParameter("childId", childId);
        q.setMaxResults(Math.max(1, limit));
        List<RDAITutorEventRequest> out = new ArrayList<>();
        for (Object raw : q.getResultList()) {
            Object[] row = rowAsArray(raw, 11);
            Map<String, Object> payload = parsePayload(row[9]);
            RDAITutorEventRequest event = new RDAITutorEventRequest();
            event.setSessionId(stringValue(row[0]));
            event.setUserId(nullableInt(row[1]));
            event.setChildId(nullableInt(row[2]));
            event.setModuleCode(stringValue(row[3]));
            event.setEventType(stringValue(row[4]));
            event.setLessonCode(stringValue(row[5]));
            event.setQuestionId(stringValue(row[6]));
            event.setIsCorrect(nullableBoolean(row[7]));
            event.setScoreDelta(nullableInt(row[8]));
            Object meta = payload.get("meta");
            event.setMeta(meta instanceof Map<?, ?> ? castMap(meta) : new LinkedHashMap<>());
            event.setCreatedAt(isoTimestamp(row[10]));
            out.add(event);
        }
        return out;
    }

    private Map<String, Object> getInMemorySummary(Integer childId, String module) {
        List<RDAITutorEventRequest> filtered = filterEvents(childId, module);
        int attempts = 0, correct = 0, score = 0;
        String lastLesson = "", lastEventAt = "";
        for (RDAITutorEventRequest event : filtered) {
            if ("ANSWER_SUBMITTED".equalsIgnoreCase(safe(event.getEventType(), ""))) {
                attempts++;
                if (Boolean.TRUE.equals(event.getIsCorrect())) correct++;
            }
            score += event.getScoreDelta() == null ? 0 : event.getScoreDelta();
            if (event.getLessonCode() != null && !event.getLessonCode().isBlank()) lastLesson = event.getLessonCode();
            if (event.getCreatedAt() != null && !event.getCreatedAt().isBlank()) lastEventAt = event.getCreatedAt();
        }
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("moduleCode", module);
        out.put("childId", childId);
        out.put("attempts", attempts);
        out.put("correctCount", correct);
        out.put("accuracyPct", round2(attempts <= 0 ? 0.0 : (correct * 100.0) / attempts));
        out.put("score", score);
        out.put("lastLessonCode", lastLesson);
        out.put("lastEventAt", lastEventAt);
        out.put("eventCount", filtered.size());
        return out;
    }

    private List<RDAITutorEventRequest> getInMemoryRecentEvents(Integer childId, String module, int limit) {
        List<RDAITutorEventRequest> reversed = new ArrayList<>(eventLog);
        Collections.reverse(reversed);
        List<RDAITutorEventRequest> out = new ArrayList<>();
        for (RDAITutorEventRequest event : reversed) {
            if (event == null) continue;
            if (childId != null && !childId.equals(event.getChildId())) continue;
            if (!module.equalsIgnoreCase(safe(event.getModuleCode(), DEFAULT_MODULE))) continue;
            out.add(event);
            if (out.size() >= Math.max(1, limit)) break;
        }
        return out;
    }

    private List<RDAITutorEventRequest> filterEvents(Integer childId, String module) {
        List<RDAITutorEventRequest> out = new ArrayList<>();
        for (RDAITutorEventRequest event : eventLog) {
            if (event == null) continue;
            if (childId != null && !childId.equals(event.getChildId())) continue;
            if (!module.equalsIgnoreCase(safe(event.getModuleCode(), DEFAULT_MODULE))) continue;
            out.add(event);
        }
        return out;
    }

    private void normalizeEventRequest(RDAITutorEventRequest request) {
        request.setSessionId(blankToNull(request.getSessionId()));
        request.setQuestionId(blankToNull(request.getQuestionId()));
        request.setLessonCode(blankToNull(request.getLessonCode()));
        request.setEventType(blankToNull(upper(request.getEventType())));
        request.setModuleCode(normalizeModule(request.getModuleCode()));
        request.setMeta(normalizeMeta(request.getMeta()));
        if (request.getCreatedAt() == null || request.getCreatedAt().isBlank()) request.setCreatedAt(Instant.now().toString());
        if ((request.getLessonCode() == null || request.getLessonCode().isBlank()) && request.getMeta() != null) {
            request.setLessonCode(blankToNull(stringMeta(request.getMeta(), "chapterCode")));
        }
    }

    private Map<String, Object> normalizeMeta(Map<String, Object> meta) { return meta == null ? new LinkedHashMap<>() : new LinkedHashMap<>(meta); }
    private Map<String, Object> castMap(Object value) {
        Map<String, Object> out = new LinkedHashMap<>();
        for (Map.Entry<?, ?> e : ((Map<?, ?>) value).entrySet()) if (e.getKey() != null) out.put(String.valueOf(e.getKey()), e.getValue());
        return out;
    }
    private Map<String, Object> parsePayload(Object raw) {
        if (raw == null) return new LinkedHashMap<>();
        try { return raw instanceof byte[] ? mapper.readValue((byte[]) raw, MAP_TYPE) : mapper.readValue(String.valueOf(raw), MAP_TYPE); }
        catch (Exception ex) { return new LinkedHashMap<>(); }
    }
    private Object[] singleRow(List<?> rows, int size) { return rows == null || rows.isEmpty() ? new Object[size] : rowAsArray(rows.get(0), size); }
    private Object[] rowAsArray(Object row, int size) { if (row instanceof Object[]) return (Object[]) row; Object[] out = new Object[size]; if (size > 0) out[0] = row; return out; }
    private Timestamp parseTimestamp(String value) {
        if (value == null || value.isBlank()) return Timestamp.from(Instant.now());
        try { return Timestamp.from(Instant.parse(value)); }
        catch (Exception ex) { try { return Timestamp.from(OffsetDateTime.parse(value).toInstant()); } catch (Exception ignored) { return Timestamp.from(Instant.now()); } }
    }
    private String isoTimestamp(Object value) {
        if (value == null) return "";
        if (value instanceof Timestamp) return ((Timestamp) value).toInstant().toString();
        if (value instanceof java.util.Date) return ((java.util.Date) value).toInstant().toString();
        return String.valueOf(value);
    }
    private Integer sanitizeInteger(Integer value) { return value == null || value.intValue() <= 0 ? null : value; }
    private int intValue(Object value) {
        if (value == null) return 0;
        if (value instanceof Number) return ((Number) value).intValue();
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? 0 : Integer.parseInt(text);
    }
    private Integer nullableInt(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).intValue();
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? null : Integer.valueOf(text);
    }
    private Boolean nullableBoolean(Object value) {
        if (value == null) return null;
        if (value instanceof Boolean) return (Boolean) value;
        if (value instanceof Number) return ((Number) value).intValue() != 0;
        String text = String.valueOf(value).trim().toLowerCase(Locale.ENGLISH);
        return text.isEmpty() ? null : ("1".equals(text) || "true".equals(text) || "yes".equals(text));
    }
    private String stringValue(Object value) { return value == null ? "" : String.valueOf(value); }
    private double round2(double value) { return Math.round(value * 100.0) / 100.0; }
    private String stringMeta(Map<String, Object> meta, String key) { Object value = meta == null ? null : meta.get(key); return value == null ? "" : String.valueOf(value).trim(); }
    private String blankToNull(String value) { return value == null || value.trim().isEmpty() ? null : value.trim(); }
    private String upper(String value) { return value == null ? null : value.trim().toUpperCase(Locale.ENGLISH); }

    private String resolveRole(RDUser user) { return user.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue() ? "STUDENT" : "PARENT"; }
    private String normalizeModule(String module) { String value = safe(module, DEFAULT_MODULE).trim(); return value.isEmpty() ? DEFAULT_MODULE : value.toUpperCase(Locale.ENGLISH); }
    private String courseIdForModule(String module) { String mapped = MODULE_COURSE_MAP.get(normalizeModule(module)); return mapped == null || mapped.isBlank() ? "vedic_math" : mapped; }

    public Integer resolveDbCourseIdForModule(String module) {
        switch (normalizeModule(module)) {
            case "NEET_PHYSICS": return sanitizeCourseId(neetPhysicsDbCourseId);
            case "NEET_CHEMISTRY": return sanitizeCourseId(neetChemistryDbCourseId);
            case "NEET_BIOLOGY": return sanitizeCourseId(neetBiologyDbCourseId);
            default: return null;
        }
    }

    public boolean isCourseMappedToModule(Integer enrolledCourseId, String enrolledCourseName, String module) {
        String normalized = normalizeModule(module);
        Integer configuredCourseId = resolveDbCourseIdForModule(normalized);
        if (configuredCourseId != null && enrolledCourseId != null && configuredCourseId.intValue() == enrolledCourseId.intValue()) return true;
        String courseName = safe(enrolledCourseName, "").trim().toLowerCase(Locale.ENGLISH);
        if (courseName.isEmpty()) return false;
        switch (normalized) {
            case "NEET_PHYSICS": return courseName.contains("neet physics") || courseName.contains("physics");
            case "NEET_CHEMISTRY": return courseName.contains("neet chemistry") || courseName.contains("chemistry");
            case "NEET_BIOLOGY": return courseName.contains("neet biology") || courseName.contains("biology");
            default: return false;
        }
    }

    private String normalizeGrade(String grade, RDUser user) {
        String value = safe(grade, "");
        if (!value.isBlank()) return value.trim();
        String userGrade = user == null ? "" : safe(user.getGrade(), "");
        return userGrade.isBlank() ? DEFAULT_GRADE : userGrade.trim();
    }

    private static String safe(String value, String fallback) { return value == null ? fallback : value; }
    private static String trimTrailingSlash(String value) {
        if (value == null || value.isBlank()) return "http://localhost:3000";
        String out = value.trim();
        while (out.endsWith("/")) out = out.substring(0, out.length() - 1);
        return out;
    }
    private static String base64Url(byte[] bytes) { return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes); }
    private static Integer sanitizeCourseId(Integer value) { return value == null || value.intValue() <= 0 ? null : value; }
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
        map.put("NEET_BIOLOGY", "neet_biology");
        return map;
    }
}
