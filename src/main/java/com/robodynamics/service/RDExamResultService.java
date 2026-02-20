package com.robodynamics.service;

import javax.servlet.http.HttpServletResponse;

import com.robodynamics.dto.ExamResultView;

public interface RDExamResultService {
    ExamResultView getResultForSubmission(Integer submissionId);

	void generateResultPdf(Integer submissionId, HttpServletResponse response);
}
