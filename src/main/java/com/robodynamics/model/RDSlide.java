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

import com.fasterxml.jackson.annotation.JsonIgnore;

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
	 
	 @Column(name = "slide_order") // New column to define the order of slides
	 private int slideOrder;
	 
	 @Column(name = "slide_number")
	 private Integer slideNumber;
    
    @ManyToOne
    @JoinColumn(name = "course_session_detail_id")
    private RDCourseSessionDetail courseSessionDetail;

    @JsonIgnore  // Prevents the lazy loading of this collection
    @OneToMany(mappedBy = "slide", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RDQuizQuestion> questions;
    
	public RDCourseSessionDetail getCourseSessionDetail() {
		return courseSessionDetail;
	}

	public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
		this.courseSessionDetail = courseSessionDetail;
	}

	
	public List<RDQuizQuestion> getQuestions() {
		return questions;
	}

	public void setQuestions(List<RDQuizQuestion> questions) {
		this.questions = questions;
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

	public int getSlideOrder() {
		return slideOrder;
	}

	public void setSlideOrder(int slideOrder) {
		this.slideOrder = slideOrder;
	}

	
	public Integer getSlideNumber() {
		return this.slideNumber;
	}

	public void setSlideNumber(Integer slideNumber) {
		this.slideNumber = slideNumber;
	}

	
	
	

}
