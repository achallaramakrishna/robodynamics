package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_competition_scores")
public class RDCompetitionScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")
    private int scoreId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "round_id")
    private RDCompetitionRound round;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_user_id")
    private RDUser student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "judge_user_id")
    private RDUser judge;

    private double score;

    @Column(columnDefinition = "TEXT")
    private String comments;

    // Getters and Setters
    public int getScoreId() { return scoreId; }
    public void setScoreId(int scoreId) { this.scoreId = scoreId; }

    public RDCompetitionRound getRound() { return round; }
    public void setRound(RDCompetitionRound round) { this.round = round; }

    public RDUser getStudent() { return student; }
    public void setStudent(RDUser student) { this.student = student; }

    public RDUser getJudge() { return judge; }
    public void setJudge(RDUser judge) { this.judge = judge; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
