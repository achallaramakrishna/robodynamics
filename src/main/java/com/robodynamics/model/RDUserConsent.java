package com.robodynamics.model;


import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_user_consents")
public class RDUserConsent {

  public enum Type { PROFILE_PUBLISH }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "consent_id")
  private Integer consentId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private RDUser user;

  @Enumerated(EnumType.STRING)
  @Column(name = "consent_type", nullable = false, length = 32)
  private Type consentType = Type.PROFILE_PUBLISH;

  @Column(name = "consent_text", nullable = false, columnDefinition = "TEXT")
  private String consentText;

  @Column(name = "agreed", nullable = false)
  private Boolean agreed = true;

  @Column(name = "agreed_at")
  private LocalDateTime agreedAt;

  @Column(name = "agreed_ip")
  private String agreedIp;

  @Column(name = "user_agent")
  private String userAgent;

  // --- getters/setters ---
  public Integer getConsentId() { return consentId; }
  public void setConsentId(Integer consentId) { this.consentId = consentId; }
  public RDUser getUser() { return user; }
  public void setUser(RDUser user) { this.user = user; }
  public Type getConsentType() { return consentType; }
  public void setConsentType(Type consentType) { this.consentType = consentType; }
  public String getConsentText() { return consentText; }
  public void setConsentText(String consentText) { this.consentText = consentText; }
  public Boolean getAgreed() { return agreed; }
  public void setAgreed(Boolean agreed) { this.agreed = agreed; }
  public LocalDateTime getAgreedAt() { return agreedAt; }
  public void setAgreedAt(LocalDateTime agreedAt) { this.agreedAt = agreedAt; }
  public String getAgreedIp() { return agreedIp; }
  public void setAgreedIp(String agreedIp) { this.agreedIp = agreedIp; }
  public String getUserAgent() { return userAgent; }
  public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}
