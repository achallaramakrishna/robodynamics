package com.robodynamics.dto;

public class RDExamPaperListDTO {

    private Integer examPaperId;
    private String title;
    private String subject;
    private String status;
    private Integer examYear;
	public Integer getExamPaperId() {
		return examPaperId;
	}
	public void setExamPaperId(Integer examPaperId) {
		this.examPaperId = examPaperId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Integer getExamYear() {
		return examYear;
	}
	public void setExamYear(Integer examYear) {
		this.examYear = examYear;
	}

    
}
