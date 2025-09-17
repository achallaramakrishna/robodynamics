package com.robodynamics.dto;
public class StudentLiteDTO {
    private int userId;
    private String firstName;
    private String lastName;

    public StudentLiteDTO(int userId, String firstName, String lastName) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    public int getUserId() { return userId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
}
