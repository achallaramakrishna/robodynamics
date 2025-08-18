package com.robodynamics.dao;

import java.util.List;
import java.util.Optional;

import com.robodynamics.model.RDTestAttempt;

public interface RDTestAttemptDao {

    Integer save(RDTestAttempt attempt);   // returns attemptId

    void update(RDTestAttempt attempt);

    Optional<RDTestAttempt> findByTestAndEnrollment(Integer testId, Integer enrollmentId);

    List<RDTestAttempt> findAllByTest(Integer testId);

    // attempts, avg, min, max — returned as [long count, Double avg, BigDecimal min, BigDecimal max]
    Object[] summary(Integer testId);

    void deleteByTest(Integer testId);
}
