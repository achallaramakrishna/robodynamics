// src/main/java/com/robodynamics/dto/RDMentorDTO.java
package com.robodynamics.dto;

public class RDMentorDTO {
    private int mentorId;
    private String fullName;

    // Optional profile info (may be null/unused for some queries)
    private String city;
    private int experienceYears;
    private String headlineOrPrimarySubjects;
    private String photoUrl;

    // Verification stored as int (1/0) to keep your existing pattern
    private int verifiedOrScore;

    // Needed by your current JPQL: email + phone
    private String email;
    private String cellPhone;

    public String getPhotoUrl() { return photoUrl; }

    // Existing 7-arg ctor (keep as-is)
    public RDMentorDTO(int mentorId, String fullName, String city,
                       Integer experienceYears, String skillLabel,
                       boolean isVerified, String photoUrl) {
        this.mentorId = mentorId;
        this.fullName = fullName;
        this.city = city;
        this.experienceYears = (experienceYears == null) ? 0 : experienceYears;
        this.headlineOrPrimarySubjects = skillLabel;
        this.verifiedOrScore = isVerified ? 1 : 0;
        this.photoUrl = photoUrl;
    }

    // ✅ New 5-arg ctor to match your JPQL:
    // new RDMentorDTO(u.userId, fullName, u.email, u.cellPhone, (u.active == 1))
    public RDMentorDTO(int mentorId, String fullName, String email,
                       String cellPhone, boolean isVerified) {
        this.mentorId = mentorId;
        this.fullName = fullName;
        this.email = email;
        this.cellPhone = cellPhone;
        this.verifiedOrScore = isVerified ? 1 : 0;
    }

    // Getters
    public int getMentorId() { return mentorId; }
    public String getFullName() { return fullName; }
    public String getCity() { return city; }
    public int getExperienceYears() { return experienceYears; }
    public String getHeadlineOrPrimarySubjects() { return headlineOrPrimarySubjects; }
    public int getVerifiedOrScore() { return verifiedOrScore; }
    public boolean isVerified() { return verifiedOrScore == 1; }
    public String getEmail() { return email; }
    public String getCellPhone() { return cellPhone; }
}
