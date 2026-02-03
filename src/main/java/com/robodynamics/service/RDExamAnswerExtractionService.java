package com.robodynamics.service;

import com.robodynamics.model.RDExamSubmission;

public interface RDExamAnswerExtractionService {

    /**
     * Extracts and normalizes student answers from uploaded files
     * (PDF / Image).
     *
     * @param submission RDExamSubmission with file paths
     * @return extracted plain text
     */
    String extractAnswerText(RDExamSubmission submission);
}
