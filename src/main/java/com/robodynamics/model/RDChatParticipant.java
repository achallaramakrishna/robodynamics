package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(
    name = "rd_chat_participant",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_chat_conv_user",
        columnNames = {"conversation_id", "user_id"}
    )
)
public class RDChatParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long participantId;

    /* ========= RELATIONSHIPS ========= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private RDChatConversation conversation;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "joined_at", nullable = false)
    private Date joinedAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_read_at")
    private Date lastReadAt;

    @Column(name = "is_admin", nullable = false)
    private boolean admin;

    @Column(name = "is_muted", nullable = false)
    private boolean muted;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    /* ========= GETTERS & SETTERS ========= */

    public Long getParticipantId() {
        return participantId;
    }

    public void setParticipantId(Long participantId) {
        this.participantId = participantId;
    }

    public RDChatConversation getConversation() {
        return conversation;
    }

    public void setConversation(RDChatConversation conversation) {
        this.conversation = conversation;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Date getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Date joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Date getLastReadAt() {
        return lastReadAt;
    }

    public void setLastReadAt(Date lastReadAt) {
        this.lastReadAt = lastReadAt;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean isMuted() {
        return muted;
    }

    public void setMuted(boolean muted) {
        this.muted = muted;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
