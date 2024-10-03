package com.robodynamics.model;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "rd_slides")
public class RDSlide {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "slide_id")
    private int slideId;
	
	@Column(name = "title")
    private String title;
	
	@Column(name = "content")
    private String content;
	
	 @Column(name = "file_url")  // Changed from image_url to file_url
	 private String fileUrl;  // Updated field name from imageUrl to fileUrl
	 
	 @Column(name = "file_type")  // New column for file type
	 private String fileType;
	 
    
    @ManyToOne
    @JoinColumn(name = "course_session_detail_id")
    private RDCourseSessionDetail courseSessionDetail;

    
    @OneToMany(mappedBy = "slide", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RDFillInBlankQuestion> fillInBlankQuestions;
    
	public RDCourseSessionDetail getCourseSessionDetail() {
		return courseSessionDetail;
	}

	public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
		this.courseSessionDetail = courseSessionDetail;
	}

	public List<RDFillInBlankQuestion> getFillInBlankQuestions() {
		return fillInBlankQuestions;
	}

	public void setFillInBlankQuestions(List<RDFillInBlankQuestion> fillInBlankQuestions) {
		this.fillInBlankQuestions = fillInBlankQuestions;
	}

	// Getters and Setters
    public int getSlideId() {
        return slideId;
    }

    public void setSlideId(int slideId) {
        this.slideId = slideId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

	public String getFileUrl() {
		return fileUrl;
	}

	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
    
	

}
