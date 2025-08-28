package com.robodynamics.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_mentors")
public class RDMentor {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "mentor_id")
  private Integer mentorId;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private RDUser user;

  @Column(name = "display_name")
  private String displayName;

  @Column(name = "headline")
  private String headline;

  @Column(name = "bio", columnDefinition = "TEXT")
  private String bio;

  @Column(name = "years_experience")
  private BigDecimal yearsExperience;

  @Column(name = "hourly_rate_inr")
  private Integer hourlyRateInr;

  @Column(name = "city")
  private String city;

  @Column(name = "area")
  private String area;

  // CSV: "ONLINE,OFFLINE,HOME_VISIT"
  @Column(name = "teaching_modes")
  private String teachingModes;

  // NEW FIELDS
  @Column(name = "active", nullable = false)
  private boolean active = true;               // default true

  @Column(name = "verified", nullable = false)
  private boolean verified = false;            // default false

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  // --- lifecycle hooks for timestamps ---
  @PrePersist
  protected void onCreate() {
    LocalDateTime now = LocalDateTime.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  // --- getters/setters ---
  public Integer getMentorId() { return mentorId; }
  public void setMentorId(Integer mentorId) { this.mentorId = mentorId; }

  public RDUser getUser() { return user; }
  public void setUser(RDUser user) { this.user = user; }

  public String getDisplayName() { return displayName; }
  public void setDisplayName(String displayName) { this.displayName = displayName; }

  public String getHeadline() { return headline; }
  public void setHeadline(String headline) { this.headline = headline; }

  public String getBio() { return bio; }
  public void setBio(String bio) { this.bio = bio; }

  public BigDecimal getYearsExperience() { return yearsExperience; }
  public void setYearsExperience(BigDecimal yearsExperience) { this.yearsExperience = yearsExperience; }

  public Integer getHourlyRateInr() { return hourlyRateInr; }
  public void setHourlyRateInr(Integer hourlyRateInr) { this.hourlyRateInr = hourlyRateInr; }

  public String getCity() { return city; }
  public void setCity(String city) { this.city = city; }

  public String getArea() { return area; }
  public void setArea(String area) { this.area = area; }

  public String getTeachingModes() { return teachingModes; }
  public void setTeachingModes(String teachingModes) { this.teachingModes = teachingModes; }

  public boolean isActive() { return active; }
  public void setActive(boolean active) { this.active = active; }

  public boolean isVerified() { return verified; }
  public void setVerified(boolean verified) { this.verified = verified; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public LocalDateTime getUpdatedAt() { return updatedAt; }
}
