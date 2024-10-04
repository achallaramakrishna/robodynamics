package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDStudentContentProgress;

public interface RDStudentContentProgressService {

    // Create or update content progress
    void saveOrUpdate(RDStudentContentProgress contentProgress);

    // Find content progress by its ID
    RDStudentContentProgress findById(int contentProgressId);

    // Find content progress by session progress and content type
    RDStudentContentProgress findBySessionAndContentType(int sessionProgressId, String contentType);

    // Find all content progress entries for a session progress
    List<RDStudentContentProgress> findAllBySessionProgressId(int sessionProgressId);

    // Delete content progress entry
    void delete(RDStudentContentProgress contentProgress);
    
 // Method to get the progress by enrollmentId and session detail
    Double getProgressBySessionDetail(int enrollmentId, int sessionDetailId);
    
    // Method to update progress
    void updateStudentContentProgress(int enrollmentId, int sessionDetailId, String contentType, double progress);

}
