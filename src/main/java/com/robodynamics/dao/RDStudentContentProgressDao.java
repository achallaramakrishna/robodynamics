package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDStudentContentProgress;

public interface RDStudentContentProgressDao {

    // Create or update content progress
	public void saveOrUpdate(RDStudentContentProgress contentProgress);

    // Find content progress by its ID
    public RDStudentContentProgress findById(int contentProgressId);

    // Find content progress by session progress and content type
    public RDStudentContentProgress findBySessionAndContentType(int sessionProgressId, String contentType);

    // Find all content progress entries for a session progress
    public List<RDStudentContentProgress> findAllBySessionProgressId(int sessionProgressId);

    // Delete content progress entry
    public void delete(RDStudentContentProgress contentProgress);
    
    // Method to find the progress by enrollment  and session detail
    public Double findProgressByStudentAndSessionDetail(int enrollmentId, int sessionDetailId);
    
    public double calculateOverallProgress(int sessionProgressId);
    
    public RDStudentContentProgress findBySessionAndContentType(int sessionProgressId, int sessionDetailId, String contentType);

}
