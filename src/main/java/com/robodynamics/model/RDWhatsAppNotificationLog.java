package com.robodynamics.model;

import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name = "rd_whatsapp_notification_logs")
public class RDWhatsAppNotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private int logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private RDUser user;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "message_type")
    private String messageType; // e.g. CLASS_REMINDER, PAYMENT_REMINDER, BROADCAST

    @Column(name = "message_content", columnDefinition = "TEXT")
    private String messageContent;

    @Column(name = "status")
    private String status; // SENT, FAILED, QUEUED

    @Column(name = "response_message")
    private String responseMessage;

    @Column(name = "sent_time")
    private LocalDateTime sentTime = LocalDateTime.now();

    // ===== Constructors =====
    public RDWhatsAppNotificationLog() {}

    public RDWhatsAppNotificationLog(RDUser user, String phoneNumber, String messageType, 
                                     String messageContent, String status, String responseMessage) {
        this.user = user;
        this.phoneNumber = phoneNumber;
        this.messageType = messageType;
        this.messageContent = messageContent;
        this.status = status;
        this.responseMessage = responseMessage;
        this.sentTime = LocalDateTime.now();
    }

    // ===== Getters & Setters =====
    public int getLogId() { return logId; }
    public void setLogId(int logId) { this.logId = logId; }

    public RDUser getUser() { return user; }
    public void setUser(RDUser user) { this.user = user; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }

    public String getMessageContent() { return messageContent; }
    public void setMessageContent(String messageContent) { this.messageContent = messageContent; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResponseMessage() { return responseMessage; }
    public void setResponseMessage(String responseMessage) { this.responseMessage = responseMessage; }

    public LocalDateTime getSentTime() { return sentTime; }
    public void setSentTime(LocalDateTime sentTime) { this.sentTime = sentTime; }

    @Override
    public String toString() {
        return "RDWhatsAppNotificationLog{" +
                "logId=" + logId +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", messageType='" + messageType + '\'' +
                ", status='" + status + '\'' +
                ", sentTime=" + sentTime +
                '}';
    }
}
