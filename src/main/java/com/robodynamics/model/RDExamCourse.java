package com.robodynamics.model;

import javax.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "rd_exam_courses")
public class RDExamCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_course_id")
    private int examCourseId;

    @ManyToOne
    @JoinColumn(name = "past_exam_id", nullable = false)
    private RDPastExamPaper pastExamPaper;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private RDCourse course;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "section_name", nullable = false)
    private String sectionName;
    
    @OneToMany(mappedBy = "examCourse", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<RDQuizQuestion> questions;  // New field for questions


    
    public List<RDQuizQuestion> getQuestions() {
		return questions;
	}

	public void setQuestions(List<RDQuizQuestion> questions) {
		this.questions = questions;
	}

	public int getExamCourseId() {
        return examCourseId;
    }

    public void setExamCourseId(int examCourseId) {
        this.examCourseId = examCourseId;
    }

    public RDPastExamPaper getPastExamPaper() {
        return pastExamPaper;
    }

    public void setPastExamPaper(RDPastExamPaper pastExamPaper) {
        this.pastExamPaper = pastExamPaper;
    }

    public RDCourse getCourse() {
        return course;
    }

    public void setCourse(RDCourse course) {
        this.course = course;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    @Override
    public String toString() {
        return "RDExamCourse [examCourseId=" + examCourseId +
                ", pastExamPaper=" + pastExamPaper.getExamName() +
                ", course=" + course.getCourseName() +
                ", totalMarks=" + totalMarks +
                ", sectionName=" + sectionName + "]";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDExamCourse)) return false;
        RDExamCourse that = (RDExamCourse) o;
        return examCourseId == that.examCourseId &&
                Objects.equals(pastExamPaper, that.pastExamPaper) &&
                Objects.equals(course, that.course) &&
                Objects.equals(totalMarks, that.totalMarks) &&
                Objects.equals(sectionName, that.sectionName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(examCourseId, pastExamPaper, course, totalMarks, sectionName);
    }
}
