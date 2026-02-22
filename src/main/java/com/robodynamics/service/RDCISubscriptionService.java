package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDUser;

public interface RDCISubscriptionService {

    RDCISubscription recordCheckoutSuccess(
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
            Integer courseId);

    RDCISubscription getById(Long subscriptionId);

    List<RDCISubscription> getByParentUserId(Integer parentUserId);

    RDCISubscription getLatestByStudentUserId(Integer studentUserId);

    boolean hasActiveAptiPathSubscription(Integer studentUserId);

    boolean hasActiveModuleSubscription(Integer studentUserId, String moduleCode);

    long countActiveByModule(String moduleCode);
}
