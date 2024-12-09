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
@Table(name = "rd_exam_marks_vs_rank")
public class RDExamMarksVsRank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "exam_id")
    private int examId;

    @Column(name = "marks_min")
    private int marksMin;

    @Column(name = "marks_max")
    private int marksMax;

    @Column(name = "rank_min")
    private int rankMin;

    @Column(name = "rank_max")
    private int rankMax;

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

	public int getMarksMin() {
		return marksMin;
	}

	public void setMarksMin(int marksMin) {
		this.marksMin = marksMin;
	}

	public int getMarksMax() {
		return marksMax;
	}

	public void setMarksMax(int marksMax) {
		this.marksMax = marksMax;
	}

	public int getRankMin() {
		return rankMin;
	}

	public void setRankMin(int rankMin) {
		this.rankMin = rankMin;
	}

	public int getRankMax() {
		return rankMax;
	}

	public void setRankMax(int rankMax) {
		this.rankMax = rankMax;
	}

    // Getters and Setters
    
    
}
