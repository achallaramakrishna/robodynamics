package com.robodynamics.dto;


public class RDOnboardingStatus {
  private boolean hasConsent;
  private boolean hasProfile;
  private boolean hasSkills;

  public boolean isHasConsent() { return hasConsent; }
  public void setHasConsent(boolean hasConsent) { this.hasConsent = hasConsent; }
  public boolean isHasProfile() { return hasProfile; }
  public void setHasProfile(boolean hasProfile) { this.hasProfile = hasProfile; }
  public boolean isHasSkills() { return hasSkills; }
  public void setHasSkills(boolean hasSkills) { this.hasSkills = hasSkills; }
}
