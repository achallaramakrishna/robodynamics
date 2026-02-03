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


	List<RDExamSubmission> findByStudentAndSession(Integer studentId, Integer sessionId);
}
