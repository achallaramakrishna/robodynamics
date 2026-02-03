package com.robodynamics.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.*;

@Entity
@Table(name = "rd_exam_attempt_uploads")
public class RDExamAttemptUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "upload_id")
    private Integer uploadId;

    /* ================= RELATION ================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private RDExamAttempt attempt;

    /* ================= FILE INFO ================= */

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", nullable = false)
    private FileType fileType;

    public enum FileType {
        PDF,
        IMAGE
    }

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "page_count")
    private Integer pageCount;

    @Column(name = "file_size_kb")
    private Integer fileSizeKb;

    /* ================= STATUS ================= */

    @Enumerated(EnumType.STRING)
    @Column(name = "upload_status", nullable = false)
    private UploadStatus uploadStatus = UploadStatus.UPLOADED;

    public enum UploadStatus {
        UPLOADED,
        PROCESSING,
        OCR_DONE,
        EVALUATED,
        FAILED
    }

    @Column(name = "quality_score", precision = 4, scale = 2)
    private BigDecimal qualityScore;

    @Column(name = "quality_remarks")
    private String qualityRemarks;

    /* ================= AUDIT ================= */

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    /* ================= GETTERS / SETTERS ================= */

    public Integer getUploadId() {
        return uploadId;
    }

    public void setUploadId(Integer uploadId) {
        this.uploadId = uploadId;
    }

    public RDExamAttempt getAttempt() {
        return attempt;
    }

    public void setAttempt(RDExamAttempt attempt) {
        this.attempt = attempt;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Integer getPageCount() {
        return pageCount;
    }

    public void setPageCount(Integer pageCount) {
        this.pageCount = pageCount;
    }

    public Integer getFileSizeKb() {
        return fileSizeKb;
    }

    public void setFileSizeKb(Integer fileSizeKb) {
        this.fileSizeKb = fileSizeKb;
    }

    public UploadStatus getUploadStatus() {
        return uploadStatus;
    }

    public void setUploadStatus(UploadStatus uploadStatus) {
        this.uploadStatus = uploadStatus;
    }

    public BigDecimal getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(BigDecimal qualityScore) {
        this.qualityScore = qualityScore;
    }

    public String getQualityRemarks() {
        return qualityRemarks;
    }

    public void setQualityRemarks(String qualityRemarks) {
        this.qualityRemarks = qualityRemarks;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}
