// src/main/java/com/robodynamics/dto/RDMentorDTO.java
package com.robodynamics.dto;

public class RDMentorDTO {
    private int mentorId;
    private String fullName;
    private String city;
    private int experienceYears;
    private String headlineOrPrimarySubjects;
    private int verifiedOrScore;

    // 🔧 Constructor Hibernate is expecting (int, String, String, int, String, int)
    public RDMentorDTO(int mentorId,
                       String fullName,
                       String city,
                       int experienceYears,
                       String headlineOrPrimarySubjects,
                       int verifiedOrScore) {
        this.mentorId = mentorId;
        this.fullName = fullName;
        this.city = city;
        this.experienceYears = experienceYears;
        this.headlineOrPrimarySubjects = headlineOrPrimarySubjects;
        this.verifiedOrScore = verifiedOrScore;
    }

    // getters (and setters if you need)
    public int getMentorId() { return mentorId; }
    public String getFullName() { return fullName; }
    public String getCity() { return city; }
    public int getExperienceYears() { return experienceYears; }
    public String getHeadlineOrPrimarySubjects() { return headlineOrPrimarySubjects; }
    public int getVerifiedOrScore() { return verifiedOrScore; }
}
