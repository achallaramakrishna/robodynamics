package com.robodynamics.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "rd_session_assignment_uploads")
public class RDSessionAssignmentUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_detail_id", nullable = false)
    private RDCourseSessionDetail sessionDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private RDUser student;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_path", length = 500)
    private String filePath;
    
    @Column(name = "score")
    private Integer score;

    @Column(name = "feedback")
    private String feedback;

    @Column(name = "upload_time")
    private LocalDateTime uploadTime = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public RDCourseSessionDetail getSessionDetail() {
		return sessionDetail;
	}

	public void setSessionDetail(RDCourseSessionDetail sessionDetail) {
		this.sessionDetail = sessionDetail;
	}

	public RDUser getStudent() {
		return student;
	}

	public void setStudent(RDUser student) {
		this.student = student;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public LocalDateTime getUploadTime() {
		return uploadTime;
	}

	public void setUploadTime(LocalDateTime uploadTime) {
		this.uploadTime = uploadTime;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}
	
	public String getFormattedUploadTime() {
	    return uploadTime != null ? uploadTime.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")) : "";
	}

	
 
    
}
