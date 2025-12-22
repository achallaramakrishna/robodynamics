package com.robodynamics.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.web.multipart.MultipartFile;


@Entity
@Table(name = "rd_match_question")
public class RDMatchQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_question_id")
    private int matchQuestionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_session_detail_id")
    private RDCourseSessionDetail courseSessionDetail;

    private String instructions;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "total_pairs")
    private int totalPairs;

    @Column(name = "is_active")
    private Boolean active;

    @OneToMany(mappedBy = "matchQuestion",
               cascade = CascadeType.ALL,
               orphanRemoval = true,
               fetch = FetchType.LAZY)
    private List<RDMatchPair> pairs;

	public int getMatchQuestionId() {
		return matchQuestionId;
	}

	public void setMatchQuestionId(int matchQuestionId) {
		this.matchQuestionId = matchQuestionId;
	}

	public RDCourseSessionDetail getCourseSessionDetail() {
		return courseSessionDetail;
	}

	public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
		this.courseSessionDetail = courseSessionDetail;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	public String getDifficultyLevel() {
		return difficultyLevel;
	}

	public void setDifficultyLevel(String difficultyLevel) {
		this.difficultyLevel = difficultyLevel;
	}

	public int getTotalPairs() {
		return totalPairs;
	}

	public void setTotalPairs(int totalPairs) {
		this.totalPairs = totalPairs;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public List<RDMatchPair> getPairs() {
		return pairs;
	}

	public void setPairs(List<RDMatchPair> pairs) {
		this.pairs = pairs;
	}

    
}
