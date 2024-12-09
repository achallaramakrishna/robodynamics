package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "rd_exams")
public class RDExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "exam_name", nullable = false)
    private String examName;

    @Column(name = "exam_year", nullable = false)
    private int examYear;

    @Column(name = "exam_type", nullable = false)
    private String examType;

    @Column(name = "exam_date")
    @Temporal(TemporalType.DATE)
    private Date examDate;

    @Column(name = "created_at", updatable = false, insertable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at", insertable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public int getExamYear() {
        return examYear;
    }

    public void setExamYear(int examYear) {
        this.examYear = examYear;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }

    public Date getExamDate() {
        return examDate;
    }

    public void setExamDate(Date examDate) {
        this.examDate = examDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RDExam rdExam = (RDExam) o;
        return id == rdExam.id && 
               examYear == rdExam.examYear &&
               Objects.equals(examName, rdExam.examName) &&
               Objects.equals(examType, rdExam.examType) &&
               Objects.equals(examDate, rdExam.examDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, examName, examYear, examType, examDate);
    }

    @Override
    public String toString() {
        return "RDExam{" +
               "id=" + id +
               ", examName='" + examName + '\'' +
               ", examYear=" + examYear +
               ", examType='" + examType + '\'' +
               ", examDate=" + examDate +
               ", createdAt=" + createdAt +
               ", updatedAt=" + updatedAt +
               '}';
    }
}
