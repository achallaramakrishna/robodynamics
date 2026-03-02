package com.robodynamics.service.impl;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDLeadDao;
import com.robodynamics.dao.RDMarketingAgentTaskDao;
import com.robodynamics.dao.RDMarketingBookingDao;
import com.robodynamics.dao.RDMarketingConsentAuditDao;
import com.robodynamics.dao.RDMarketingLeadProfileDao;
import com.robodynamics.dao.RDMarketingMessageLogDao;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMarketingAgentTask;
import com.robodynamics.model.RDMarketingBooking;
import com.robodynamics.model.RDMarketingConsentAudit;
import com.robodynamics.model.RDMarketingLeadProfile;
import com.robodynamics.model.RDMarketingMessageLog;
import com.robodynamics.service.RDMarketingAgentService;
import com.robodynamics.service.WhatsAppService;
import com.robodynamics.service.WhatsAppService.WhatsAppSendResult;
import com.twilio.security.RequestValidator;

@Service
public class RDMarketingAgentServiceImpl implements RDMarketingAgentService {

    private static final Logger log = LoggerFactory.getLogger(RDMarketingAgentServiceImpl.class);

    @Autowired
    private RDLeadDao leadDao;

    @Autowired
    private RDMarketingLeadProfileDao profileDao;

    @Autowired
    private RDMarketingMessageLogDao messageLogDao;

    @Autowired
    private RDMarketingAgentTaskDao taskDao;

    @Autowired
    private RDMarketingBookingDao bookingDao;

    @Autowired
    private RDMarketingConsentAuditDao consentAuditDao;

    @Autowired
    private WhatsAppService whatsAppService;

    @Autowired
    private SessionFactory sessionFactory;

    @Value("${twilio.authToken:}")
    private String twilioAuthToken;

    @Value("${marketing.booking.url:https://robodynamics.in/aptipath/demo}")
    private String bookingUrl;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    @Transactional
    public Map<String, Object> upsertLead(LeadUpsertRequest request) {
        if (request == null || isBlank(request.getPhoneE164())) {
            throw new IllegalArgumentException("phoneE164 is required.");
        }

        LocalDateTime now = LocalDateTime.now();
        String normalizedPhone = normalizePhoneForLead(request.getPhoneE164());
        String phoneE164 = toE164(normalizedPhone);

        Optional<RDLead> existing = leadDao.findByPhoneAndAudience(normalizedPhone, "parent");
        RDLead lead = existing.orElseGet(() -> {
            RDLead byPhone = leadDao.findByPhone(normalizedPhone);
            return byPhone != null ? byPhone : new RDLead();
        });

        if (lead.getId() == null) {
            lead.setAudience("parent");
            lead.setStatus("new");
            lead.setPhone(normalizedPhone);
        } else if (!"parent".equalsIgnoreCase(trimToNull(lead.getAudience()))) {
            lead.setAudience("parent");
        }

        if (!isBlank(request.getParentName())) {
            lead.setName(request.getParentName().trim());
        } else if (isBlank(lead.getName())) {
            lead.setName("Parent");
        }

        if (!isBlank(request.getSourceChannel())) {
            lead.setSource(request.getSourceChannel().trim());
        } else if (isBlank(lead.getSource())) {
            lead.setSource("marketing_agent");
        }

        if (!isBlank(request.getStudentGrade())) {
            lead.setGrade(request.getStudentGrade().trim());
        }

        if (!isBlank(request.getBoard())) {
            lead.setBoard(request.getBoard().trim());
        }

        if (!isBlank(request.getNotes())) {
            lead.setMessage(request.getNotes().trim());
        }

        leadDao.saveOrUpdate(lead);

        RDMarketingLeadProfile profile = profileDao.findByLeadId(lead.getId()).orElseGet(RDMarketingLeadProfile::new);
        if (profile.getProfileId() == null) {
            profile.setLead(lead);
            profile.setCreatedAt(now);
            profile.setFunnelStage("NEW");
            profile.setLeadScore(0);
        }

        profile.setParentName(trimToNull(request.getParentName()));
        profile.setStudentName(trimToNull(request.getStudentName()));
        profile.setStudentGrade(trimToNull(request.getStudentGrade()));
        profile.setBoard(trimToNull(request.getBoard()));
        profile.setCity(trimToNull(request.getCity()));
        profile.setSourceChannel(trimToNull(request.getSourceChannel()));
        profile.setCampaignId(trimToNull(request.getCampaignId()));
        profile.setOwnerUserId(request.getOwnerUserId());
        profile.setNotes(trimToNull(request.getNotes()));

        if (request.getConsentOptIn() != null) {
            Boolean before = profile.getConsentOptIn();
            profile.setConsentOptIn(request.getConsentOptIn());
            if (Boolean.TRUE.equals(request.getConsentOptIn())) {
                profile.setConsentTime(now);
            }
            if (before == null || !before.equals(request.getConsentOptIn())) {
                auditConsent(lead, phoneE164, Boolean.TRUE.equals(request.getConsentOptIn()) ? "OPT_IN" : "OPT_OUT",
                        "API_UPSERT", "Upsert lead API");
            }
        }

        profile.setUpdatedAt(now);
        profileDao.saveOrUpdate(profile);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("leadId", lead.getId());
        out.put("phoneE164", phoneE164);
        out.put("leadStatus", lead.getStatus());
        out.put("funnelStage", profile.getFunnelStage());
        out.put("leadScore", profile.getLeadScore());
        out.put("consentOptIn", profile.getConsentOptIn());
        return out;
    }

    @Override
    @Transactional
    public Map<String, Object> handleInboundWhatsApp(Map<String, String> formParams, String fullRequestUrl, String signature) {
        if (formParams == null) {
            throw new IllegalArgumentException("formParams are required.");
        }

        boolean validSignature = validateTwilioSignature(fullRequestUrl, formParams, signature);
        if (!validSignature) {
            Map<String, Object> invalid = new LinkedHashMap<>();
            invalid.put("accepted", false);
            invalid.put("reason", "INVALID_SIGNATURE");
            return invalid;
        }

        String from = trimToNull(formParams.get("From"));
        String body = trimToNull(formParams.get("Body"));
        String sid = trimToNull(formParams.get("MessageSid"));
        String profileName = trimToNull(formParams.get("ProfileName"));

        if (isBlank(from)) {
            throw new IllegalArgumentException("Missing From in webhook payload.");
        }

        String phoneE164 = normalizeInboundFrom(from);
        LeadUpsertRequest upsertRequest = new LeadUpsertRequest();
        upsertRequest.setPhoneE164(phoneE164);
        upsertRequest.setParentName(profileName);
        upsertRequest.setSourceChannel("whatsapp_inbound");
        upsertRequest.setConsentOptIn(Boolean.TRUE);
        Map<String, Object> upsertResult = upsertLead(upsertRequest);
        Long leadId = ((Number) upsertResult.get("leadId")).longValue();

        RDLead lead = leadDao.findById(leadId)
                .orElseThrow(() -> new IllegalStateException("Lead not found after upsert: " + leadId));
        RDMarketingLeadProfile profile = profileDao.findByLeadId(leadId)
                .orElseThrow(() -> new IllegalStateException("Lead profile not found: " + leadId));

        LocalDateTime now = LocalDateTime.now();
        String intentTag = detectIntent(body);
        int scoreDelta = scoreDeltaForIntent(intentTag);

        profile.setLastInboundAt(now);
        profile.setUpdatedAt(now);
        profile.setLeadScore(Math.max(0, nvlInt(profile.getLeadScore()) + scoreDelta));

        RDMarketingMessageLog inboundLog = new RDMarketingMessageLog();
        inboundLog.setLead(lead);
        inboundLog.setDirection("INBOUND");
        inboundLog.setChannel("WHATSAPP");
        inboundLog.setTwilioSid(sid);
        inboundLog.setMessageType("SESSION");
        inboundLog.setBody(body);
        inboundLog.setIntentTag(intentTag);
        inboundLog.setStatus("RECEIVED");
        inboundLog.setSentAt(now);
        inboundLog.setCreatedAt(now);
        messageLogDao.save(inboundLog);

        if (isOptOutMessage(body)) {
            profile.setConsentOptIn(Boolean.FALSE);
            profile.setFunnelStage("OPT_OUT");
            profileDao.saveOrUpdate(profile);
            auditConsent(lead, phoneE164, "OPT_OUT", "WHATSAPP_KEYWORD", "Inbound STOP keyword");

            Map<String, Object> out = new LinkedHashMap<>();
            out.put("accepted", true);
            out.put("leadId", leadId);
            out.put("action", "OPT_OUT_CAPTURED");
            out.put("intentTag", intentTag);
            return out;
        }

        createTaskFromIntent(lead, intentTag, now);

        if ("new".equalsIgnoreCase(trimToNull(lead.getStatus()))) {
            lead.setStatus("contacted");
            leadDao.saveOrUpdate(lead);
        }

        profileDao.saveOrUpdate(profile);

        Map<String, Object> runResult = runAgent(leadId);
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("accepted", true);
        out.put("leadId", leadId);
        out.put("intentTag", intentTag);
        out.put("leadScore", profile.getLeadScore());
        out.put("agent", runResult);
        return out;
    }

    @Override
    @Transactional
    public Map<String, Object> runAgent(Long leadId) {
        if (leadId == null) {
            throw new IllegalArgumentException("leadId is required.");
        }

        RDLead lead = leadDao.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found: " + leadId));
        RDMarketingLeadProfile profile = profileDao.findByLeadId(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead profile not found: " + leadId));

        LocalDateTime now = LocalDateTime.now();
        if (Boolean.FALSE.equals(profile.getConsentOptIn())) {
            Map<String, Object> out = new LinkedHashMap<>();
            out.put("leadId", leadId);
            out.put("action", "NO_ACTION_OPT_OUT");
            return out;
        }

        List<RDMarketingAgentTask> pending = taskDao.findPendingByLeadId(leadId);
        if (pending.isEmpty()) {
            RDMarketingAgentTask generated = generateDefaultTask(lead, profile, now);
            taskDao.saveOrUpdate(generated);
            pending = List.of(generated);
        }

        RDMarketingAgentTask task = pending.get(0);
        String toE164 = toE164(lead.getPhone());
        String body = renderTaskMessage(task, profile);

        WhatsAppSendResult sendResult = whatsAppService.sendText(toE164, body);

        RDMarketingMessageLog outLog = new RDMarketingMessageLog();
        outLog.setLead(lead);
        outLog.setDirection("OUTBOUND");
        outLog.setChannel("WHATSAPP");
        outLog.setTwilioSid(sendResult.getProviderMessageSid());
        outLog.setMessageType("SESSION");
        outLog.setBody(body);
        outLog.setIntentTag(task.getTaskType());
        outLog.setStatus(sendResult.isOk() ? "SENT" : "FAILED");
        outLog.setSentAt(now);
        outLog.setCreatedAt(now);
        messageLogDao.save(outLog);

        task.setTaskStatus(sendResult.isOk() ? "DONE" : "FAILED");
        task.setUpdatedAt(now);
        taskDao.saveOrUpdate(task);

        profile.setLastOutboundAt(now);
        profile.setLastAgentActionAt(now);
        profile.setUpdatedAt(now);
        profile.setFunnelStage(resolveFunnelStageAfterTask(task.getTaskType(), profile.getFunnelStage()));
        profileDao.saveOrUpdate(profile);

        if ("BOOKING_INVITE".equalsIgnoreCase(task.getTaskType())) {
            lead.setStatus("qualified");
            leadDao.saveOrUpdate(lead);
        }

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("leadId", leadId);
        out.put("taskId", task.getTaskId());
        out.put("taskType", task.getTaskType());
        out.put("sent", sendResult.isOk());
        out.put("messageSid", sendResult.getProviderMessageSid());
        out.put("error", sendResult.getErrorMessage());
        return out;
    }

    @Override
    @Transactional
    public Map<String, Object> createBooking(BookingCreateRequest request) {
        if (request == null || request.getLeadId() == null || request.getSlotTime() == null) {
            throw new IllegalArgumentException("leadId and slotTime are required.");
        }

        RDLead lead = leadDao.findById(request.getLeadId())
                .orElseThrow(() -> new IllegalArgumentException("Lead not found: " + request.getLeadId()));
        RDMarketingLeadProfile profile = profileDao.findByLeadId(request.getLeadId())
                .orElseThrow(() -> new IllegalArgumentException("Lead profile not found: " + request.getLeadId()));

        LocalDateTime now = LocalDateTime.now();

        RDMarketingBooking booking = new RDMarketingBooking();
        booking.setLead(lead);
        booking.setSlotTime(request.getSlotTime());
        booking.setMode(isBlank(request.getMode()) ? "PHONE" : request.getMode().trim().toUpperCase(Locale.ENGLISH));
        booking.setStatus("BOOKED");
        booking.setNotes(trimToNull(request.getNotes()));
        booking.setCreatedAt(now);
        booking.setUpdatedAt(now);
        bookingDao.save(booking);

        lead.setStatus("qualified");
        leadDao.saveOrUpdate(lead);

        profile.setFunnelStage("BOOKED");
        profile.setLeadScore(Math.max(0, nvlInt(profile.getLeadScore()) + 30));
        profile.setLastAgentActionAt(now);
        profile.setUpdatedAt(now);
        profileDao.saveOrUpdate(profile);

        String message = "Thanks. Your AptiPath360 demo is booked for " + request.getSlotTime() +
                ". Our counselor will connect with you.";
        WhatsAppSendResult sendResult = whatsAppService.sendText(toE164(lead.getPhone()), message);

        RDMarketingMessageLog logRow = new RDMarketingMessageLog();
        logRow.setLead(lead);
        logRow.setDirection("OUTBOUND");
        logRow.setChannel("WHATSAPP");
        logRow.setTwilioSid(sendResult.getProviderMessageSid());
        logRow.setMessageType("SESSION");
        logRow.setBody(message);
        logRow.setIntentTag("BOOKING_CONFIRM");
        logRow.setStatus(sendResult.isOk() ? "SENT" : "FAILED");
        logRow.setSentAt(now);
        logRow.setCreatedAt(now);
        messageLogDao.save(logRow);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("bookingId", booking.getBookingId());
        out.put("leadId", lead.getId());
        out.put("status", booking.getStatus());
        out.put("notified", sendResult.isOk());
        return out;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getKpis(LocalDate fromDate, LocalDate toDateInclusive) {
        LocalDate from = fromDate == null ? LocalDate.now().minusDays(7) : fromDate;
        LocalDate to = toDateInclusive == null ? LocalDate.now() : toDateInclusive;
        LocalDateTime fromTs = from.atStartOfDay();
        LocalDateTime toExclusive = to.plusDays(1).atStartOfDay();

        long newLeads = countLeadsByCreatedRangeAndAudience(fromTs, toExclusive, "parent");
        long qualified = countLeadsByStatusAndCreatedRange("qualified", fromTs, toExclusive);
        long paid = countLeadsByStatusAndCreatedRange("won", fromTs, toExclusive);
        long booked = bookingDao.countByStatusAndRange("BOOKED", fromTs, toExclusive);
        long inbound = messageLogDao.countByDirectionAndRange("INBOUND", fromTs, toExclusive);
        long outbound = messageLogDao.countByDirectionAndRange("OUTBOUND", fromTs, toExclusive);

        double bookingRate = newLeads == 0 ? 0.0 : round2((booked * 100.0) / newLeads);
        double qualifiedRate = newLeads == 0 ? 0.0 : round2((qualified * 100.0) / newLeads);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("fromDate", from.toString());
        out.put("toDate", to.toString());
        out.put("newLeads", newLeads);
        out.put("qualifiedLeads", qualified);
        out.put("bookedDemos", booked);
        out.put("paidLeads", paid);
        out.put("inboundMessages", inbound);
        out.put("outboundMessages", outbound);
        out.put("qualifiedRatePct", qualifiedRate);
        out.put("bookingRatePct", bookingRate);
        return out;
    }

    private RDMarketingAgentTask generateDefaultTask(RDLead lead, RDMarketingLeadProfile profile, LocalDateTime now) {
        if (isBlank(profile.getStudentGrade())) {
            return createTask(lead, "qualification", "QUALIFY_ASK_GRADE",
                    Map.of("question", "student_grade"), now);
        }
        if (nvlInt(profile.getLeadScore()) >= 60) {
            return createTask(lead, "booking", "BOOKING_INVITE",
                    Map.of("bookingUrl", bookingUrl), now);
        }
        return createTask(lead, "nurture", "NURTURE_VALUE",
                Map.of("topic", "career_clarity"), now);
    }

    private void createTaskFromIntent(RDLead lead, String intentTag, LocalDateTime now) {
        if ("demo_interest".equals(intentTag)) {
            taskDao.saveOrUpdate(createTask(lead, "booking", "BOOKING_INVITE", Map.of(), now));
            return;
        }
        if ("pricing".equals(intentTag)) {
            taskDao.saveOrUpdate(createTask(lead, "qualification", "HUMAN_HANDOFF", Map.of(), now));
            return;
        }
        if ("grade_signal".equals(intentTag)) {
            taskDao.saveOrUpdate(createTask(lead, "qualification", "QUALIFY_ASK_GRADE", Map.of(), now));
            return;
        }
        taskDao.saveOrUpdate(createTask(lead, "nurture", "NURTURE_VALUE", Map.of(), now));
    }

    private RDMarketingAgentTask createTask(RDLead lead, String agentName, String taskType, Map<String, Object> payload,
                                            LocalDateTime now) {
        RDMarketingAgentTask task = new RDMarketingAgentTask();
        task.setLead(lead);
        task.setAgentName(agentName);
        task.setTaskType(taskType);
        task.setTaskStatus("PENDING");
        task.setTaskPayload(toJson(payload));
        task.setRunAt(now);
        task.setCreatedAt(now);
        task.setUpdatedAt(now);
        return task;
    }

    private String renderTaskMessage(RDMarketingAgentTask task, RDMarketingLeadProfile profile) {
        String parent = isBlank(profile.getParentName()) ? "Parent" : profile.getParentName();
        String type = task.getTaskType();
        if ("QUALIFY_ASK_GRADE".equalsIgnoreCase(type)) {
            return "Hi " + parent + ", to share accurate AptiPath360 guidance, please reply with your child's current grade.";
        }
        if ("BOOKING_INVITE".equalsIgnoreCase(type)) {
            return "Hi " + parent + ", based on your responses we recommend a quick AptiPath360 demo. Book here: " + bookingUrl;
        }
        if ("HUMAN_HANDOFF".equalsIgnoreCase(type)) {
            return "Thanks for your question. Our AptiPath360 counselor will connect shortly to help with details.";
        }
        return "Hi " + parent + ", AptiPath360 helps convert career confusion into a practical 90-day action plan. Reply DEMO to book.";
    }

    private String resolveFunnelStageAfterTask(String taskType, String current) {
        if ("BOOKING_INVITE".equalsIgnoreCase(taskType)) {
            return "QUALIFIED";
        }
        if ("HUMAN_HANDOFF".equalsIgnoreCase(taskType)) {
            return "CONTACTED";
        }
        if ("QUALIFY_ASK_GRADE".equalsIgnoreCase(taskType)) {
            return "CONTACTED";
        }
        return isBlank(current) ? "CONTACTED" : current;
    }

    private String detectIntent(String body) {
        String b = isBlank(body) ? "" : body.toLowerCase(Locale.ENGLISH);
        if (b.contains("stop") || b.contains("unsubscribe") || b.contains("no msg")) {
            return "opt_out";
        }
        if (b.contains("demo") || b.contains("book")) {
            return "demo_interest";
        }
        if (b.contains("price") || b.contains("fees") || b.contains("cost")) {
            return "pricing";
        }
        if (b.contains("grade") || b.matches(".*\\b(8|9|10|11|12)\\b.*")) {
            return "grade_signal";
        }
        return "general";
    }

    private int scoreDeltaForIntent(String intentTag) {
        if ("demo_interest".equals(intentTag)) return 40;
        if ("pricing".equals(intentTag)) return 25;
        if ("grade_signal".equals(intentTag)) return 15;
        if ("general".equals(intentTag)) return 5;
        return 0;
    }

    private boolean isOptOutMessage(String body) {
        if (isBlank(body)) {
            return false;
        }
        String value = body.trim().toUpperCase(Locale.ENGLISH);
        return "STOP".equals(value) || "UNSUBSCRIBE".equals(value) || "NO MSG".equals(value);
    }

    private void auditConsent(RDLead lead, String phoneE164, String eventType, String eventSource, String details) {
        RDMarketingConsentAudit audit = new RDMarketingConsentAudit();
        audit.setLead(lead);
        audit.setPhoneE164(phoneE164);
        audit.setEventType(eventType);
        audit.setEventSource(eventSource);
        audit.setEventTime(LocalDateTime.now());
        audit.setDetails(details);
        consentAuditDao.save(audit);
    }

    private boolean validateTwilioSignature(String fullRequestUrl, Map<String, String> formParams, String signature) {
        if (isBlank(twilioAuthToken)) {
            log.warn("Twilio auth token missing. Rejecting webhook.");
            return false;
        }
        if (isBlank(signature) || isBlank(fullRequestUrl)) {
            return false;
        }
        try {
            RequestValidator validator = new RequestValidator(twilioAuthToken);
            return validator.validate(fullRequestUrl, formParams, signature);
        } catch (Exception ex) {
            log.warn("Twilio signature validation failed: {}", ex.toString());
            return false;
        }
    }

    private long countLeadsByCreatedRangeAndAudience(LocalDateTime fromTs, LocalDateTime toExclusive, String audience) {
        Session session = sessionFactory.getCurrentSession();
        Long count = session.createQuery(
                        "select count(l.id) from RDLead l where l.audience = :audience " +
                                "and l.createdAt >= :from and l.createdAt < :toExclusive",
                        Long.class)
                .setParameter("audience", audience)
                .setParameter("from", Timestamp.valueOf(fromTs))
                .setParameter("toExclusive", Timestamp.valueOf(toExclusive))
                .uniqueResult();
        return count == null ? 0L : count;
    }

    private long countLeadsByStatusAndCreatedRange(String status, LocalDateTime fromTs, LocalDateTime toExclusive) {
        Session session = sessionFactory.getCurrentSession();
        Long count = session.createQuery(
                        "select count(l.id) from RDLead l where lower(l.status) = :status " +
                                "and l.createdAt >= :from and l.createdAt < :toExclusive",
                        Long.class)
                .setParameter("status", status.toLowerCase(Locale.ENGLISH))
                .setParameter("from", Timestamp.valueOf(fromTs))
                .setParameter("toExclusive", Timestamp.valueOf(toExclusive))
                .uniqueResult();
        return count == null ? 0L : count;
    }

    private String toJson(Map<String, Object> payload) {
        try {
            return objectMapper.writeValueAsString(payload == null ? Map.of() : payload);
        } catch (JsonProcessingException ex) {
            return "{}";
        }
    }

    private String normalizeInboundFrom(String from) {
        String normalized = from.trim();
        if (normalized.toLowerCase(Locale.ENGLISH).startsWith("whatsapp:")) {
            normalized = normalized.substring("whatsapp:".length());
        }
        return toE164(normalizePhoneForLead(normalized));
    }

    private String normalizePhoneForLead(String phone) {
        String digits = phone == null ? "" : phone.replaceAll("\\D", "");
        if (digits.startsWith("0")) {
            digits = digits.substring(1);
        }
        if (digits.length() == 10) {
            digits = "91" + digits;
        }
        if (digits.length() < 8) {
            throw new IllegalArgumentException("Invalid phone number.");
        }
        return digits;
    }

    private String toE164(String digitsWithCountryCode) {
        String val = digitsWithCountryCode == null ? "" : digitsWithCountryCode.replaceAll("\\D", "");
        if (val.startsWith("0")) {
            val = val.substring(1);
        }
        if (!val.startsWith("91") && val.length() == 10) {
            val = "91" + val;
        }
        return "+" + val;
    }

    private String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private int nvlInt(Integer v) {
        return v == null ? 0 : v;
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
