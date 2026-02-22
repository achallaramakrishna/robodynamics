package com.robodynamics.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import java.util.List;

@Entity
@Table(name = "rd_lab_manual")
public class RDLabManual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lab_manual_id")
    private Integer labManualId;

    @Column(name = "course_session_detail_id", nullable = false)
    private Integer sessionDetailId;

    private String title;
    private String version;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "estimated_time_minutes")
    private Integer estimatedTimeMinutes;

    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(name = "reflection_questions", columnDefinition = "TEXT")
    private String reflectionQuestions;

    @Column(name = "evaluation_enabled")
    private Boolean evaluationEnabled;

    @OneToMany(mappedBy = "labManual", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<RDLabSection> sections;

	public Integer getLabManualId() {
		return labManualId;
	}

	public void setLabManualId(Integer labManualId) {
		this.labManualId = labManualId;
	}

	public Integer getSessionDetailId() {
		return sessionDetailId;
	}

	public void setSessionDetailId(Integer sessionDetailId) {
		this.sessionDetailId = sessionDetailId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getDifficultyLevel() {
		return difficultyLevel;
	}

	public void setDifficultyLevel(String difficultyLevel) {
		this.difficultyLevel = difficultyLevel;
	}

	public Integer getEstimatedTimeMinutes() {
		return estimatedTimeMinutes;
	}

	public void setEstimatedTimeMinutes(Integer estimatedTimeMinutes) {
		this.estimatedTimeMinutes = estimatedTimeMinutes;
	}

	public String getObjective() {
		return objective;
	}

	public void setObjective(String objective) {
		this.objective = objective;
	}

	public String getReflectionQuestions() {
		return reflectionQuestions;
	}

	public void setReflectionQuestions(String reflectionQuestions) {
		this.reflectionQuestions = reflectionQuestions;
	}

	public Boolean getEvaluationEnabled() {
		return evaluationEnabled;
	}

	public void setEvaluationEnabled(Boolean evaluationEnabled) {
		this.evaluationEnabled = evaluationEnabled;
	}

	public List<RDLabSection> getSections() {
		return sections;
	}

	public void setSections(List<RDLabSection> sections) {
		this.sections = sections;
	}

    
}
