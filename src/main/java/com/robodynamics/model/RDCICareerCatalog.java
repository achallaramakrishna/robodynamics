package com.robodynamics.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_ci_career_catalog")
public class RDCICareerCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_career_catalog_id")
    private Long ciCareerCatalogId;

    @Column(name = "module_code", nullable = false)
    private String moduleCode;

    @Column(name = "assessment_version", nullable = false)
    private String assessmentVersion;

    @Column(name = "career_code", nullable = false)
    private String careerCode;

    @Column(name = "career_name", nullable = false)
    private String careerName;

    @Column(name = "cluster_name", nullable = false)
    private String clusterName;

    @Column(name = "fit_strategy")
    private String fitStrategy;

    @Column(name = "pathway_hint")
    private String pathwayHint;

    @Column(name = "exam_hint")
    private String examHint;

    @Column(name = "prerequisite_summary")
    private String prerequisiteSummary;

    @Column(name = "required_subjects_csv")
    private String requiredSubjectsCsv;

    @Column(name = "entrance_exams_csv")
    private String entranceExamsCsv;

    @Column(name = "min_math_level")
    private Integer minMathLevel;

    @Column(name = "min_physics_level")
    private Integer minPhysicsLevel;

    @Column(name = "min_chemistry_level")
    private Integer minChemistryLevel;

    @Column(name = "min_biology_level")
    private Integer minBiologyLevel;

    @Column(name = "min_language_level")
    private Integer minLanguageLevel;

    @Column(name = "target_phase")
    private String targetPhase;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiCareerCatalogId() {
        return ciCareerCatalogId;
    }

    public void setCiCareerCatalogId(Long ciCareerCatalogId) {
        this.ciCareerCatalogId = ciCareerCatalogId;
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

    public String getCareerName() {
        return careerName;
    }

    public void setCareerName(String careerName) {
        this.careerName = careerName;
    }

    public String getClusterName() {
        return clusterName;
    }

    public void setClusterName(String clusterName) {
        this.clusterName = clusterName;
    }

    public String getFitStrategy() {
        return fitStrategy;
    }

    public void setFitStrategy(String fitStrategy) {
        this.fitStrategy = fitStrategy;
    }

    public String getPathwayHint() {
        return pathwayHint;
    }

    public void setPathwayHint(String pathwayHint) {
        this.pathwayHint = pathwayHint;
    }

    public String getExamHint() {
        return examHint;
    }

    public void setExamHint(String examHint) {
        this.examHint = examHint;
    }

    public String getPrerequisiteSummary() {
        return prerequisiteSummary;
    }

    public void setPrerequisiteSummary(String prerequisiteSummary) {
        this.prerequisiteSummary = prerequisiteSummary;
    }

    public String getRequiredSubjectsCsv() {
        return requiredSubjectsCsv;
    }

    public void setRequiredSubjectsCsv(String requiredSubjectsCsv) {
        this.requiredSubjectsCsv = requiredSubjectsCsv;
    }

    public String getEntranceExamsCsv() {
        return entranceExamsCsv;
    }

    public void setEntranceExamsCsv(String entranceExamsCsv) {
        this.entranceExamsCsv = entranceExamsCsv;
    }

    public Integer getMinMathLevel() {
        return minMathLevel;
    }

    public void setMinMathLevel(Integer minMathLevel) {
        this.minMathLevel = minMathLevel;
    }

    public Integer getMinPhysicsLevel() {
        return minPhysicsLevel;
    }

    public void setMinPhysicsLevel(Integer minPhysicsLevel) {
        this.minPhysicsLevel = minPhysicsLevel;
    }

    public Integer getMinChemistryLevel() {
        return minChemistryLevel;
    }

    public void setMinChemistryLevel(Integer minChemistryLevel) {
        this.minChemistryLevel = minChemistryLevel;
    }

    public Integer getMinBiologyLevel() {
        return minBiologyLevel;
    }

    public void setMinBiologyLevel(Integer minBiologyLevel) {
        this.minBiologyLevel = minBiologyLevel;
    }

    public Integer getMinLanguageLevel() {
        return minLanguageLevel;
    }

    public void setMinLanguageLevel(Integer minLanguageLevel) {
        this.minLanguageLevel = minLanguageLevel;
    }

    public String getTargetPhase() {
        return targetPhase;
    }

    public void setTargetPhase(String targetPhase) {
        this.targetPhase = targetPhase;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
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
