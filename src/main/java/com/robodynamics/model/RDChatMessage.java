package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(
    name = "rd_chat_message",
    indexes = {
        @Index(name = "idx_chat_msg_conv_time", columnList = "conversation_id,created_at"),
        @Index(name = "idx_chat_msg_sender", columnList = "sender_user_id")
    }
)
public class RDChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @Column(name = "conversation_id", nullable = false)
    private Long conversationId;

    @Column(name = "sender_user_id", nullable = false)
    private Integer senderUserId;

    @Column(name = "message_type", nullable = false)
    private String messageType; // TEXT | SYSTEM | IMAGE | FILE

    @Column(name = "message_text", nullable = false, columnDefinition = "TEXT")
    private String messageText;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    /* ========= GETTERS & SETTERS ========= */

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public Integer getSenderUserId() {
        return senderUserId;
    }

    public void setSenderUserId(Integer senderUserId) {
        this.senderUserId = senderUserId;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
