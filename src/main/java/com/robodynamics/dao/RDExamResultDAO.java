package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.dto.ExamQuestionResultRow;
import com.robodynamics.dto.ExamResultSummaryRow;

public interface RDExamResultDAO {

    ExamResultSummaryRow getResultSummary(Integer submissionId);

    List<ExamQuestionResultRow> getDetailedQuestionResult(Integer submissionId);

	boolean hasStudentAnswerPdf(Integer submissionId);
	
	Object[] getExamMetaBySubmission(Integer submissionId);

	 /* ================= MCQ SUPPORT ================= */

    /**
     * Returns MCQ options for a given question
     * Used in result PDF + preview
     */
    List<Object[]> getMcqOptions(Integer questionId);
}
