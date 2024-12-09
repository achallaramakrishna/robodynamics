package com.robodynamics.model;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_exam_cutoffs")
public class RDExamCutoff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "exam_id")
    private int examId;

    @Column(name = "category")
    private String category;

    @Column(name = "cutoff_percentile")
    private String cutoffPercentile;

    @Column(name = "cutoff_score_min")
    private int cutoffScoreMin;

    @Column(name = "cutoff_score_max")
    private int cutoffScoreMax;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getExamId() {
		return examId;
	}

	public void setExamId(int examId) {
		this.examId = examId;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getCutoffPercentile() {
		return cutoffPercentile;
	}

	public void setCutoffPercentile(String cutoffPercentile) {
		this.cutoffPercentile = cutoffPercentile;
	}

	public int getCutoffScoreMin() {
		return cutoffScoreMin;
	}

	public void setCutoffScoreMin(int cutoffScoreMin) {
		this.cutoffScoreMin = cutoffScoreMin;
	}

	public int getCutoffScoreMax() {
		return cutoffScoreMax;
	}

	public void setCutoffScoreMax(int cutoffScoreMax) {
		this.cutoffScoreMax = cutoffScoreMax;
	}

    // Getters and Setters
    
    
}
