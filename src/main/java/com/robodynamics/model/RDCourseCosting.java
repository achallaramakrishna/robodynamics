package com.robodynamics.model;

import java.sql.Timestamp;
import javax.persistence.*;

@Entity
@Table(name = "rd_course_costing")
public class RDCourseCosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "costing_id")
    private Integer costingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private RDCourse course;

    @Column(name = "grade")
    private String grade;

    @Column(name = "mentor_type")
    private String mentorType;

    @Column(name = "mentor_rate_per_hr")
    private Double mentorRatePerHr;

    @Column(name = "commission_percent")
    private Double commissionPercent;

    @Column(name = "parent_rate_per_hr")
    private Double parentRatePerHr;

    @Column(name = "sessions_per_week")
    private Integer sessionsPerWeek;

    @Column(name = "session_duration")
    private Double sessionDuration;

    @Column(name = "weeks_per_month")
    private Integer weeksPerMonth;

    @Column(name = "monthly_parent_fee")
    private Double monthlyParentFee;

    @Column(name = "monthly_mentor_fee")
    private Double monthlyMentorFee;

    @Column(name = "profit")
    private Double profit;

    @Column(name = "profit_margin")
    private Double profitMargin;

    @Column(name = "created_at")
    private Timestamp createdAt;

	public Integer getCostingId() {
		return costingId;
	}

	public void setCostingId(Integer costingId) {
		this.costingId = costingId;
	}

	public RDCourse getCourse() {
		return course;
	}

	public void setCourse(RDCourse course) {
		this.course = course;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public String getMentorType() {
		return mentorType;
	}

	public void setMentorType(String mentorType) {
		this.mentorType = mentorType;
	}

	public Double getMentorRatePerHr() {
		return mentorRatePerHr;
	}

	public void setMentorRatePerHr(Double mentorRatePerHr) {
		this.mentorRatePerHr = mentorRatePerHr;
	}

	public Double getCommissionPercent() {
		return commissionPercent;
	}

	public void setCommissionPercent(Double commissionPercent) {
		this.commissionPercent = commissionPercent;
	}

	public Double getParentRatePerHr() {
		return parentRatePerHr;
	}

	public void setParentRatePerHr(Double parentRatePerHr) {
		this.parentRatePerHr = parentRatePerHr;
	}

	public Integer getSessionsPerWeek() {
		return sessionsPerWeek;
	}

	public void setSessionsPerWeek(Integer sessionsPerWeek) {
		this.sessionsPerWeek = sessionsPerWeek;
	}

	public Double getSessionDuration() {
		return sessionDuration;
	}

	public void setSessionDuration(Double sessionDuration) {
		this.sessionDuration = sessionDuration;
	}

	public Integer getWeeksPerMonth() {
		return weeksPerMonth;
	}

	public void setWeeksPerMonth(Integer weeksPerMonth) {
		this.weeksPerMonth = weeksPerMonth;
	}

	public Double getMonthlyParentFee() {
		return monthlyParentFee;
	}

	public void setMonthlyParentFee(Double monthlyParentFee) {
		this.monthlyParentFee = monthlyParentFee;
	}

	public Double getMonthlyMentorFee() {
		return monthlyMentorFee;
	}

	public void setMonthlyMentorFee(Double monthlyMentorFee) {
		this.monthlyMentorFee = monthlyMentorFee;
	}

	public Double getProfit() {
		return profit;
	}

	public void setProfit(Double profit) {
		this.profit = profit;
	}

	public Double getProfitMargin() {
		return profitMargin;
	}

	public void setProfitMargin(Double profitMargin) {
		this.profitMargin = profitMargin;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

    
}
