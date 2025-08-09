// src/main/java/com/robodynamics/dto/RDMentorDTO.java
package com.robodynamics.dto;

public class RDMentorDTO {
    private int userId;
    private String fullName;
    private String email;
    private String cellPhone;
    private boolean active;
    private long offeringsCount; // optional summary field

    public RDMentorDTO(int userId, String fullName, String email, String cellPhone, boolean active) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.cellPhone = cellPhone;
        this.active = active;
    }

    public RDMentorDTO(int userId, String fullName, String email, String cellPhone, boolean active, long offeringsCount) {
        this(userId, fullName, email, cellPhone, active);
        this.offeringsCount = offeringsCount;
    }

    public int getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getCellPhone() { return cellPhone; }
    public boolean isActive() { return active; }
    public long getOfferingsCount() { return offeringsCount; }
}
