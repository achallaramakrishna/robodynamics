package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDStudentSlideProgress;

public interface RDStudentSlideProgressDao {

    // Create or update slide progress
    void saveOrUpdate(RDStudentSlideProgress slideProgress);

    // Find slide progress by its ID
    RDStudentSlideProgress findById(int slideProgressId);

    // Find slide progress by enrollment and slide
    RDStudentSlideProgress findByEnrollmentAndSlide(int enrollmentId, int slideId);

    // Find all slide progress entries for a specific enrollment
    List<RDStudentSlideProgress> findAllByEnrollmentId(int enrollmentId);

    // Delete slide progress entry
    void delete(RDStudentSlideProgress slideProgress);
}
