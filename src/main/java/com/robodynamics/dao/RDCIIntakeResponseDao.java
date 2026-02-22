package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCIIntakeResponse;

public interface RDCIIntakeResponseDao {

    void save(RDCIIntakeResponse intakeResponse);

    RDCIIntakeResponse findBySubscriptionRespondentQuestion(Long subscriptionId, String respondentType, String questionCode);

    List<RDCIIntakeResponse> findBySubscriptionId(Long subscriptionId);
}
