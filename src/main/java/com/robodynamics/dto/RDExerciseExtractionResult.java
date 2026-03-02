package com.robodynamics.dto;

import java.util.ArrayList;
import java.util.List;

public class RDExerciseExtractionResult {

    private Integer courseId;
    private int scannedPdfCount;
    private int extractedQuestionCount;
    private String generatedJsonPath;
    private List<String> generatedJsonPaths = new ArrayList<>();
    private RDQuestionBankImportResult importResult;
    private List<String> failedFiles = new ArrayList<>();

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public int getScannedPdfCount() {
        return scannedPdfCount;
    }

    public void setScannedPdfCount(int scannedPdfCount) {
        this.scannedPdfCount = scannedPdfCount;
    }

    public int getExtractedQuestionCount() {
        return extractedQuestionCount;
    }

    public void setExtractedQuestionCount(int extractedQuestionCount) {
        this.extractedQuestionCount = extractedQuestionCount;
    }

    public String getGeneratedJsonPath() {
        return generatedJsonPath;
    }

    public void setGeneratedJsonPath(String generatedJsonPath) {
        this.generatedJsonPath = generatedJsonPath;
    }

    public List<String> getGeneratedJsonPaths() {
        return generatedJsonPaths;
    }

    public void setGeneratedJsonPaths(List<String> generatedJsonPaths) {
        this.generatedJsonPaths = generatedJsonPaths;
    }

    public RDQuestionBankImportResult getImportResult() {
        return importResult;
    }

    public void setImportResult(RDQuestionBankImportResult importResult) {
        this.importResult = importResult;
    }

    public List<String> getFailedFiles() {
        return failedFiles;
    }

    public void setFailedFiles(List<String> failedFiles) {
        this.failedFiles = failedFiles;
    }
}
