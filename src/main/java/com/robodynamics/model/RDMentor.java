package com.robodynamics.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rd_mentors")
public class RDMentor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentor_id")
    private Integer mentorId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    // 🔹 New fields
    @Column(name = "headline")
    private String headline;

    @Column(name = "specializations")
    private String specializations; // comma-separated: "JEE, Robotics, Olympiad"

    @Column(name = "teaching_style", columnDefinition = "TEXT")
    private String teachingStyle;

    @Column(name = "avg_rating")
    private Double avgRating = 0.0;

    @Column(name = "student_count")
    private Integer studentCount = 0;

    @Column(name = "demo_count")
    private Integer demoCount = 0;

    @Column(name = "recommendation_count")
    private Integer recommendationCount = 0;

    // Existing fields
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "mobile", nullable = false)
    private String mobile;

    @Column(name = "city")
    private String city;

    @Column(name = "bio")
    private String bio;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "grade_range")
    private String gradeRange;

    @Column(name = "boards_supported")
    private String boardsSupported;

    @Column(name = "modes")
    private String modes;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "is_verified" ,nullable = false)
    private boolean isVerified = false;

    @Column(name = "is_active")
    private Integer isActive;

    @Column(name = "photo_url")
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private RDUser user;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "mentor")
    private List<RDMentorSkill> skills = new ArrayList<>();

    // ----------------------
    // Getters & Setters
    // ----------------------
    public Integer getMentorId() { return mentorId; }
    public void setMentorId(Integer mentorId) { this.mentorId = mentorId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getSpecializations() { return specializations; }
    public void setSpecializations(String specializations) { this.specializations = specializations; }

    public String getTeachingStyle() { return teachingStyle; }
    public void setTeachingStyle(String teachingStyle) { this.teachingStyle = teachingStyle; }

    public Double getAvgRating() { return avgRating; }
    public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }

    public Integer getStudentCount() { return studentCount; }
    public void setStudentCount(Integer studentCount) { this.studentCount = studentCount; }

    public Integer getDemoCount() { return demoCount; }
    public void setDemoCount(Integer demoCount) { this.demoCount = demoCount; }

    public Integer getRecommendationCount() { return recommendationCount; }
    public void setRecommendationCount(Integer recommendationCount) { this.recommendationCount = recommendationCount; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getGradeRange() { return gradeRange; }
    public void setGradeRange(String gradeRange) { this.gradeRange = gradeRange; }

    public String getBoardsSupported() { return boardsSupported; }
    public void setBoardsSupported(String boardsSupported) { this.boardsSupported = boardsSupported; }

    public String getModes() { return modes; }
    public void setModes(String modes) { this.modes = modes; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public boolean getIsVerified() { return isVerified; }
    public void setIsVerified(boolean isVerified) { this.isVerified = isVerified; }

    public Integer getIsActive() { return isActive; }
    public void setIsActive(Integer isActive) { this.isActive = isActive; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public RDUser getUser() { return user; }
    public void setUser(RDUser user) { this.user = user; }

    public List<RDMentorSkill> getSkills() { return skills; }
    public void setSkills(List<RDMentorSkill> skills) { this.skills = skills; }

    @Transient
    public String getPrimarySkillLabel() {
        return skills != null && !skills.isEmpty()
            ? skills.iterator().next().getSkillLabel()
            : "";
    }
    
    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RDMentorFeedback> feedbacks;

    @OneToMany(mappedBy = "mentor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RDMentorRecommendation> recommendations;

    public List<RDMentorFeedback> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<RDMentorFeedback> feedbacks) { this.feedbacks = feedbacks; }

    public List<RDMentorRecommendation> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RDMentorRecommendation> recommendations) { this.recommendations = recommendations; }

}
