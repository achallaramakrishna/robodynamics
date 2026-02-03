package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamAttempt;

public interface RDExamAttemptDao {

    void saveOrUpdate(RDExamAttempt attempt);

    RDExamAttempt getById(int attemptId);

    RDExamAttempt findActiveAttempt(int examPaperId, int enrollmentId, int studentId);

    RDExamAttempt findLatestAttempt(int examPaperId, int enrollmentId, int studentId);

    List<RDExamAttempt> findAttemptsByEnrollment(int enrollmentId);

    List<RDExamAttempt> findAttemptsByExamPaper(int examPaperId);

    void markSubmitted(int attemptId);

    void markEvaluated(int attemptId, double totalScore);

    boolean hasAnyAttempt(int examPaperId, int enrollmentId, int studentId);
}
