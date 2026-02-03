package com.robodynamics.service;

import com.robodynamics.model.RDExamSubmission;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface RDExamSubmissionService {

    Map<Integer, RDExamSubmission> getStudentSubmissionsForSession(
            Integer studentId,
            Integer sessionId
    );

    RDExamSubmission getLatestSubmission(
            Integer examPaperId,
            Integer studentId
    );

    RDExamSubmission getSubmissionById(Integer submissionId);

	RDExamSubmission createDraftSubmission(Integer examPaperId, Integer userID, MultipartFile[] files);

	RDExamSubmission getByIdWithFiles(Integer submissionId);

	 void markEvaluating(Integer submissionId);

	 void markEvaluated(Integer submissionId);
}
