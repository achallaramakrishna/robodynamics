package com.robodynamics.service;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Abstraction over WhatsApp sending (e.g., via Twilio).
 * Keep all Twilio-specific code in the implementation (e.g., WhatsappServiceTwilio).
 *
 * Numbers MUST be E.164 (e.g. +919876543210). Implementations may prepend "whatsapp:" as needed.
 */
public interface WhatsAppService {

    /* =========================
       High-level, app-specific
       ========================= */

    /** Parent submits lead/demo form → immediate thank-you + next steps. */
    WhatsAppSendResult sendLeadThankYouParent(long leadId,
                                              String parentName,
                                              String toE164);

    /** Mentor submits interest → acknowledge + what happens next. */
    WhatsAppSendResult sendMentorThankYou(long userId,
                                          String mentorFirstName,
                                          String toE164);
    
    /** Notify admin team when a new lead is submitted. */
    WhatsAppSendResult sendAdminLeadNotification(long leadId,
                                                 String parentName,
                                                 String grade,
                                                 String board,
                                                 String phoneE164,
                                                 String toE164);


    /** Ops matched mentors to a lead/skill → notify mentor. */
    WhatsAppSendResult sendMentorAssignment(long leadId,
                                            long mentorUserId,
                                            String mentorFirstName,
                                            String skillName,
                                            String toE164);

    /** Demo slot confirmed with parent. */
    WhatsAppSendResult sendDemoScheduled(long leadId,
                                         String parentFirstName,
                                         LocalDateTime demoStart,
                                         String tzName,
                                         String meetingLink,
                                         String toE164);

    /** 24h/2h reminders before the demo. */
    WhatsAppSendResult sendDemoReminder(long leadId,
                                        LocalDateTime demoStart,
                                        String tzName,
                                        int hoursBefore,
                                        String toE164);

    /** Send a self-service reschedule link or quick-reply instructions. */
    WhatsAppSendResult sendRescheduleLink(long leadId,
                                          String rescheduleUrl,
                                          String toE164);

    /** Gentle nudge if parent hasn’t responded after N days. */
    WhatsAppSendResult sendParentFollowUpNoResponse(long leadId,
                                                    int daysSince,
                                                    String toE164);

    /* =========================
       Mid/low-level helpers
       ========================= */

    /**
     * Send a pre-approved WhatsApp Content Template by its Content SID (e.g., HXxxxxxxxx...).
     * Map keys are the template variable indexes: "1","2","3", ... (as strings).
     */
    WhatsAppSendResult sendTemplate(String toE164,
                                    String contentSid,
                                    Map<String, Object> contentVariables);

    /** Fallback plain text (not recommended for business-initiated messages). */
    WhatsAppSendResult sendText(String toE164, String body);

    WhatsAppSendResult sendClassReminderMentor(long courseOfferingId,
            String courseName,
            LocalDateTime sessionStart,
            String toE164);

	/** 
	* Reminder to student before class start.
	* Usually same message, but more friendly tone.
	*/
	WhatsAppSendResult sendClassReminderStudent(long enrollmentId,
	             String studentName,
	             String courseName,
	             LocalDateTime sessionStart,
	             String toE164);


    /** Simple format check for E.164. Implementation may also add country fallback. */
    boolean isValidE164(String number);

    /** Uniform way to describe send outcome without leaking vendor types. */
    final class WhatsAppSendResult {
        private final boolean ok;
        private final String providerMessageSid; // e.g., Twilio SID
        private final Integer httpStatus;        // nullable
        private final Integer errorCode;         // nullable (e.g., Twilio error code)
        private final String errorMessage;       // nullable

        public WhatsAppSendResult(boolean ok,
                                  String providerMessageSid,
                                  Integer httpStatus,
                                  Integer errorCode,
                                  String errorMessage) {
            this.ok = ok;
            this.providerMessageSid = providerMessageSid;
            this.httpStatus = httpStatus;
            this.errorCode = errorCode;
            this.errorMessage = errorMessage;
        }

        public boolean isOk() { return ok; }
        public String getProviderMessageSid() { return providerMessageSid; }
        public Integer getHttpStatus() { return httpStatus; }
        public Integer getErrorCode() { return errorCode; }
        public String getErrorMessage() { return errorMessage; }

        public static WhatsAppSendResult success(String sid) {
            return new WhatsAppSendResult(true, sid, null, null, null);
        }
        public static WhatsAppSendResult failure(Integer httpStatus, Integer errorCode, String msg) {
            return new WhatsAppSendResult(false, null, httpStatus, errorCode, msg);
        }
        
    }

	void sendWhatsAppMessage(String cellPhone, String msg);
}
