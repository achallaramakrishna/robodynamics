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
@Table(name = "rd_ci_career_adjustment")
public class RDCICareerAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_career_adjustment_id")
    private Long ciCareerAdjustmentId;

    @Column(name = "module_code", nullable = false)
    private String moduleCode;

    @Column(name = "assessment_version", nullable = false)
    private String assessmentVersion;

    @Column(name = "signal_type", nullable = false)
    private String signalType;

    @Column(name = "signal_code", nullable = false)
    private String signalCode;

    @Column(name = "signal_band", nullable = false)
    private String signalBand;

    @Column(name = "cluster_name", nullable = false)
    private String clusterName;

    @Column(name = "boost_value", nullable = false)
    private BigDecimal boostValue;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiCareerAdjustmentId() {
        return ciCareerAdjustmentId;
    }

    public void setCiCareerAdjustmentId(Long ciCareerAdjustmentId) {
        this.ciCareerAdjustmentId = ciCareerAdjustmentId;
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

    public String getSignalType() {
        return signalType;
    }

    public void setSignalType(String signalType) {
        this.signalType = signalType;
    }

    public String getSignalCode() {
        return signalCode;
    }

    public void setSignalCode(String signalCode) {
        this.signalCode = signalCode;
    }

    public String getSignalBand() {
        return signalBand;
    }

    public void setSignalBand(String signalBand) {
        this.signalBand = signalBand;
    }

    public String getClusterName() {
        return clusterName;
    }

    public void setClusterName(String clusterName) {
        this.clusterName = clusterName;
    }

    public BigDecimal getBoostValue() {
        return boostValue;
    }

    public void setBoostValue(BigDecimal boostValue) {
        this.boostValue = boostValue;
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
