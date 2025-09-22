package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "rd_mentors")
public class RDMentor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mentor_id")
    private Integer mentorId;

    @Column(name = "full_name", nullable = false)  private String fullName;
    @Column(name = "email", nullable = false)      private String email;
    @Column(name = "mobile", nullable = false)     private String mobile;

    @Column(name = "city")               private String city;
    @Column(name = "bio")                private String bio;
    @Column(name = "experience_years")   private Integer experienceYears;
    @Column(name = "grade_range")        private String gradeRange;
    @Column(name = "boards_supported")   private String boardsSupported;
    @Column(name = "modes")              private String modes;
    @Column(name = "linkedin_url")       private String linkedinUrl;
    @Column(name = "is_verified")        private Integer isVerified;
    @Column(name = "is_active")          private Integer isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")        // FK (ON DELETE SET NULL)
    private RDUser user;

	public Integer getMentorId() {
		return mentorId;
	}

	public void setMentorId(Integer mentorId) {
		this.mentorId = mentorId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public Integer getExperienceYears() {
		return experienceYears;
	}

	public void setExperienceYears(Integer experienceYears) {
		this.experienceYears = experienceYears;
	}

	public String getGradeRange() {
		return gradeRange;
	}

	public void setGradeRange(String gradeRange) {
		this.gradeRange = gradeRange;
	}

	public String getBoardsSupported() {
		return boardsSupported;
	}

	public void setBoardsSupported(String boardsSupported) {
		this.boardsSupported = boardsSupported;
	}

	public String getModes() {
		return modes;
	}

	public void setModes(String modes) {
		this.modes = modes;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}

	public Integer getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(Integer isVerified) {
		this.isVerified = isVerified;
	}

	public Integer getIsActive() {
		return isActive;
	}

	public void setIsActive(Integer isActive) {
		this.isActive = isActive;
	}

	public RDUser getUser() {
		return user;
	}

	public void setUser(RDUser user) {
		this.user = user;
	}

    
}
