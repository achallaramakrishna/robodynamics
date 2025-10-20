package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_income_sources")
public class RDIncomeSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "source_id")
    private int sourceId;

    @Column(name = "source_name", nullable = false, length = 100)
    private String sourceName;

    @Column(name = "description", length = 255)
    private String description;

    // ---- Getters & Setters ----
    public int getSourceId() {
        return sourceId;
    }

    public void setSourceId(int sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // ---- toString() ----
    @Override
    public String toString() {
        return "RDIncomeSource{" +
                "sourceId=" + sourceId +
                ", sourceName='" + sourceName + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
