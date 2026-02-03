package com.robodynamics.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_exam_submission_files")
public class RDExamSubmissionFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Integer fileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private RDExamSubmission submission;

    @Column(name = "section_question_id")
    private Integer sectionQuestionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type")
    private FileType fileType;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    public enum FileType {
        IMAGE,
        PDF
    }

    /* ================= Getters & Setters ================= */

    public Integer getFileId() {
        return fileId;
    }

    public void setFileId(Integer fileId) {
        this.fileId = fileId;
    }

    public RDExamSubmission getSubmission() {
        return submission;
    }

    public void setSubmission(RDExamSubmission submission) {
        this.submission = submission;
    }

    public Integer getSectionQuestionId() {
        return sectionQuestionId;
    }

    public void setSectionQuestionId(Integer sectionQuestionId) {
        this.sectionQuestionId = sectionQuestionId;
    }

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
