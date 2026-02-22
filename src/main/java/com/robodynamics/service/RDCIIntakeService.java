package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCIIntakeResponse;

public interface RDCIIntakeService {

    RDCIIntakeResponse saveResponse(
            Long subscriptionId,
            Integer parentUserId,
            Integer studentUserId,
            String respondentType,
            String sectionCode,
            String questionCode,
            String answerValue,
            String answerJson);

    List<RDCIIntakeResponse> getBySubscriptionId(Long subscriptionId);
}
