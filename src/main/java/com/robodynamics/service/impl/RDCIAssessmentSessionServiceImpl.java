package com.robodynamics.service.impl;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCIAssessmentSessionDao;
import com.robodynamics.dao.RDCISubscriptionDao;
import com.robodynamics.model.RDCIAssessmentSession;
import com.robodynamics.model.RDCISubscription;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCIAssessmentSessionService;
import com.robodynamics.service.RDUserService;

@Service
public class RDCIAssessmentSessionServiceImpl implements RDCIAssessmentSessionService {

    @Autowired
    private RDCIAssessmentSessionDao ciAssessmentSessionDao;

    @Autowired
    private RDCISubscriptionDao ciSubscriptionDao;

    @Autowired
    private RDUserService rdUserService;

    @Override
    @Transactional
    public RDCIAssessmentSession createSession(Long subscriptionId, Integer studentUserId, String assessmentVersion) {
        if (subscriptionId == null) {
            throw new IllegalArgumentException("subscriptionId is required.");
        }

        RDCISubscription subscription = ciSubscriptionDao.findById(subscriptionId);
        if (subscription == null) {
            throw new IllegalArgumentException("No subscription found for id " + subscriptionId);
        }

        RDUser studentUser = resolveStudentUser(subscription, studentUserId);
        if (studentUser == null || studentUser.getUserID() == null) {
            throw new IllegalArgumentException("studentUserId is required.");
        }

        LocalDateTime now = LocalDateTime.now();
        int nextAttemptNo = ciAssessmentSessionDao.countBySubscriptionId(subscriptionId) + 1;

        RDCIAssessmentSession session = new RDCIAssessmentSession();
        session.setSubscription(subscription);
        session.setStudentUser(studentUser);
        session.setAssessmentVersion(isBlank(assessmentVersion) ? "v1" : assessmentVersion.trim());
        session.setStatus("CREATED");
        session.setAttemptNo(nextAttemptNo);
        session.setCreatedAt(now);
        session.setUpdatedAt(now);

        ciAssessmentSessionDao.save(session);
        return session;
    }

    @Override
    @Transactional
    public RDCIAssessmentSession markInProgress(Long sessionId) {
        RDCIAssessmentSession session = getRequiredSession(sessionId);
        LocalDateTime now = LocalDateTime.now();
        if (session.getStartedAt() == null) {
            session.setStartedAt(now);
        }
        session.setStatus("IN_PROGRESS");
        session.setUpdatedAt(now);
        ciAssessmentSessionDao.save(session);
        return session;
    }

    @Override
    @Transactional
    public RDCIAssessmentSession completeSession(Long sessionId, Integer durationSeconds) {
        RDCIAssessmentSession session = getRequiredSession(sessionId);
        LocalDateTime now = LocalDateTime.now();

        if (session.getStartedAt() == null) {
            session.setStartedAt(now);
        }
        session.setCompletedAt(now);
        session.setStatus("COMPLETED");
        session.setDurationSeconds(resolveDurationSeconds(session, durationSeconds));
        session.setUpdatedAt(now);

        ciAssessmentSessionDao.save(session);
        return session;
    }

    @Override
    @Transactional(readOnly = true)
    public RDCIAssessmentSession getById(Long sessionId) {
        return ciAssessmentSessionDao.findById(sessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCIAssessmentSession> getByStudentUserId(Integer studentUserId) {
        return ciAssessmentSessionDao.findByStudentUserId(studentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public RDCIAssessmentSession getLatestByStudentUserId(Integer studentUserId) {
        return ciAssessmentSessionDao.findLatestByStudentUserId(studentUserId);
    }

    private RDCIAssessmentSession getRequiredSession(Long sessionId) {
        if (sessionId == null) {
            throw new IllegalArgumentException("sessionId is required.");
        }
        RDCIAssessmentSession session = ciAssessmentSessionDao.findById(sessionId);
        if (session == null) {
            throw new IllegalArgumentException("No assessment session found for id " + sessionId);
        }
        return session;
    }

    private RDUser resolveStudentUser(RDCISubscription subscription, Integer studentUserId) {
        if (studentUserId != null) {
            return rdUserService.getRDUser(studentUserId);
        }
        return subscription.getStudentUser();
    }

    private Integer resolveDurationSeconds(RDCIAssessmentSession session, Integer explicitDuration) {
        if (explicitDuration != null && explicitDuration >= 0) {
            return explicitDuration;
        }
        if (session.getStartedAt() == null || session.getCompletedAt() == null) {
            return null;
        }
        long seconds = Duration.between(session.getStartedAt(), session.getCompletedAt()).getSeconds();
        if (seconds < 0) {
            return 0;
        }
        if (seconds > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }
        return (int) seconds;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
