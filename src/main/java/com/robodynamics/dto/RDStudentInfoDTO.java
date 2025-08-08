package com.robodynamics.dto;

public class RDStudentInfoDTO {
    private int enrollmentId;
    private String firstName;
    private String lastName;

    public RDStudentInfoDTO(int enrollmentId, String firstName, String lastName) {
        this.enrollmentId = enrollmentId;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public int getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(int enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
