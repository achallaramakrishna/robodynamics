package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_competition_results")
public class RDCompetitionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private int resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private RDCompetition competition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_user_id")
    private RDUser student;
    
    @Column(name = "total_score")
    private Double totalScore;

    @Column(name = "result_rank")
    private int resultRank;

    @Column(name = "certificate_url")
    private String certificateUrl;

    // Getters and Setters
    public int getResultId() { return resultId; }
    public void setResultId(int resultId) { this.resultId = resultId; }

    public RDCompetition getCompetition() { return competition; }
    public void setCompetition(RDCompetition competition) { this.competition = competition; }

    public RDUser getStudent() { return student; }
    public void setStudent(RDUser student) { this.student = student; }

    public int getResultRank() { return resultRank; }
    public void setResultRank(int resultRank) { this.resultRank = resultRank; }

    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }
	public Double getTotalScore() {
		return totalScore;
	}
	public void setTotalScore(Double totalScore) {
		this.totalScore = totalScore;
	}
    
    
}
