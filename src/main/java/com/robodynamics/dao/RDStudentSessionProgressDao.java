package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDStudentSessionProgress;

public interface RDStudentSessionProgressDao {

    // Create or update session progress
    void saveOrUpdate(RDStudentSessionProgress sessionProgress);

    // Find session progress by its ID
    RDStudentSessionProgress findById(int sessionProgressId);

    // Find session progress by enrollment and session
    RDStudentSessionProgress findByEnrollmentAndSession(int enrollmentId, int sessionId);

    // Find all session progress entries for a specific enrollment
    List<RDStudentSessionProgress> findAllByEnrollmentId(int enrollmentId);

    // Delete a session progress entry
    void delete(RDStudentSessionProgress sessionProgress);
}
