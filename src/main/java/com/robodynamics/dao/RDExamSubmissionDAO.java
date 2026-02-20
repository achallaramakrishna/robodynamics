package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamSubmission;

public interface RDExamSubmissionDAO {

    RDExamSubmission save(RDExamSubmission submission);

    RDExamSubmission update(RDExamSubmission submission);

    RDExamSubmission findById(Integer submissionId);

    RDExamSubmission findLatestByExamAndStudent(
            Integer examPaperId,
            Integer studentId
    );
    
 // RDExamSubmissionDAO.java
    RDExamSubmission findByIdWithFiles(Integer submissionId);



    /**
     * Atomically marks evaluation as started.
     *
     * @param submissionId submission identifier
     * @return number of rows updated (1 = started now, 0 = already started)
     */
    int markEvaluationStarted(Integer submissionId);
    
	List<RDExamSubmission> findByStudentAndSession(Integer studentId, Integer sessionId);

	int markEvaluatingIfSubmitted(Integer submissionId);

	boolean markEvaluatingIfAllowed(Integer submissionId);

	RDExamSubmission findLatestByStudentAndPaper(Integer studentId, Integer paperId);
}
