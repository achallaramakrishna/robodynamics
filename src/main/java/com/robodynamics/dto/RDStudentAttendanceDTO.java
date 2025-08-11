package com.robodynamics.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class RDStudentAttendanceDTO {

    // Identifiers
    private Integer attendanceId;        // from RDClassAttendance.attendanceId
    private Integer enrollmentId;        // from a.getEnrollment().getEnrollmentId()
    private Integer classSessionId;      // from a.getClassSession().getClassSessionId()
    private Integer courseOfferingId;    // optional: from a.getClassSession().getCourseOffering().getCourseOfferingId()

    // Course offering (optional but very useful for UI)
    private String courseOfferingName;

    // Student
    private Integer userID;
    private String firstName;
    private String lastName;
    private String fullName;

    // Attendance status (store both code and label)
    private Integer attendanceStatus;        // 1=Present, 2=Absent
    private String  attendanceStatusLabel;   // "Present" / "Absent" / etc.

    // Dates/times
    private LocalDate classDate;         // from ClassSession.sessionDate (converted to LocalDate)
    private LocalDate attendanceDate;    // from RDClassAttendance.attendanceDate
    private LocalDateTime attendanceTime;
    private LocalDateTime createdAt;

    // Notes / remarks
    private String remarks;

    // ----- Getters / Setters -----

    public Integer getAttendanceId() { return attendanceId; }
    public void setAttendanceId(Integer attendanceId) { this.attendanceId = attendanceId; }

    public Integer getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(Integer enrollmentId) { this.enrollmentId = enrollmentId; }

    public Integer getClassSessionId() { return classSessionId; }
    public void setClassSessionId(Integer classSessionId) { this.classSessionId = classSessionId; }

    public Integer getCourseOfferingId() { return courseOfferingId; }
    public void setCourseOfferingId(Integer courseOfferingId) { this.courseOfferingId = courseOfferingId; }

    public String getCourseOfferingName() { return courseOfferingName; }
    public void setCourseOfferingName(String courseOfferingName) { this.courseOfferingName = courseOfferingName; }

    public Integer getUserID() { return userID; }
    public void setUserID(Integer userID) { this.userID = userID; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(Integer attendanceStatus) { this.attendanceStatus = attendanceStatus; }

    public String getAttendanceStatusLabel() { return attendanceStatusLabel; }
    public void setAttendanceStatusLabel(String attendanceStatusLabel) { this.attendanceStatusLabel = attendanceStatusLabel; }

    // Backward-compatible convenience setter that accepts an int and derives a label.
    public void setAttendanceStatus(int status) {
        this.attendanceStatus = status;
        this.attendanceStatusLabel = (status == 1) ? "Present"
                                 : (status == 2) ? "Absent"
                                 : "Unknown";
    }

    public LocalDate getClassDate() { return classDate; }
    public void setClassDate(LocalDate classDate) { this.classDate = classDate; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public LocalDateTime getAttendanceTime() { return attendanceTime; }
    public void setAttendanceTime(LocalDateTime attendanceTime) { this.attendanceTime = attendanceTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
