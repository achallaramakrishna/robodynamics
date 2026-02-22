package com.robodynamics.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCIIntakeResponseDao;
import com.robodynamics.dao.RDCISubscriptionDao;
import com.robodynamics.model.RDCIIntakeResponse;
import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCIIntakeService;
import com.robodynamics.service.RDUserService;

@Service
public class RDCIIntakeServiceImpl implements RDCIIntakeService {

    @Autowired
    private RDCIIntakeResponseDao ciIntakeResponseDao;

    @Autowired
    private RDCISubscriptionDao ciSubscriptionDao;

    @Autowired
    private RDUserService rdUserService;

    @Override
    @Transactional
    public RDCIIntakeResponse saveResponse(
            Long subscriptionId,
            Integer parentUserId,
            Integer studentUserId,
            String respondentType,
            String sectionCode,
            String questionCode,
            String answerValue,
            String answerJson) {

        if (subscriptionId == null) {
            throw new IllegalArgumentException("subscriptionId is required.");
        }
        if (isBlank(respondentType) || isBlank(questionCode)) {
            throw new IllegalArgumentException("respondentType and questionCode are required.");
        }

        RDCISubscription subscription = ciSubscriptionDao.findById(subscriptionId);
        if (subscription == null) {
            throw new IllegalArgumentException("No subscription found for id " + subscriptionId);
        }

        String normalizedRespondent = respondentType.trim().toUpperCase(Locale.ENGLISH);
        String normalizedQuestionCode = questionCode.trim().toUpperCase(Locale.ENGLISH);

        RDCIIntakeResponse row = ciIntakeResponseDao.findBySubscriptionRespondentQuestion(
                subscriptionId, normalizedRespondent, normalizedQuestionCode);
        LocalDateTime now = LocalDateTime.now();
        if (row == null) {
            row = new RDCIIntakeResponse();
            row.setSubscription(subscription);
            row.setRespondentType(normalizedRespondent);
            row.setQuestionCode(normalizedQuestionCode);
            row.setCreatedAt(now);
        }

        RDUser parentUser = parentUserId == null ? null : rdUserService.getRDUser(parentUserId);
        RDUser studentUser = studentUserId == null ? null : rdUserService.getRDUser(studentUserId);

        row.setParentUser(parentUser);
        row.setStudentUser(studentUser);
        row.setSectionCode(trimToNull(sectionCode));
        row.setAnswerValue(trimToNull(answerValue));
        row.setAnswerJson(trimToNull(answerJson));
        row.setUpdatedAt(now);

        ciIntakeResponseDao.save(row);
        return row;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCIIntakeResponse> getBySubscriptionId(Long subscriptionId) {
        return ciIntakeResponseDao.findBySubscriptionId(subscriptionId);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
