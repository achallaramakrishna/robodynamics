package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCIAssessmentSession;

public interface RDCIAssessmentSessionService {

    RDCIAssessmentSession createSession(Long subscriptionId, Integer studentUserId, String assessmentVersion);

    RDCIAssessmentSession markInProgress(Long sessionId);

    RDCIAssessmentSession completeSession(Long sessionId, Integer durationSeconds);

    RDCIAssessmentSession getById(Long sessionId);

    List<RDCIAssessmentSession> getByStudentUserId(Integer studentUserId);

    RDCIAssessmentSession getLatestByStudentUserId(Integer studentUserId);
}
