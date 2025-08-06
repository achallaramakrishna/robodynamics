package com.robodynamics.dto;

public class RDSearchResultDTO {
    private String name;
    private String type;
    private String grade;
    private String course;
    private String status;

    public RDSearchResultDTO(String name, String type, String grade, String course, String status) {
        this.name = name;
        this.type = type;
        this.grade = grade;
        this.course = course;
        this.status = status;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
