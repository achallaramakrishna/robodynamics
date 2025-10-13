package com.robodynamics.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_mentor_recommendations")
public class RDMentorRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommendation_id")
    private Long recommendationId;

    // --- Mentor relation ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private RDMentor mentor;

    // --- User who gave recommendation (FK to rd_users.user_id) ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private RDUser fromUser;

    // --- Recommendation text ---
    @Column(name = "text", columnDefinition = "TEXT", nullable = false)
    private String recommendation;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    // --- Getters and Setters ---
    public Long getRecommendationId() { return recommendationId; }
    public void setRecommendationId(Long recommendationId) { this.recommendationId = recommendationId; }

    public RDMentor getMentor() { return mentor; }
    public void setMentor(RDMentor mentor) { this.mentor = mentor; }

    public RDUser getFromUser() { return fromUser; }
    public void setFromUser(RDUser fromUser) { this.fromUser = fromUser; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
