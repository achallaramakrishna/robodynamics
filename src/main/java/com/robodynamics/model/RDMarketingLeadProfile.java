package com.robodynamics.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_marketing_lead_profile")
public class RDMarketingLeadProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false, unique = true)
    private RDLead lead;

    @Column(name = "parent_name", length = 120)
    private String parentName;

    @Column(name = "student_name", length = 120)
    private String studentName;

    @Column(name = "student_grade", length = 20)
    private String studentGrade;

    @Column(name = "board", length = 40)
    private String board;

    @Column(name = "city", length = 80)
    private String city;

    @Column(name = "source_channel", length = 40)
    private String sourceChannel;

    @Column(name = "campaign_id", length = 80)
    private String campaignId;

    @Column(name = "consent_opt_in")
    private Boolean consentOptIn = Boolean.FALSE;

    @Column(name = "consent_time")
    private LocalDateTime consentTime;

    @Column(name = "lead_score")
    private Integer leadScore = 0;

    @Column(name = "funnel_stage", length = 30)
    private String funnelStage = "NEW";

    @Column(name = "owner_user_id")
    private Integer ownerUserId;

    @Column(name = "last_inbound_at")
    private LocalDateTime lastInboundAt;

    @Column(name = "last_outbound_at")
    private LocalDateTime lastOutboundAt;

    @Column(name = "last_agent_action_at")
    private LocalDateTime lastAgentActionAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public RDLead getLead() {
        return lead;
    }

    public void setLead(RDLead lead) {
        this.lead = lead;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentGrade() {
        return studentGrade;
    }

    public void setStudentGrade(String studentGrade) {
        this.studentGrade = studentGrade;
    }

    public String getBoard() {
        return board;
    }

    public void setBoard(String board) {
        this.board = board;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getSourceChannel() {
        return sourceChannel;
    }

    public void setSourceChannel(String sourceChannel) {
        this.sourceChannel = sourceChannel;
    }

    public String getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public Boolean getConsentOptIn() {
        return consentOptIn;
    }

    public void setConsentOptIn(Boolean consentOptIn) {
        this.consentOptIn = consentOptIn;
    }

    public LocalDateTime getConsentTime() {
        return consentTime;
    }

    public void setConsentTime(LocalDateTime consentTime) {
        this.consentTime = consentTime;
    }

    public Integer getLeadScore() {
        return leadScore;
    }

    public void setLeadScore(Integer leadScore) {
        this.leadScore = leadScore;
    }

    public String getFunnelStage() {
        return funnelStage;
    }

    public void setFunnelStage(String funnelStage) {
        this.funnelStage = funnelStage;
    }

    public Integer getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(Integer ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public LocalDateTime getLastInboundAt() {
        return lastInboundAt;
    }

    public void setLastInboundAt(LocalDateTime lastInboundAt) {
        this.lastInboundAt = lastInboundAt;
    }

    public LocalDateTime getLastOutboundAt() {
        return lastOutboundAt;
    }

    public void setLastOutboundAt(LocalDateTime lastOutboundAt) {
        this.lastOutboundAt = lastOutboundAt;
    }

    public LocalDateTime getLastAgentActionAt() {
        return lastAgentActionAt;
    }

    public void setLastAgentActionAt(LocalDateTime lastAgentActionAt) {
        this.lastAgentActionAt = lastAgentActionAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
