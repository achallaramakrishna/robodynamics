package com.robodynamics.dto;

import java.math.BigDecimal;

public class ExamResultSummaryRow {

	private Integer examPaperId;
    private BigDecimal totalMarksAwarded;
    private BigDecimal totalMarks;
    private String overallFeedback;

    public ExamResultSummaryRow() {}

    // ✅ Add this: works for BigDecimal / Integer / Long / Double etc.
    public ExamResultSummaryRow(Number examPaperId, Number totalMarksAwarded, Number totalMarks, String overallFeedback) {
        this.examPaperId = (examPaperId == null) ? null : examPaperId.intValue();
    	this.totalMarksAwarded = toBigDecimal(totalMarksAwarded);
        this.totalMarks = toBigDecimal(totalMarks);
        this.overallFeedback = overallFeedback;
    }

    
    public Integer getExamPaperId() {
		return examPaperId;
	}

	public void setExamPaperId(Integer examPaperId) {
		this.examPaperId = examPaperId;
	}

	private static BigDecimal toBigDecimal(Number n) {
        return (n == null) ? null : new BigDecimal(n.toString());
    }

	public BigDecimal getTotalMarksAwarded() {
		return totalMarksAwarded;
	}

	public void setTotalMarksAwarded(BigDecimal totalMarksAwarded) {
		this.totalMarksAwarded = totalMarksAwarded;
	}

	public BigDecimal getTotalMarks() {
		return totalMarks;
	}

	public void setTotalMarks(BigDecimal totalMarks) {
		this.totalMarks = totalMarks;
	}

	public String getOverallFeedback() {
		return overallFeedback;
	}

	public void setOverallFeedback(String overallFeedback) {
		this.overallFeedback = overallFeedback;
	}

    
}
