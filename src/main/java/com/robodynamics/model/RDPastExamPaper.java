package com.robodynamics.model;

import javax.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "rd_past_exam_papers")
public class RDPastExamPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "past_exam_id")
    private int pastExamId;

    @Column(name = "exam_name", nullable = false)
    private String examName;

    @Column(name = "exam_year", nullable = false)
    private int examYear;
    
    @Column(name = "exam_code", unique = true)
    private String examCode;

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "exam_level")
    @Enumerated(EnumType.STRING)
    private ExamLevel examLevel;

    @Column(name = "description")
    private String description;
    
    @Column(name = "exam_instructions")
    private String examInstructions;
    
    // Add this field to link with RDExamCourse
    @OneToMany(mappedBy = "pastExamPaper", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<RDExamCourse> examCourses;

    // Getters and Setters for the new field
    public List<RDExamCourse> getExamCourses() {
        return examCourses;
    }

    public void setExamCourses(List<RDExamCourse> examCourses) {
        this.examCourses = examCourses;
    }

    public enum ExamLevel {
        National, State, Local
    }

    
    public String getExamCode() {
		return examCode;
	}

	public void setExamCode(String examCode) {
		this.examCode = examCode;
	}

	public int getPastExamId() {
        return pastExamId;
    }

    public void setPastExamId(int pastExamId) {
        this.pastExamId = pastExamId;
    }

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public int getExamYear() {
        return examYear;
    }

    public void setExamYear(int examYear) {
        this.examYear = examYear;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public ExamLevel getExamLevel() {
        return examLevel;
    }

    public void setExamLevel(ExamLevel examLevel) {
        this.examLevel = examLevel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    

    public String getExamInstructions() {
		return examInstructions;
	}

	public void setExamInstructions(String examInstructions) {
		this.examInstructions = examInstructions;
	}

	@Override
	public String toString() {
		return "RDPastExamPaper [pastExamId=" + pastExamId + ", examName=" + examName + ", examYear=" + examYear
				+ ", totalMarks=" + totalMarks + ", examLevel=" + examLevel + ", description=" + description
				+ ", examInstructions=" + examInstructions + "]";
	}

	
}
