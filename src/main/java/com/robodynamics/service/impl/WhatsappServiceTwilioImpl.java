package com.robodynamics.service.impl;

import com.robodynamics.service.WhatsAppService;
import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsappServiceTwilioImpl implements WhatsAppService {
    private static final Logger log = LoggerFactory.getLogger(WhatsappServiceTwilioImpl.class);

    /* ========= core creds & messaging service ========= */
    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.messagingServiceSid}")
    private String messagingServiceSid;

    /* ========= template content SIDs (HX...) ========= */
    @Value("${twilio.templates.parent.thankyou:}")
    private String tplParentThankYou;
    
    @Value("${twilio.templates.admin.leadnotification:}")
    private String tplAdminLeadNotification;
    
    @Value("${twilio.templates.mentor.thankyou:}")
    private String tplMentorThankYou;
    @Value("${twilio.templates.mentor.assignment:}")
    private String tplMentorAssignment;
    @Value("${twilio.templates.demo.scheduled:}")
    private String tplDemoScheduled;
    @Value("${twilio.templates.demo.reminder:}")
    private String tplDemoReminder;
    @Value("${twilio.templates.demo.reschedule:}")
    private String tplReschedule;
    @Value("${twilio.templates.parent.followup:}")
    private String tplParentFollowup;
    
    @Value("${twilio.templates.mentor.reminder:}")
    private String tplClassMentorReminder;
    
    @Value("${twilio.templates.student.reminder:}")
    private String tplClassStudentReminder;
    
    

    /* ========= optional fallbacks ========= */
    @Value("${wa.fallback.parent.thankyou:}")
    private String fbParentThankYou;
    
    /* ========= optional fallbacks ========= */
    @Value("${wa.fallback.admin.leadnotification:}")
    private String fbAdminLeadNotification;

    private final DateTimeFormatter human = DateTimeFormatter.ofPattern("EEE, d MMM yyyy h:mm a");

    @PostConstruct
    public void init() {
        // Fail fast on core creds/MSID
        requireNonBlank("twilio.accountSid", accountSid);
        requireNonBlank("twilio.authToken", authToken);
        requireNonBlank("twilio.messagingServiceSid", messagingServiceSid);

        Twilio.init(accountSid, authToken);
        System.out.println("messagingServiceSid - " + messagingServiceSid);
        log.info("Twilio initialized (MSID={})", maskSid(messagingServiceSid));
        System.out.println("tplParentThankYou - " + tplParentThankYou);

        // Log which templates are present (masked)
        log.info("Templates: parent.thankyou={}, mentor.thankyou={}, mentor.assignment={}, demo.scheduled={}, demo.reminder={}, demo.reschedule={}, parent.followup={}",
                maskSid(tplParentThankYou), maskSid(tplMentorThankYou), maskSid(tplMentorAssignment),
                maskSid(tplDemoScheduled), maskSid(tplDemoReminder), maskSid(tplReschedule), maskSid(tplParentFollowup));
    }

    /* ========================= High-level ========================= */

    @Override
    public WhatsAppSendResult sendLeadThankYouParent(long leadId, String parentName, String toE164) {
    	System.out.println("Whatsapp 1....");
    	Map<String,Object> v = new HashMap<>();
        v.put("1", safe(parentName));
        v.put("2", String.valueOf(leadId));
    	System.out.println("Whatsapp 2....");
        System.out.println("tplParentThankYou - " + tplParentThankYou);

        // Try template; if missing or rejected, send fallback text if configured
        WhatsAppSendResult res = sendTemplate(toE164, tplParentThankYou, v);
        if (!res.isOk() && (isBlank(tplParentThankYou) || is4xx(res))) {
            String body = fbParentThankYou;
            if (!isBlank(body)) {
                body = body.replace("{name}", safe(parentName))
                           .replace("{leadId}", String.valueOf(leadId));
                return sendText(toE164, body);
            }
        }
        return res;
    }

    @Override
    public WhatsAppSendResult sendMentorThankYou(long userId, String mentorFirstName, String toE164) {
        Map<String,Object> v = new HashMap<>();
        v.put("1", safe(mentorFirstName));
        v.put("2", String.valueOf(userId));
        return sendTemplate(toE164, tplMentorThankYou, v);
    }

    @Override
    public WhatsAppSendResult sendMentorAssignment(long leadId, long mentorUserId, String mentorFirstName, String skillName, String toE164) {
        Map<String,Object> v = new HashMap<>();
        v.put("1", safe(mentorFirstName));
        v.put("2", safe(skillName));
        v.put("3", String.valueOf(leadId));
        return sendTemplate(toE164, tplMentorAssignment, v);
    }

    @Override
    public WhatsAppSendResult sendDemoScheduled(long leadId, String parentFirstName, LocalDateTime demoStart, String tzName, String meetingLink, String toE164) {
        Map<String,Object> v = new HashMap<>();
        v.put("1", safe(parentFirstName));
        v.put("2", demoStart != null ? human.format(demoStart) : "TBA");
        v.put("3", safe(tzName));
        v.put("4", safe(meetingLink));
        v.put("5", String.valueOf(leadId));
        return sendTemplate(toE164, tplDemoScheduled, v);
    }

    @Override
    public WhatsAppSendResult sendDemoReminder(long leadId, LocalDateTime demoStart, String tzName, int hoursBefore, String toE164) {
        Map<String,Object> v = new HashMap<>();
        v.put("1", String.valueOf(hoursBefore));
        v.put("2", demoStart != null ? human.format(demoStart) : "soon");
        v.put("3", safe(tzName));
        v.put("4", String.valueOf(leadId));
        return sendTemplate(toE164, tplDemoReminder, v);
    }

    @Override
    public WhatsAppSendResult sendRescheduleLink(long leadId, String rescheduleUrl, String toE164) {
        Map<String,Object> v = new HashMap<>();
        v.put("1", safe(rescheduleUrl));
        v.put("2", String.valueOf(leadId));
        return sendTemplate(toE164, tplReschedule, v);
    }

    @Override
    public WhatsAppSendResult sendParentFollowUpNoResponse(long leadId, int daysSince, String toE164) {
        Map<String,Object> v = new HashMap<>();
        v.put("1", String.valueOf(daysSince));
        v.put("2", String.valueOf(leadId));
        return sendTemplate(toE164, tplParentFollowup, v);
    }

    /* ========================= Mid/low-level ========================= */

    @Override
    public WhatsAppSendResult sendTemplate(String toE164, String contentSid, Map<String, Object> contentVariables) {
        if (!isValidE164(toE164)) {
            return WhatsAppSendResult.failure(400, 0, "Invalid E.164 number: " + toE164);
        }
        System.out.println("tplParentThankYou - " + tplParentThankYou);
        System.out.println("Whatsapp 1...");
        if (isBlank(contentSid)) {
            log.warn("WA template send skipped: blank Content SID");
            return WhatsAppSendResult.failure(400, 0, "Blank Content SID");
        }
        System.out.println("Whatsapp 2...");

        try {
            String waTo = toWaAddress(toE164);
            System.out.println("To - " + waTo);
            JSONObject vars = new JSONObject(contentVariables != null ? contentVariables : Map.of());
            System.out.println("Whatsapp 3...");

            Message msg = Message.creator(new PhoneNumber(waTo), messagingServiceSid, "")
                    .setContentSid(contentSid)
                    .setContentVariables(vars.toString())
                    .create();
            System.out.println("Whatsapp 4...");

            log.info("WA template sent sid={} to={} contentSid={}", msg.getSid(), toE164, maskSid(contentSid));
            return WhatsAppSendResult.success(msg.getSid());
        } catch (ApiException ex) {
            System.out.println("Whatsapp 5...");
            System.out.println(ex.getStatusCode() + " " + ex.getCode() + " " + ex.getMessage());
            log.warn("WA template failed to={} status={} code={} msg={} contentSid={}",
                    toE164, ex.getStatusCode(), ex.getCode(), ex.getMessage(), maskSid(contentSid));
            return WhatsAppSendResult.failure(ex.getStatusCode(), ex.getCode(), ex.getMessage());
        } catch (Exception ex) {
        	System.out.println(ex.toString());
            log.error("WA template unexpected error to={} err={}", toE164, ex.toString());
            return WhatsAppSendResult.failure(500, 0, ex.getMessage());
        }
    }

    @Override
    public WhatsAppSendResult sendText(String toE164, String body) {
        if (!isValidE164(toE164)) {
            return WhatsAppSendResult.failure(400, 0, "Invalid E.164 number: " + toE164);
        }
        try {
            String waTo = toWaAddress(toE164);
            Message msg = Message.creator(new PhoneNumber(waTo), messagingServiceSid, body).create();
            log.info("WA text sent sid={} to={}", msg.getSid(), toE164);
            return WhatsAppSendResult.success(msg.getSid());
        } catch (ApiException ex) {
            log.warn("WA text failed to={} status={} code={} msg={}",
                    toE164, ex.getStatusCode(), ex.getCode(), ex.getMessage());
            return WhatsAppSendResult.failure(ex.getStatusCode(), ex.getCode(), ex.getMessage());
        } catch (Exception ex) {
            log.error("WA text unexpected error to={} err={}", toE164, ex.toString());
            return WhatsAppSendResult.failure(500, 0, ex.getMessage());
        }
    }

    @Override
    public boolean isValidE164(String number) {
        if (number == null) return false;
        String n = number.trim();
        return n.matches("^\\+?[1-9]\\d{7,14}$");
    }

    /* ========================= Utilities ========================= */

    private String toWaAddress(String e164) {
        String n = e164.replaceAll("\\s+", "");
        if (!n.startsWith("+")) n = "+" + n;
        return "whatsapp:" + n;
    }
    private static String safe(String s) { return s == null ? "" : s; }
    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private static String maskSid(String sid) {
        if (isBlank(sid) || sid.length() < 6) return sid;
        return sid.substring(0, 2) + "…" + sid.substring(sid.length() - 4);
    }
    private static void requireNonBlank(String key, String val) {
        if (val == null || val.isBlank()) throw new IllegalStateException("Missing required property: " + key);
    }
    private static boolean is4xx(WhatsAppSendResult r) { 
        Integer s = r.getHttpStatus(); 
        return s != null && s >= 400 && s < 500; 
    }

    @Override
    public WhatsAppSendResult sendAdminLeadNotification(long leadId,
                                                        String parentName,
                                                        String grade,
                                                        String board,
                                                        String phoneE164,
                                                        String toE164) {
    	Twilio.init("ACbbe8018ca570c46f2c97abb72a6b7085", "6cee1a106f97b213bd4bcbe6a987c564");

    	
    	System.out.println("Whatsapp Admin Lead Notification...");

        String adminNumber = "whatsapp:+918374377311";  

        // === Build variables exactly as template expects ===
        Map<String, String> vars = new HashMap<>();
        vars.put("1", "Admin");
        vars.put("2", grade);         // grade
        vars.put("3", board);      // board
        vars.put("4", parentName);     // parent name
        vars.put("5", phoneE164);// parent phone (no +91)
        vars.put("6", String.valueOf(leadId));       // leadId
        JSONObject jsonVars = new JSONObject(vars);
        System.out.println("ContentVariables JSON -> " + jsonVars.toString());
        Message msg = null;
        try {
       	 msg = Message.creator(new PhoneNumber(adminNumber), "MGa897be7a55bec4dd13cba80e4a80e714", "")
                    .setContentSid("HXc54ecae3440adb3a52bd327c8cc41047")
                    .setContentVariables(jsonVars.toString())
                    .create();

           System.out.println("✅ Sent successfully. SID: " + msg.getSid());
           return WhatsAppSendResult.success(msg.getSid());

       } catch (ApiException ex) {
           System.err.println("❌ API Error: " + ex.getStatusCode() + " " + ex.getCode() + " " + ex.getMessage());
       } catch (Exception e) {
           e.printStackTrace();
       }

     //   System.out.println("tplAdminLeadNotification - " + tplAdminLeadNotification);

        // Attempt template send
     //   WhatsAppSendResult res = sendTemplate(toE164, tplAdminLeadNotification, v);

        // Fallback if template missing or rejected
		/*
		 * if (!res.isOk() && (isBlank(tplAdminLeadNotification) || is4xx(res))) {
		 * String body = fbAdminLeadNotification; if (!isBlank(body)) { body =
		 * body.replace("{parentName}", safe(parentName)) .replace("{leadId}",
		 * String.valueOf(leadId)) .replace("{grade}", safe(grade)) .replace("{board}",
		 * safe(board)) .replace("{phone}", safe(phoneE164)); return sendText(toE164,
		 * body); } } return res;
		 */
        return null;
    }

    @Override
    public WhatsAppSendResult sendClassReminderMentor(long courseOfferingId,
                                                      String courseName,
                                                      LocalDateTime sessionStart,
                                                      String toE164) {
        System.out.println("WhatsApp Mentor Reminder...");
        Map<String, Object> v = new HashMap<>();
        v.put("1", safe(courseName));
        v.put("2", sessionStart != null ? human.format(sessionStart) : "TBA");
        v.put("3", String.valueOf(courseOfferingId));

        // Attempt to send via template (you can create a dedicated template for mentor reminders)
        WhatsAppSendResult res = sendTemplate(toE164, tplClassMentorReminder, v);
        if (!res.isOk() && (isBlank(tplClassMentorReminder) || is4xx(res))) {
            // fallback message
            String body = "Reminder: Your class for *" + safe(courseName) + "* is scheduled on "
                    + (sessionStart != null ? human.format(sessionStart) : "TBA")
                    + ". Offering ID: " + courseOfferingId + ".";
            return sendText(toE164, body);
        }
        return res;
    }

    @Override
    public WhatsAppSendResult sendClassReminderStudent(long enrollmentId,
                                                       String studentName,
                                                       String courseName,
                                                       LocalDateTime sessionStart,
                                                       String toE164) {
        System.out.println("WhatsApp Student Reminder...");
        Map<String, Object> v = new HashMap<>();
        v.put("1", safe(studentName));
        v.put("2", safe(courseName));
        v.put("3", sessionStart != null ? human.format(sessionStart) : "TBA");
        v.put("4", String.valueOf(enrollmentId));

        // Attempt to send via template (you can map tplDemoReminder or new student reminder SID)
        WhatsAppSendResult res = sendTemplate(toE164, tplClassStudentReminder, v);
        if (!res.isOk() && (isBlank(tplClassStudentReminder) || is4xx(res))) {
            String body = "Hi " + safe(studentName) + ", your class *" + safe(courseName)
                    + "* is scheduled on " + (sessionStart != null ? human.format(sessionStart) : "TBA")
                    + ". Enrollment ID: " + enrollmentId + ".";
            return sendText(toE164, body);
        }
        return res;
    }

    @Override
    public void sendWhatsAppMessage(String cellPhone, String msg) {
        System.out.println("WhatsApp generic message send...");
        if (isBlank(cellPhone) || isBlank(msg)) {
            log.warn("Skipped sendWhatsAppMessage: missing number or message");
            return;
        }

        // Auto-format number (optional country fallback, e.g. India)
        if (!cellPhone.startsWith("+")) {
            cellPhone = "+91" + cellPhone.replaceAll("\\D", "");
        }

        WhatsAppSendResult res = sendText(cellPhone, msg);
        if (!res.isOk()) {
            log.warn("Failed to send WhatsApp message to {} → {}", cellPhone, res.getErrorMessage());
        } else {
            log.info("✅ WhatsApp message sent to {} (SID: {})", cellPhone, res.getProviderMessageSid());
        }
    }



}
