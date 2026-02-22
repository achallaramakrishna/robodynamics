package com.robodynamics.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCISubscriptionDao;
import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCISubscriptionService;

@Service
public class RDCISubscriptionServiceImpl implements RDCISubscriptionService {

    @Autowired
    private RDCISubscriptionDao ciSubscriptionDao;

    @Override
    @Transactional
    public RDCISubscription recordCheckoutSuccess(
            RDUser parentUser,
            RDUser studentUser,
            String planKey,
            String planName,
            String planType,
            String billingLabel,
            Integer baseAmount,
            Integer gstAmount,
            Integer totalAmount,
            String gstPercentLabel,
            String providerName,
            String providerOrderId,
            String providerPaymentId,
            String providerSignature,
            Integer courseId) {

        LocalDateTime now = LocalDateTime.now();
        RDCISubscription subscription = null;

        if (!isBlank(providerOrderId)) {
            subscription = ciSubscriptionDao.findByProviderOrderId(providerOrderId);
        }
        if (subscription == null) {
            subscription = new RDCISubscription();
            subscription.setCreatedAt(now);
            subscription.setStartAt(now);
        }

        int resolvedBaseAmount = baseAmount == null ? 0 : Math.max(baseAmount, 0);
        int resolvedGstAmount = gstAmount == null ? 0 : Math.max(gstAmount, 0);
        int resolvedTotalAmount = totalAmount == null
                ? resolvedBaseAmount + resolvedGstAmount
                : Math.max(totalAmount, 0);

        subscription.setParentUser(parentUser);
        subscription.setStudentUser(studentUser);
        subscription.setPlanKey(safeTrim(planKey));
        subscription.setPlanName(safeTrim(planName));
        subscription.setPlanType(safeTrim(planType));
        subscription.setModuleCode(resolveModuleCode(planType));
        subscription.setBillingLabel(safeTrim(billingLabel));
        subscription.setStatus("ACTIVE");
        subscription.setBaseAmount(resolvedBaseAmount);
        subscription.setGstAmount(resolvedGstAmount);
        subscription.setTotalAmount(resolvedTotalAmount);
        subscription.setGstPercent(parsePercent(gstPercentLabel));
        subscription.setCurrency("INR");
        subscription.setPaymentProvider(resolveProvider(providerName));
        subscription.setProviderOrderId(safeTrim(providerOrderId));
        subscription.setProviderPaymentId(safeTrim(providerPaymentId));
        subscription.setProviderSignature(safeTrim(providerSignature));
        subscription.setCourseId(courseId);
        subscription.setEndAt(resolveEndAt(subscription.getStartAt(), billingLabel));
        subscription.setUpdatedAt(now);

        ciSubscriptionDao.save(subscription);
        return subscription;
    }

    @Override
    @Transactional(readOnly = true)
    public RDCISubscription getById(Long subscriptionId) {
        return ciSubscriptionDao.findById(subscriptionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCISubscription> getByParentUserId(Integer parentUserId) {
        return ciSubscriptionDao.findByParentUserId(parentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public RDCISubscription getLatestByStudentUserId(Integer studentUserId) {
        return ciSubscriptionDao.findLatestByStudentUserId(studentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveAptiPathSubscription(Integer studentUserId) {
        return hasActiveModuleSubscription(studentUserId, "APTIPATH");
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveModuleSubscription(Integer studentUserId, String moduleCode) {
        return ciSubscriptionDao.findLatestActiveByStudentUserIdAndModuleCode(studentUserId, moduleCode) != null;
    }

    @Override
    @Transactional(readOnly = true)
    public long countActiveByModule(String moduleCode) {
        return ciSubscriptionDao.countByModuleAndStatus(moduleCode, "ACTIVE");
    }

    private LocalDateTime resolveEndAt(LocalDateTime startAt, String billingLabel) {
        if (startAt == null || isBlank(billingLabel)) {
            return null;
        }
        String normalized = billingLabel.trim().toLowerCase(Locale.ENGLISH);
        if ("month".equals(normalized) || "monthly".equals(normalized)) {
            return startAt.plusMonths(1);
        }
        if ("year".equals(normalized) || "yearly".equals(normalized) || "annual".equals(normalized)) {
            return startAt.plusYears(1);
        }
        return null;
    }

    private BigDecimal parsePercent(String rawPercent) {
        if (isBlank(rawPercent)) {
            return null;
        }
        try {
            return new BigDecimal(rawPercent.trim());
        } catch (Exception ex) {
            return null;
        }
    }

    private String resolveProvider(String providerName) {
        if (isBlank(providerName)) {
            return "RAZORPAY";
        }
        return providerName.trim().toUpperCase(Locale.ENGLISH);
    }

    private String resolveModuleCode(String planType) {
        if (isBlank(planType)) {
            return "GENERAL";
        }
        String normalized = planType.trim().toLowerCase(Locale.ENGLISH);
        if ("career".equals(normalized)) {
            return "APTIPATH";
        }
        if ("exam".equals(normalized)) {
            return "EXAM_PREP";
        }
        if ("tuition".equals(normalized)) {
            return "TUITION";
        }
        return "GENERAL";
    }

    private String safeTrim(String value) {
        return value == null ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
