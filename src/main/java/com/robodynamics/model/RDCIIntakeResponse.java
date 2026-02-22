package com.robodynamics.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_ci_intake_response")
public class RDCIIntakeResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_intake_response_id")
    private Long ciIntakeResponseId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ci_subscription_id", nullable = false)
    private RDCISubscription subscription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_user_id")
    private RDUser parentUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_user_id")
    private RDUser studentUser;

    @Column(name = "respondent_type", nullable = false)
    private String respondentType;

    @Column(name = "section_code")
    private String sectionCode;

    @Column(name = "question_code", nullable = false)
    private String questionCode;

    @Column(name = "answer_value")
    private String answerValue;

    @Column(name = "answer_json", columnDefinition = "json")
    private String answerJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiIntakeResponseId() {
        return ciIntakeResponseId;
    }

    public void setCiIntakeResponseId(Long ciIntakeResponseId) {
        this.ciIntakeResponseId = ciIntakeResponseId;
    }

    public RDCISubscription getSubscription() {
        return subscription;
    }

    public void setSubscription(RDCISubscription subscription) {
        this.subscription = subscription;
    }

    public RDUser getParentUser() {
        return parentUser;
    }

    public void setParentUser(RDUser parentUser) {
        this.parentUser = parentUser;
    }

    public RDUser getStudentUser() {
        return studentUser;
    }

    public void setStudentUser(RDUser studentUser) {
        this.studentUser = studentUser;
    }

    public String getRespondentType() {
        return respondentType;
    }

    public void setRespondentType(String respondentType) {
        this.respondentType = respondentType;
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getQuestionCode() {
        return questionCode;
    }

    public void setQuestionCode(String questionCode) {
        this.questionCode = questionCode;
    }

    public String getAnswerValue() {
        return answerValue;
    }

    public void setAnswerValue(String answerValue) {
        this.answerValue = answerValue;
    }

    public String getAnswerJson() {
        return answerJson;
    }

    public void setAnswerJson(String answerJson) {
        this.answerJson = answerJson;
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
