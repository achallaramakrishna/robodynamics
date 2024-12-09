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
@Table(name = "rd_exam_percentile_vs_marks")
public class RDExamPercentileVsMarks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "exam_id")
    private int examId;

    @Column(name = "percentile_min")
    private double percentileMin;

    @Column(name = "percentile_max")
    private double percentileMax;

    @Column(name = "marks_min")
    private int marksMin;

    @Column(name = "marks_max")
    private int marksMax;

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

	public double getPercentileMin() {
		return percentileMin;
	}

	public void setPercentileMin(double percentileMin) {
		this.percentileMin = percentileMin;
	}

	public double getPercentileMax() {
		return percentileMax;
	}

	public void setPercentileMax(double percentileMax) {
		this.percentileMax = percentileMax;
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

    // Getters and Setters
    
    
}
