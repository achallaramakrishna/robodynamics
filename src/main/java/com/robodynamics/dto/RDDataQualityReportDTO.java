package com.robodynamics.dto;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class RDDataQualityReportDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String generatedOn; // ISO timestamp
    private String summary;
    private List<RDDataQualityRowDTO> rows = new ArrayList<>();

    public RDDataQualityReportDTO() {
        this.generatedOn = OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }

    public static RDDataQualityReportDTO now() {
        return new RDDataQualityReportDTO();
    }

    public void addRow(RDDataQualityRowDTO row) {
        if (row != null) rows.add(row);
    }

    // Getters/Setters
    public String getGeneratedOn() { return generatedOn; }
    public void setGeneratedOn(String generatedOn) { this.generatedOn = generatedOn; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<RDDataQualityRowDTO> getRows() { return rows; }
    public void setRows(List<RDDataQualityRowDTO> rows) { this.rows = rows; }
}
