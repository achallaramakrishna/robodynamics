package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "rd_chat_conversation")
public class RDChatConversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private Long conversationId;

    @Column(name = "conversation_type", nullable = false)
    private String conversationType; // DIRECT | GROUP | BOT (future)

    @Column(name = "title")
    private String title; // Only for GROUP chats

    @Column(name = "created_by", nullable = false)
    private Integer createdBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_message_at")
    private Date lastMessageAt;

    @Column(name = "status", nullable = false)
    private String status; // ACTIVE | ARCHIVED | BLOCKED

    /* ========= RELATIONSHIPS ========= */

    @OneToMany(mappedBy = "conversation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<RDChatParticipant> participants;

    /* ========= GETTERS & SETTERS ========= */

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public String getConversationType() {
        return conversationType;
    }

    public void setConversationType(String conversationType) {
        this.conversationType = conversationType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getLastMessageAt() {
        return lastMessageAt;
    }

    public void setLastMessageAt(Date lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<RDChatParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<RDChatParticipant> participants) {
        this.participants = participants;
    }
}
