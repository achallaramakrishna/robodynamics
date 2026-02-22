package com.robodynamics.model;

import java.math.BigDecimal;
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
@Table(name = "rd_ci_subscription")
public class RDCISubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ci_subscription_id")
    private Long ciSubscriptionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_user_id")
    private RDUser parentUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_user_id")
    private RDUser studentUser;

    @Column(name = "plan_key", nullable = false)
    private String planKey;

    @Column(name = "plan_name", nullable = false)
    private String planName;

    @Column(name = "plan_type", nullable = false)
    private String planType;

    @Column(name = "module_code", nullable = false)
    private String moduleCode;

    @Column(name = "billing_label")
    private String billingLabel;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "base_amount", nullable = false)
    private Integer baseAmount;

    @Column(name = "gst_amount", nullable = false)
    private Integer gstAmount;

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @Column(name = "gst_percent")
    private BigDecimal gstPercent;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "payment_provider", nullable = false)
    private String paymentProvider;

    @Column(name = "provider_order_id")
    private String providerOrderId;

    @Column(name = "provider_payment_id")
    private String providerPaymentId;

    @Column(name = "provider_signature")
    private String providerSignature;

    @Column(name = "course_id")
    private Integer courseId;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCiSubscriptionId() {
        return ciSubscriptionId;
    }

    public void setCiSubscriptionId(Long ciSubscriptionId) {
        this.ciSubscriptionId = ciSubscriptionId;
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

    public String getPlanKey() {
        return planKey;
    }

    public void setPlanKey(String planKey) {
        this.planKey = planKey;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public String getBillingLabel() {
        return billingLabel;
    }

    public void setBillingLabel(String billingLabel) {
        this.billingLabel = billingLabel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getBaseAmount() {
        return baseAmount;
    }

    public void setBaseAmount(Integer baseAmount) {
        this.baseAmount = baseAmount;
    }

    public Integer getGstAmount() {
        return gstAmount;
    }

    public void setGstAmount(Integer gstAmount) {
        this.gstAmount = gstAmount;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getGstPercent() {
        return gstPercent;
    }

    public void setGstPercent(BigDecimal gstPercent) {
        this.gstPercent = gstPercent;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentProvider() {
        return paymentProvider;
    }

    public void setPaymentProvider(String paymentProvider) {
        this.paymentProvider = paymentProvider;
    }

    public String getProviderOrderId() {
        return providerOrderId;
    }

    public void setProviderOrderId(String providerOrderId) {
        this.providerOrderId = providerOrderId;
    }

    public String getProviderPaymentId() {
        return providerPaymentId;
    }

    public void setProviderPaymentId(String providerPaymentId) {
        this.providerPaymentId = providerPaymentId;
    }

    public String getProviderSignature() {
        return providerSignature;
    }

    public void setProviderSignature(String providerSignature) {
        this.providerSignature = providerSignature;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDateTime startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
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
