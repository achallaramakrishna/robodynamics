package com.robodynamics.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_ci_career_roadmap")
public class RDCICareerRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_career_roadmap_id")
    private Long ciCareerRoadmapId;

    @Column(name = "module_code", nullable = false)
    private String moduleCode;

    @Column(name = "assessment_version", nullable = false)
    private String assessmentVersion;

    @Column(name = "career_code", nullable = false)
    private String careerCode;

    @Column(name = "plan_tier", nullable = false)
    private String planTier;

    @Column(name = "grade_stage", nullable = false)
    private String gradeStage;

    @Column(name = "section_type", nullable = false)
    private String sectionType;

    @Column(name = "item_order", nullable = false)
    private Integer itemOrder;

    @Column(name = "title")
    private String title;

    @Column(name = "detail_text")
    private String detailText;

    @Column(name = "metadata_json")
    private String metadataJson;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiCareerRoadmapId() {
        return ciCareerRoadmapId;
    }

    public void setCiCareerRoadmapId(Long ciCareerRoadmapId) {
        this.ciCareerRoadmapId = ciCareerRoadmapId;
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

    public String getCareerCode() {
        return careerCode;
    }

    public void setCareerCode(String careerCode) {
        this.careerCode = careerCode;
    }

    public String getPlanTier() {
        return planTier;
    }

    public void setPlanTier(String planTier) {
        this.planTier = planTier;
    }

    public String getGradeStage() {
        return gradeStage;
    }

    public void setGradeStage(String gradeStage) {
        this.gradeStage = gradeStage;
    }

    public String getSectionType() {
        return sectionType;
    }

    public void setSectionType(String sectionType) {
        this.sectionType = sectionType;
    }

    public Integer getItemOrder() {
        return itemOrder;
    }

    public void setItemOrder(Integer itemOrder) {
        this.itemOrder = itemOrder;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetailText() {
        return detailText;
    }

    public void setDetailText(String detailText) {
        this.detailText = detailText;
    }

    public String getMetadataJson() {
        return metadataJson;
    }

    public void setMetadataJson(String metadataJson) {
        this.metadataJson = metadataJson;
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
