package com.robodynamics.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "rd_assignments")
public class RDAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private int assignmentId;

    @ManyToOne
    @JoinColumn(name = "course_session_detail_id", nullable = false)
    private RDCourseSessionDetail courseSessionDetail;

    @Column(name = "assignment_title", nullable = false, length = 255)
    private String assignmentTitle;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "expected_output", nullable = false, columnDefinition = "TEXT")
    private String expectedOutput;

    // Getters and Setters

    public int getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(int assignmentId) {
        this.assignmentId = assignmentId;
    }

    public RDCourseSessionDetail getCourseSessionDetail() {
        return courseSessionDetail;
    }

    public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
        this.courseSessionDetail = courseSessionDetail;
    }

    public String getAssignmentTitle() {
        return assignmentTitle;
    }

    public void setAssignmentTitle(String assignmentTitle) {
        this.assignmentTitle = assignmentTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }

    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }

    // Override equals and hashCode for proper equality checks

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDAssignment)) return false;
        RDAssignment that = (RDAssignment) o;
        return assignmentId == that.assignmentId &&
                Objects.equals(courseSessionDetail, that.courseSessionDetail) &&
                Objects.equals(assignmentTitle, that.assignmentTitle) &&
                Objects.equals(description, that.description) &&
                Objects.equals(expectedOutput, that.expectedOutput);
    }

    @Override
    public int hashCode() {
        return Objects.hash(assignmentId, courseSessionDetail, assignmentTitle, description, expectedOutput);
    }

    @Override
    public String toString() {
        return "RDAssignment{" +
                "assignmentId=" + assignmentId +
                ", courseSessionDetail=" + courseSessionDetail +
                ", assignmentTitle='" + assignmentTitle + '\'' +
                ", description='" + description + '\'' +
                ", expectedOutput='" + expectedOutput + '\'' +
                '}';
    }
}
