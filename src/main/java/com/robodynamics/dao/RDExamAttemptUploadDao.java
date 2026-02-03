package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamAttemptUpload;

public interface RDExamAttemptUploadDao {

    void save(RDExamAttemptUpload upload);

    void saveOrUpdate(RDExamAttemptUpload upload);

    RDExamAttemptUpload getById(int uploadId);

    List<RDExamAttemptUpload> findByAttemptId(int attemptId);

    RDExamAttemptUpload findLatestByAttemptId(int attemptId);

    void updateStatus(
            int uploadId,
            RDExamAttemptUpload.UploadStatus status,
            Double qualityScore,
            String qualityRemarks
    );

    void deleteByAttemptId(int attemptId);
}
