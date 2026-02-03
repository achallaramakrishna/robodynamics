package com.robodynamics.service;

import com.robodynamics.dto.ExamResultView;

public interface RDExamResultService {
    ExamResultView getResultForSubmission(Integer submissionId);
}
