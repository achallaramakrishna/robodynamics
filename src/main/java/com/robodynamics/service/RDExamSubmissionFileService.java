package com.robodynamics.service;

import java.io.File;

public interface RDExamSubmissionFileService {
    File getStudentAnswerPdf(Integer submissionId);
}
