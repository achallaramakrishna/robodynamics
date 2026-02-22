package com.robodynamics.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_ci_question_bank")
public class RDCIQuestionBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_question_id")
    private Long ciQuestionId;

    @Column(name = "module_code", nullable = false)
    private String moduleCode;

    @Column(name = "assessment_version", nullable = false)
    private String assessmentVersion;

    @Column(name = "question_code", nullable = false)
    private String questionCode;

    @Column(name = "sequence_no", nullable = false)
    private Integer sequenceNo;

    @Column(name = "section_code")
    private String sectionCode;

    @Column(name = "question_type", nullable = false)
    private String questionType;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "options_json", nullable = false)
    private String optionsJson;

    @Column(name = "correct_option")
    private String correctOption;

    @Column(name = "media_image_url")
    private String mediaImageUrl;

    @Column(name = "media_video_url")
    private String mediaVideoUrl;

    @Column(name = "media_animation_url")
    private String mediaAnimationUrl;

    @Column(name = "weightage", nullable = false)
    private BigDecimal weightage;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiQuestionId() {
        return ciQuestionId;
    }

    public void setCiQuestionId(Long ciQuestionId) {
        this.ciQuestionId = ciQuestionId;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public String getAssessmentVersion() {
        return assessmentVersion;
    }

    public void setAssessmentVersion(String assessmentVersion) {
        this.assessmentVersion = assessmentVersion;
    }

    public String getQuestionCode() {
        return questionCode;
    }

    public void setQuestionCode(String questionCode) {
        this.questionCode = questionCode;
    }

    public Integer getSequenceNo() {
        return sequenceNo;
    }

    public void setSequenceNo(Integer sequenceNo) {
        this.sequenceNo = sequenceNo;
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getOptionsJson() {
        return optionsJson;
    }

    public void setOptionsJson(String optionsJson) {
        this.optionsJson = optionsJson;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public String getMediaImageUrl() {
        return mediaImageUrl;
    }

    public void setMediaImageUrl(String mediaImageUrl) {
        this.mediaImageUrl = mediaImageUrl;
    }

    public String getMediaVideoUrl() {
        return mediaVideoUrl;
    }

    public void setMediaVideoUrl(String mediaVideoUrl) {
        this.mediaVideoUrl = mediaVideoUrl;
    }

    public String getMediaAnimationUrl() {
        return mediaAnimationUrl;
    }

    public void setMediaAnimationUrl(String mediaAnimationUrl) {
        this.mediaAnimationUrl = mediaAnimationUrl;
    }

    public BigDecimal getWeightage() {
        return weightage;
    }

    public void setWeightage(BigDecimal weightage) {
        this.weightage = weightage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
