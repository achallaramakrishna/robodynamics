package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCISubscription;

public interface RDCISubscriptionDao {

    void save(RDCISubscription subscription);

    RDCISubscription findById(Long subscriptionId);

    RDCISubscription findByProviderOrderId(String providerOrderId);

    List<RDCISubscription> findByParentUserId(Integer parentUserId);

    RDCISubscription findLatestByStudentUserId(Integer studentUserId);

    RDCISubscription findLatestActiveAptiPathByStudentUserId(Integer studentUserId);

    RDCISubscription findLatestActiveByStudentUserIdAndModuleCode(Integer studentUserId, String moduleCode);

    long countByModuleAndStatus(String moduleCode, String status);
}
