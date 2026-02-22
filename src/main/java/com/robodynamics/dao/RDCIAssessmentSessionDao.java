package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCIAssessmentSession;

public interface RDCIAssessmentSessionDao {

    void save(RDCIAssessmentSession assessmentSession);

    RDCIAssessmentSession findById(Long sessionId);

    List<RDCIAssessmentSession> findByStudentUserId(Integer studentUserId);

    Integer countBySubscriptionId(Long subscriptionId);

    RDCIAssessmentSession findLatestByStudentUserId(Integer studentUserId);

    long countByStatus(String status);

    long countAll();

    Double averageDurationSecondsForCompleted();
}
