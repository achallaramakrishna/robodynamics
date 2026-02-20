package com.robodynamics.service;

import com.robodynamics.model.RDExamSubmission;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface RDExamSubmissionService {

    /* =====================================================
       CREATE / UPDATE SUBMISSION (UPLOAD)
       ===================================================== */

    RDExamSubmission createDraftSubmission(
            Integer examPaperId,
            Integer studentId,
            MultipartFile[] files
    );
    
    RDExamSubmission findLatestByStudentAndPaper(
            Integer studentId,
            Integer paperId
    );

    /* =====================================================
       START AI EVALUATION (IDEMPOTENT)
       ===================================================== */

    /**
     * Starts evaluation only if it has not already started.
     *
     * @param submissionId submission identifier
     * @return true if evaluation started now, false if already started
     */

    /* =====================================================
       MARK FINAL STATES
       ===================================================== */


    /* =====================================================
       READ OPERATIONS
       ===================================================== */

    RDExamSubmission getLatestSubmission(
            Integer examPaperId,
            Integer studentId
    );

    RDExamSubmission getSubmissionById(Integer submissionId);

    RDExamSubmission getByIdWithFiles(Integer submissionId);

    /**
     * Returns a map of examPaperId → latest submission
     * for a given student and session.
     */
    Map<Integer, RDExamSubmission>
    getStudentSubmissionsForSession(Integer studentId, Integer sessionId);


	boolean markEvaluatingIfAllowed(Integer submissionId);
	
	

	void markEvaluating(Integer submissionId);

	void markEvaluated(Integer submissionId);

}
