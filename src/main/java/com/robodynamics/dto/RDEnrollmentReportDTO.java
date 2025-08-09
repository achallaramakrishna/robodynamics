// src/main/java/com/robodynamics/dto/RDEnrollmentReportDTO.java
package com.robodynamics.dto;

import java.time.LocalDate;

public class RDEnrollmentReportDTO {
    private int enrollmentId;
    private String studentName;
    private String grade;
    private String parentName;
    private String parentContact;
    private LocalDate enrollmentDate;

    public RDEnrollmentReportDTO(int enrollmentId, String studentName, String grade,
                                 String parentName, String parentContact, LocalDate enrollmentDate) {
        this.enrollmentId = enrollmentId;
        this.studentName = studentName;
        this.grade = grade;
        this.parentName = parentName;
        this.parentContact = parentContact;
        this.enrollmentDate = enrollmentDate;
    }

    // getters
    public int getEnrollmentId() { return enrollmentId; }
    public String getStudentName() { return studentName; }
    public String getGrade() { return grade; }
    public String getParentName() { return parentName; }
    public String getParentContact() { return parentContact; }
    public LocalDate getEnrollmentDate() { return enrollmentDate; }
}
